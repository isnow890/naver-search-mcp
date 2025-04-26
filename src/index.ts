#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { NaverSearchClient } from "./naver-search.client.js";
import { SearchArgsSchema } from "./schemas/search.schemas.js";
import { searchTools } from "./tools/search.tools.js";
import { datalabTools } from "./tools/datalab.tools.js";
import {
  handleAcademicSearch,
  handleBlogSearch,
  handleBookSearch,
  handleCafeArticleSearch,
  handleEncycSearch,
  handleImageSearch,
  handleKinSearch,
  handleLocalSearch,
  handleNewsSearch,
  handleSearch,
  handleShopSearch,
  handleWebSearch,
  handleWebKrSearch,
} from "./handlers/search.handlers.js";
import {
  handleSearchTrend,
  handleShoppingByAgeTrend,
  handleShoppingByDeviceTrend,
  handleShoppingByGenderTrend,
  handleShoppingCategoryTrend,
  handleShoppingKeywordByAgeTrend,
  handleShoppingKeywordByDeviceTrend,
  handleShoppingKeywordByGenderTrend,
  handleShoppingKeywordsTrend,
} from "./handlers/datalab.handlers.js";

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
    version: "1.0.0",
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

    let result;

    switch (name) {
      // 검색 API
      case "search_webkr":
        result = await handleWebKrSearch(SearchArgsSchema.parse(args));
        break;
      case "search_news":
        result = await handleNewsSearch(SearchArgsSchema.parse(args));
        break;
      case "search_blog":
        result = await handleBlogSearch(SearchArgsSchema.parse(args));
        break;
      case "search_shop":
        result = await handleShopSearch(SearchArgsSchema.parse(args));
        break;
      case "search_image":
        result = await handleImageSearch(SearchArgsSchema.parse(args));
        break;
      case "search_kin":
        result = await handleKinSearch(SearchArgsSchema.parse(args));
        break;
      case "search_book":
        result = await handleBookSearch(SearchArgsSchema.parse(args));
        break;
      case "search_encyc":
        result = await handleEncycSearch(SearchArgsSchema.parse(args));
        break;
      case "search_academic":
        result = await handleAcademicSearch(SearchArgsSchema.parse(args));
        break;
      case "search_local":
        result = await handleLocalSearch(args as any);
        break;

      // 데이터랩 API
      case "datalab_search":
        result = await handleSearchTrend(args as any);
        break;
      case "datalab_shopping_category":
        result = await handleShoppingCategoryTrend(args as any);
        break;
      case "datalab_shopping_by_device":
        result = await handleShoppingByDeviceTrend(args as any);
        break;
      case "datalab_shopping_by_gender":
        result = await handleShoppingByGenderTrend(args as any);
        break;
      case "datalab_shopping_by_age":
        result = await handleShoppingByAgeTrend(args as any);
        break;
      case "datalab_shopping_keywords":
        result = await handleShoppingKeywordsTrend(args as any);
        break;
      case "datalab_shopping_keyword_by_device":
        result = await handleShoppingKeywordByDeviceTrend(args as any);
        break;
      case "datalab_shopping_keyword_by_gender":
        result = await handleShoppingKeywordByGenderTrend(args as any);
        break;
      case "datalab_shopping_keyword_by_age":
        result = await handleShoppingKeywordByAgeTrend(args as any);
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

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
