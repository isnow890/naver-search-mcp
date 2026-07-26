#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { NaverSearchClient } from "./clients/naver-search.client.js";
import { searchToolHandlers } from "./handlers/search.handlers.js";
import { datalabToolHandlers } from "./handlers/datalab.handlers.js";
import {
  SearchArgsSchema,
  NaverLocalSearchParamsSchema,
} from "./schemas/search.schemas.js";
import {
  DatalabSearchSchema,
  DatalabShoppingSchema,
  DatalabShoppingDeviceSchema,
  DatalabShoppingGenderSchema,
  DatalabShoppingAgeSchema,
  DatalabShoppingKeywordsSchema,
  DatalabShoppingKeywordDeviceSchema,
  DatalabShoppingKeywordGenderSchema,
  DatalabShoppingKeywordAgeSchema,
} from "./schemas/datalab.schemas.js";
import { FindCategorySchema } from "./schemas/category.schemas.js";
import { findCategoryHandler, clearCategoriesCache } from "./handlers/category.handlers.js";
import { resolveCredentials } from "./config/credentials.js";

// Configuration schema for programmatic server creation and stdio startup
export const configSchema = z.object({
  NAVER_CLIENT_ID: z.string().optional().describe("네이버 개발자센터 Client ID"),
  NAVER_CLIENT_SECRET: z
    .string()
    .optional()
    .describe("네이버 개발자센터 Client Secret"),
  NCP_APIGW_API_KEY_ID: z
    .string()
    .optional()
    .describe("NAVER API HUB Client ID"),
  NCP_APIGW_API_KEY: z
    .string()
    .optional()
    .describe("NAVER API HUB Client Secret"),
});

// Global server instance to prevent memory leaks
let globalServerInstance: McpServer | null = null;
let currentConfig: z.infer<typeof configSchema> | null = null;

/**
 * 서버 인스턴스와 관련 리소스 정리 (메모리 누수 방지)
 */
export function resetServerInstance(): void {
  if (globalServerInstance) {
    // 클라이언트 인스턴스 정리
    NaverSearchClient.destroyInstance();

    // 카테고리 캐시 정리
    clearCategoriesCache();

    globalServerInstance = null;
    currentConfig = null;

    console.error("Server instance and resources cleaned up");
  }
}

/**
 * 설정 변경 감지 함수
 */
function isConfigChanged(newConfig: z.infer<typeof configSchema>): boolean {
  if (!currentConfig) return true;
  return (
    currentConfig.NAVER_CLIENT_ID !== newConfig.NAVER_CLIENT_ID ||
    currentConfig.NAVER_CLIENT_SECRET !== newConfig.NAVER_CLIENT_SECRET ||
    currentConfig.NCP_APIGW_API_KEY_ID !== newConfig.NCP_APIGW_API_KEY_ID ||
    currentConfig.NCP_APIGW_API_KEY !== newConfig.NCP_APIGW_API_KEY
  );
}

export function createNaverSearchServer({
  config,
}: {
  config: z.infer<typeof configSchema>;
}) {
  // 설정이 변경된 경우 기존 인스턴스 정리
  if (globalServerInstance && isConfigChanged(config)) {
    console.error("Configuration changed, resetting server instance");
    resetServerInstance();
  }

  // Reuse existing server instance to prevent memory leaks
  if (globalServerInstance) {
    return globalServerInstance;
  }

  // Create a new MCP server only once
  const server = new McpServer({
    name: "naver-search",
    version: "1.0.49",
  });

  // Initialize Naver client with config
  const credentials = resolveCredentials(config);
  console.error(
    `Using ${
      credentials.provider === "hub"
        ? "NAVER API HUB"
        : "네이버 개발자센터 (2027-06-30 지원 종료 예정)"
    }`
  );
  if (credentials.warning) {
    console.error(`[경고] ${credentials.warning}`);
  }
  const client = NaverSearchClient.getInstance();
  client.initialize(credentials);

  server.registerTool(
    "search_webkr",
    {
      description:
        "🌐 Search Korean web documents and general content. Comprehensive search across Korean websites and online content. Find articles, information, and documents from various Korean sources. (네이버 웹문서 검색 - 한국 웹사이트 종합 검색)",
      inputSchema: SearchArgsSchema.shape,
    },
    async (args) => {
      const result = await searchToolHandlers.search_webkr(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "search_news",
    {
      description:
        "📰 Search latest Korean news articles from major outlets. Perfect for current events, breaking news, and recent developments. Covers politics, economy, society, and international news. (네이버 뉴스 검색 - 최신 뉴스와 시사 정보)",
      inputSchema: SearchArgsSchema.shape,
    },
    async (args) => {
      const result = await searchToolHandlers.search_news(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "search_blog",
    {
      description:
        "✍️ Search personal blogs and reviews for authentic user experiences. Great for product reviews, personal stories, detailed tutorials, and real user opinions. Find genuine Korean perspectives. (네이버 블로그 검색 - 실제 사용자 후기와 개인적 경험)",
      inputSchema: SearchArgsSchema.shape,
    },
    async (args) => {
      const result = await searchToolHandlers.search_blog(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "search_image",
    {
      description:
        "🖼️ Search for images with Korean context and relevance. Find visual content, infographics, charts, and photos related to your search terms. Great for visual research and content discovery. (네이버 이미지 검색 - 시각적 컨텐츠 발견)",
      inputSchema: SearchArgsSchema.shape,
    },
    async (args) => {
      const result = await searchToolHandlers.search_image(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "search_kin",
    {
      description:
        "❓ Search Naver KnowledgeiN for Q&A and community-driven answers. Find solutions to problems, get expert advice, and discover community insights on various topics. (네이버 지식iN 검색 - 질문과 답변, 커뮤니티 지식)",
      inputSchema: SearchArgsSchema.shape,
    },
    async (args) => {
      const result = await searchToolHandlers.search_kin(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "search_encyc",
    {
      description:
        "📖 Search Naver Encyclopedia for authoritative knowledge and definitions. Best for academic research, getting reliable information, and understanding Korean concepts and terminology. (네이버 지식백과 검색 - 신뢰할 수 있는 정보와 정의)",
      inputSchema: SearchArgsSchema.shape,
    },
    async (args) => {
      const result = await searchToolHandlers.search_encyc(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "search_local",
    {
      description:
        "📍 Search for local businesses, restaurants, and places in Korea. Find location information, reviews, contact details, and business hours for Korean establishments. (네이버 지역 검색 - 지역 업체와 장소 정보)",
      inputSchema: NaverLocalSearchParamsSchema.shape,
    },
    async (args) => {
      const result = await searchToolHandlers.search_local(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "search_cafearticle",
    {
      description:
        "☕ Search Naver Cafe articles for community discussions and specialized content. Find niche communities, hobby groups, and specialized discussions on various topics. (네이버 카페글 검색 - 커뮤니티 토론과 전문 정보)",
      inputSchema: SearchArgsSchema.shape,
    },
    async (args) => {
      const result = await searchToolHandlers.search_cafearticle(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Register datalab tools
  server.registerTool(
    "datalab_search",
    {
      description:
        "📊 Analyze search keyword trends over time using Naver DataLab. Track popularity changes, seasonal patterns, and compare multiple keywords. Perfect for market research and trend analysis. (네이버 데이터랩 검색어 트렌드 분석)",
      inputSchema: DatalabSearchSchema.shape,
    },
    async (args) => {
      const result = await datalabToolHandlers.datalab_search(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "datalab_shopping_category",
    {
      description:
        "🛍️ STEP 2: Analyze shopping category trends over time. Use find_category first to get category codes. BUSINESS CASES: Market size analysis, seasonal trend identification, category performance comparison. EXAMPLE: Compare '패션의류' vs '화장품' trends over 6 months. (네이버 쇼핑 카테고리별 트렌드 분석 - 먼저 find_category 도구로 카테고리 코드를 찾으세요)",
      inputSchema: DatalabShoppingSchema.shape,
    },
    async (args) => {
      const result = await datalabToolHandlers.datalab_shopping_category(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "datalab_shopping_by_device",
    {
      description:
        "📱 Analyze shopping trends by device (PC vs Mobile). Use find_category first. BUSINESS CASES: Mobile commerce strategy, responsive design priority, device-specific campaigns. EXAMPLE: 'PC 사용자가 더 많이 구매하는 카테고리는?' (기기별 쇼핑 트렌드 분석 - 먼저 find_category 도구로 카테고리 코드를 찾으세요)",
      inputSchema: DatalabShoppingDeviceSchema.pick({
        startDate: true,
        endDate: true,
        timeUnit: true,
        category: true,
        device: true,
      }).shape,
    },
    async (args) => {
      const result = await datalabToolHandlers.datalab_shopping_by_device(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "datalab_shopping_by_gender",
    {
      description:
        "👥 Analyze shopping trends by gender (Male vs Female). Use find_category first. BUSINESS CASES: Gender-targeted marketing, product positioning, demographic analysis. EXAMPLE: '화장품 쇼핑에서 남녀 비율은?' (성별 쇼핑 트렌드 분석 - 먼저 find_category 도구로 카테고리 코드를 찾으세요)",
      inputSchema: DatalabShoppingGenderSchema.pick({
        startDate: true,
        endDate: true,
        timeUnit: true,
        category: true,
        gender: true,
      }).shape,
    },
    async (args) => {
      const result = await datalabToolHandlers.datalab_shopping_by_gender(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "datalab_shopping_by_age",
    {
      description:
        "👶👦👨👴 Analyze shopping trends by age groups (10s, 20s, 30s, 40s, 50s, 60s+). Use find_category first. BUSINESS CASES: Age-targeted products, generational preferences, lifecycle marketing. EXAMPLE: '개발 도구는 어느 연령대가 많이 구매하나?' (연령별 쇼핑 트렌드 - 먼저 find_category 도구로 카테고리 코드를 찾으세요)",
      inputSchema: DatalabShoppingAgeSchema.pick({
        startDate: true,
        endDate: true,
        timeUnit: true,
        category: true,
        ages: true,
      }).shape,
    },
    async (args) => {
      const result = await datalabToolHandlers.datalab_shopping_by_age(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "datalab_shopping_keywords",
    {
      description:
        "🔍 Compare specific keywords within a shopping category. Use find_category first. BUSINESS CASES: Product keyword optimization, competitor analysis, search trend identification. EXAMPLE: Within '패션' category, compare '원피스' vs '자켓' vs '드레스' trends. (카테고리 내 키워드 비교 - 먼저 find_category 도구로 카테고리 코드를 찾으세요)",
      inputSchema: DatalabShoppingKeywordsSchema.shape,
    },
    async (args) => {
      const result = await datalabToolHandlers.datalab_shopping_keywords(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "datalab_shopping_keyword_by_device",
    {
      description:
        "📱🔍 Analyze keyword performance by device within shopping categories. Use find_category first to get category codes. Perfect for understanding mobile vs desktop shopping behavior for specific products. (쇼핑 키워드 기기별 트렌드 - 먼저 find_category 도구로 카테고리 코드를 찾으세요)",
      inputSchema: DatalabShoppingKeywordDeviceSchema.shape,
    },
    async (args) => {
      const result =
        await datalabToolHandlers.datalab_shopping_keyword_by_device(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "datalab_shopping_keyword_by_gender",
    {
      description:
        "👥🔍 Analyze keyword performance by gender within shopping categories. Use find_category first to get category codes. Essential for gender-targeted marketing and product positioning strategies. (쇼핑 키워드 성별 트렌드 - 먼저 find_category 도구로 카테고리 코드를 찾으세요)",
      inputSchema: DatalabShoppingKeywordGenderSchema.shape,
    },
    async (args) => {
      const result =
        await datalabToolHandlers.datalab_shopping_keyword_by_gender(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "datalab_shopping_keyword_by_age",
    {
      description:
        "👶👦👨👴🔍 Analyze keyword performance by age groups within shopping categories. Use find_category first to get category codes. Perfect for age-targeted marketing and understanding generational shopping preferences. (쇼핑 키워드 연령별 트렌드 - 먼저 find_category 도구로 카테고리 코드를 찾으세요)",
      inputSchema: DatalabShoppingKeywordAgeSchema.shape,
    },
    async (args) => {
      const result = await datalabToolHandlers.datalab_shopping_keyword_by_age(
        args
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Register category search tool
  server.registerTool(
    "find_category",
    {
      description:
        "🚀 STEP 1: Find shopping categories with Korean search terms. Search in KOREAN (패션, 화장품, 가전제품, etc.) to find category codes needed for datalab tools. Smart fuzzy matching finds similar categories even with partial matches. (카테고리 검색: 한국어로 검색하여 데이터랩 분석에 필요한 카테고리 코드를 찾아주는 필수 도구)",
      inputSchema: FindCategorySchema.shape,
    },
    async (args) => {
      const result = await findCategoryHandler(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Cache the server instance and config
  globalServerInstance = server;
  currentConfig = config;

  return server.server;
}

// Export the server factory for programmatic consumers
export default createNaverSearchServer;

function registerShutdownHandlers({
  server,
  transport,
}: {
  server: ReturnType<typeof createNaverSearchServer>;
  transport: StdioServerTransport;
}): void {
  let shuttingDown = false;

  const shutdown = async (reason: string, exitCode = 0) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.error(`Shutting down: ${reason}`);

    try {
      await server.close();
    } catch (error) {
      console.error("Error while closing server:", error);
    } finally {
      resetServerInstance();
    }

    process.exit(exitCode);
  };

  transport.onclose = () => {
    void shutdown("transport closed");
  };

  transport.onerror = (error) => {
    console.error("Transport error:", error);
    void shutdown("transport error", 1);
  };

  const handleStdinClosed = () => {
    void shutdown("stdin closed");
  };

  process.stdin.once("end", handleStdinClosed);
  process.stdin.once("close", handleStdinClosed);

  process.once("SIGINT", () => void shutdown("SIGINT"));
  process.once("SIGTERM", () => void shutdown("SIGTERM"));
}

// Main function to run the server when executed directly
async function main() {
  try {
    console.error("Starting Naver Search MCP Server...");

    // Get config from environment variables
    const config = {
      NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID,
      NAVER_CLIENT_SECRET: process.env.NAVER_CLIENT_SECRET,
      NCP_APIGW_API_KEY_ID: process.env.NCP_APIGW_API_KEY_ID,
      NCP_APIGW_API_KEY: process.env.NCP_APIGW_API_KEY,
    };

    console.error("Environment variables:", {
      NAVER_CLIENT_ID: config.NAVER_CLIENT_ID
        ? `[${config.NAVER_CLIENT_ID.length} chars]`
        : "undefined",
      NAVER_CLIENT_SECRET: config.NAVER_CLIENT_SECRET
        ? `[${config.NAVER_CLIENT_SECRET.length} chars]`
        : "undefined",
      NCP_APIGW_API_KEY_ID: config.NCP_APIGW_API_KEY_ID
        ? `[${config.NCP_APIGW_API_KEY_ID.length} chars]`
        : "undefined",
      NCP_APIGW_API_KEY: config.NCP_APIGW_API_KEY
        ? `[${config.NCP_APIGW_API_KEY.length} chars]`
        : "undefined",
    });

    // 자격증명 유효성은 여기서 먼저 확인한다 (실패 시 명확한 안내와 함께 종료)
    resolveCredentials(config);

    // Validate config
    const validatedConfig = configSchema.parse(config);
    console.error("Config validated successfully");

    // Create server instance
    const serverFactory = createNaverSearchServer({ config: validatedConfig });
    console.error("Server factory created");

    // Create transport and run server
    const transport = new StdioServerTransport();
    console.error("Transport created, connecting...");

    registerShutdownHandlers({ server: serverFactory, transport });

    await serverFactory.connect(transport);
    console.error("Server connected and running");
  } catch (error) {
    console.error("Error in main function:", error);
    throw error;
  }
}

// Run main function if this file is executed directly
// Note: Always run main in CLI mode since this is an MCP server
console.error("Starting MCP server initialization...");
console.error("process.argv:", process.argv);

// Check if running as main module - compatible with both ESM and CommonJS
let isMainModule = false;
try {
  // Try ESM approach first
  if (typeof import.meta !== "undefined" && import.meta.url) {
    console.error("import.meta.url:", import.meta.url);
    isMainModule =
      import.meta.url === `file://${process.argv[1]}` ||
      import.meta.url.endsWith(process.argv[1]) ||
      process.argv[1].endsWith("index.js");
  } else {
    // Fallback for CommonJS or when import.meta is not available
    isMainModule =
      process.argv[1].endsWith("index.js") ||
      process.argv[1].includes("naver-search-mcp");
  }
  
  // Additional check for NPX execution
  if (!isMainModule && process.argv.some(arg => arg.includes('naver-search-mcp'))) {
    isMainModule = true;
    console.error("Detected NPX execution, forcing main module mode");
  }
} catch (error) {
  // Fallback for environments where import.meta causes issues
  isMainModule =
    process.argv[1].endsWith("index.js") ||
    process.argv[1].includes("naver-search-mcp");
}

console.error("isMainModule:", isMainModule);

if (isMainModule) {
  console.error("Running as main module, starting server...");
  main().catch((error) => {
    console.error("Server failed to start:", error);
    process.exit(1);
  });
} else {
  console.error("Not running as main module, skipping server start");
}
