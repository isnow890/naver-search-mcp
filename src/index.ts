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
import { join, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { platform } from "os";

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
  const { name, arguments: args } = request.params;
  console.error(`[CallTool] 요청: ${name} | 파라미터:`, args);

  // 여기서만 환경변수 체크 및 클라이언트 초기화
  const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
  const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
    return createErrorResponse(
      "NAVER_CLIENT_ID and NAVER_CLIENT_SECRET environment variables are required"
    );
  }

  // 클라이언트 초기화(이미 되어있으면 무시)
  const client = NaverSearchClient.getInstance();
  if (!client["config"]) {
    client.initialize({
      clientId: NAVER_CLIENT_ID,
      clientSecret: NAVER_CLIENT_SECRET,
    });
  }

  try {
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
    console.error(`[CallTool] 결과: ${name} | 결과:`, result);
    return result;
  } catch (error) {
    console.error(`[CallTool] 에러: ${name} | 에러:`, error);
    return createErrorResponse(error);
  }
});

async function runSetup() {
  try {
    console.error("[Lifecycle] Entering setup mode...");
    // Fix for Windows ESM path issue
    const setupScriptPath = join(__dirname, "setup-claude-server.js");
    const setupScriptUrl = pathToFileURL(setupScriptPath);

    // Now import using the URL format
    const { default: setupModule } = await import(setupScriptUrl.href);
    if (typeof setupModule === "function") {
      await setupModule();
      console.error("[Lifecycle] Setup module executed successfully.");
    } else {
      console.error("[Lifecycle] Setup module is not a function.");
    }
  } catch (error) {
    console.error("[Lifecycle] Error running setup:", error);
    process.stderr.write(
      `[Lifecycle] Error running setup: ${
        error instanceof Error ? error.stack : String(error)
      }\n`
    );
    process.exit(1);
  }
}

async function runServer() {
  try {
    console.error("[Lifecycle] Server process started.");
    console.error(
      `[Lifecycle] Command-line arguments: ${JSON.stringify(process.argv)}`
    );
    console.error(`[Lifecycle] NODE_ENV: ${process.env.NODE_ENV}`);
    // 주요 환경변수 로그 (보안상 민감정보는 마스킹)
    if (process.env.BRAVE_API_KEY) {
      console.error("[Lifecycle] BRAVE_API_KEY is set.");
    }
    if (process.env.NAVER_CLIENT_ID) {
      console.error("[Lifecycle] NAVER_CLIENT_ID is set.");
    }
    if (process.env.NAVER_CLIENT_SECRET) {
      console.error("[Lifecycle] NAVER_CLIENT_SECRET is set.");
    }

    const transport = new StdioServerTransport();

    console.error("[Lifecycle] Transport created.");
    // Check if first argument is "setup"
    if (process.argv[2] === "setup") {
      await runSetup();
      console.error("[Lifecycle] Setup mode completed. Exiting.");
      return;
    }

    // Handle uncaught exceptions
    process.on("uncaughtException", async (error) => {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      process.stderr.write(
        `[desktop-commander] Uncaught exception: ${errorMessage}\n`
      );
      process.stderr.write(
        `[desktop-commander] Stack: ${
          error instanceof Error && error.stack
            ? error.stack
            : "No stack trace available"
        }\n`
      );
      process.stderr.write(
        `[desktop-commander] Error object: ${JSON.stringify(
          error,
          Object.getOwnPropertyNames(error)
        )}\n`
      );
      // If this is a JSON parsing error, log it to stderr but don't crash
      if (
        errorMessage.includes("JSON") &&
        errorMessage.includes("Unexpected token")
      ) {
        process.stderr.write(
          `[desktop-commander] JSON parsing error: ${errorMessage}\n`
        );
        return; // Don't exit on JSON parsing errors
      }
      // capture('run_server_uncaught_exception', {
      //   error: errorMessage
      // });
      process.exit(1);
    });

    // Handle unhandled rejections
    process.on("unhandledRejection", async (reason) => {
      const errorMessage =
        reason instanceof Error ? reason.message : String(reason);
      process.stderr.write(
        `[desktop-commander] Unhandled rejection: ${errorMessage}\n`
      );
      process.stderr.write(
        `[desktop-commander] Stack: ${
          reason instanceof Error && reason.stack
            ? reason.stack
            : "No stack trace available"
        }\n`
      );
      process.stderr.write(
        `[desktop-commander] Error object: ${JSON.stringify(
          reason,
          Object.getOwnPropertyNames(reason)
        )}\n`
      );
      // If this is a JSON parsing error, log it to stderr but don't crash
      if (
        errorMessage.includes("JSON") &&
        errorMessage.includes("Unexpected token")
      ) {
        process.stderr.write(
          `[desktop-commander] JSON parsing rejection: ${errorMessage}\n`
        );
        return; // Don't exit on JSON parsing errors
      }
      // capture('run_server_unhandled_rejection', {
      //   error: errorMessage
      // });
      process.exit(1);
    });

    // capture('run_server_start');

    try {
      // console.error('[Lifecycle] Loading configuration...');
      // await configManager.loadConfig();
      // console.error('[Lifecycle] Configuration loaded successfully');
    } catch (configError) {
      // console.error(`[Lifecycle] Failed to load configuration: ${configError instanceof Error ? configError.message : String(configError)}`);
      // console.error(configError instanceof Error && configError.stack ? configError.stack : 'No stack trace available');
      // process.stderr.write(`[Lifecycle] Failed to load configuration: ${configError instanceof Error ? configError.stack : String(configError)}\n`);
      // console.error('[Lifecycle] Continuing with in-memory configuration only');
      // // Continue anyway - we'll use an in-memory config
    }

    console.error("[Lifecycle] Connecting server...");
    await server.connect(transport);
    console.error("[Lifecycle] Server connected successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Lifecycle] FATAL ERROR: ${errorMessage}`);
    console.error(
      error instanceof Error && error.stack
        ? error.stack
        : "No stack trace available"
    );
    process.stderr.write(
      JSON.stringify({
        type: "error",
        timestamp: new Date().toISOString(),
        message: `Failed to start server: ${errorMessage}`,
      }) + "\n"
    );
    process.stderr.write(
      `[Lifecycle] Error object: ${JSON.stringify(
        error,
        Object.getOwnPropertyNames(error)
      )}\n`
    );
    // capture('run_server_failed_start_error', {
    //   error: errorMessage
    // });
    process.exit(1);
  }
}

runServer().catch(async (error) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`[Lifecycle] RUNTIME ERROR: ${errorMessage}`);
  console.error(
    error instanceof Error && error.stack
      ? error.stack
      : "No stack trace available"
  );
  process.stderr.write(
    JSON.stringify({
      type: "error",
      timestamp: new Date().toISOString(),
      message: `Fatal error running server: ${errorMessage}`,
    }) + "\n"
  );
  process.stderr.write(
    `[Lifecycle] Error object: ${JSON.stringify(
      error,
      Object.getOwnPropertyNames(error)
    )}\n`
  );
  // capture('run_server_fatal_error', {
  //   error: errorMessage
  // });
  process.exit(1);
});
