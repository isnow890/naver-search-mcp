import * as dotenv from "dotenv";
import pkg from "../package.json" with { type: "json" };

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { NaverSearchClient } from "./clients/naver-search.client.js";
import { searchTools } from "./tools/search.tools.js";
import { datalabTools } from "./tools/datalab.tools.js";
import { searchToolHandlers } from "./handlers/search.handlers.js";
import { datalabToolHandlers } from "./handlers/datalab.handlers.js";

dotenv.config();

// 환경 변수 유효성 검사
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID!;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET!;

if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
  console.error(
    "Error: NAVER_CLIENT_ID and NAVER_CLIENT_SECRET environment variables are required"
  );
  process.exit(1);
}

// 네이버 검색 클라이언트 초기화
const client = NaverSearchClient.getInstance();
client.initialize({
  clientId: NAVER_CLIENT_ID,
  clientSecret: NAVER_CLIENT_SECRET,
});

// MCP 서버 인스턴스 생성
const server = new Server(
  {
    name: "naver-search",
    version: pkg.version,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 도구 목록을 반환하는 핸들러 등록
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [...searchTools, ...datalabTools],
  };
});

const toolHandlers: Record<string, (args: any) => Promise<any>> = {
  ...searchToolHandlers,
  ...datalabToolHandlers,
};

// 에러 응답 헬퍼 함수
function createErrorResponse(error: unknown): {
  content: Array<{ type: string; text: string }>;
  isError: boolean;
} {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error("API Error:", errorMessage);
  return {
    content: [{ type: "text", text: `Error: ${errorMessage}` }],
    isError: true,
  };
}

// 도구 실행 요청 핸들러 등록
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;
    console.error(`Executing tool: ${name} with args:`, args);

    if (!args) {
      throw new Error("Arguments are required");
    }

    const handler = toolHandlers[name];
    if (!handler) throw new Error(`Unknown tool: ${name}`);
    const result = await handler(args);

    console.error(`Tool ${name} executed successfully`);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (error) {
    return createErrorResponse(error);
  }
});

// 서버 시작 함수
async function runServer() {
  try {
    const transport = new StdioServerTransport();

    // 서버 에러 핸들링
    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
    });

    await server.connect(transport);
    console.error("Naver Search MCP Server running on stdio");
  } catch (error) {
    console.error("Fatal error running server:", error);
    process.exit(1);
  }
}

// 서버 시작
runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
