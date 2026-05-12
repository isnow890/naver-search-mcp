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

// Configuration schema for programmatic server creation and stdio startup
export const configSchema = z.object({
  NAVER_CLIENT_ID: z.string().describe("Naver API Client ID"),
  NAVER_CLIENT_SECRET: z.string().describe("Naver API Client Secret"),
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
    currentConfig.NAVER_CLIENT_SECRET !== newConfig.NAVER_CLIENT_SECRET
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
    version: "1.0.44",
  });

  // Initialize Naver client with config
  const client = NaverSearchClient.getInstance();
  client.initialize({
    clientId: config.NAVER_CLIENT_ID,
    clientSecret: config.NAVER_CLIENT_SECRET,
  });

  server.registerTool(
    "search_webkr",
    {
      description:
        "🌐 Search Korean web documents and general content. Comprehensive search across Korean websites and online content. Find articles, information, and documents from various Korean sources. For recent content or 'today's results', use get_current_korean_time first. (네이버 웹문서 검색 - 한국 웹사이트 종합 검색, 최근 콘텐츠나 오늘 결과를 찾을 때는 먼저 get_current_korean_time으로 현재 시간을 확인하세요)",
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
        "📰 Search latest Korean news articles from major outlets. Perfect for current events, breaking news, and recent developments. Covers politics, economy, society, and international news. For today's news or current events, use get_current_korean_time first to understand what 'today' means. (네이버 뉴스 검색 - 최신 뉴스와 시사 정보, 오늘 뉴스를 찾을 때는 먼저 get_current_korean_time으로 현재 시간을 확인하세요)",
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
        "✍️ Search personal blogs and reviews for authentic user experiences. Great for product reviews, personal stories, detailed tutorials, and real user opinions. Find genuine Korean perspectives. For recent posts or 'today's content', use get_current_korean_time first. (네이버 블로그 검색 - 실제 사용자 후기와 개인적 경험, 최근 글이나 오늘 내용을 찾을 때는 먼저 get_current_korean_time으로 현재 시간을 확인하세요)",
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
    "search_shop",
    {
      description:
        "🛒 Search Naver Shopping for products, prices, and shopping deals. Compare prices across vendors, find product specifications, and discover shopping trends in Korea. For current deals or today's specials, use get_current_korean_time first. (네이버 쇼핑 검색 - 상품 정보와 가격 비교, 현재 할인이나 오늘 특가를 찾을 때는 먼저 get_current_korean_time으로 현재 시간을 확인하세요)",
      inputSchema: SearchArgsSchema.shape,
    },
    async (args) => {
      const result = await searchToolHandlers.search_shop(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "search_image",
    {
      description:
        "🖼️ Search for images with Korean context and relevance. Find visual content, infographics, charts, and photos related to your search terms. Great for visual research and content discovery. For recent images or current visual content, use get_current_korean_time first. (네이버 이미지 검색 - 시각적 컨텐츠 발견, 최근 이미지나 현재 시각 자료를 찾을 때는 먼저 get_current_korean_time으로 현재 시간을 확인하세요)",
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
        "❓ Search Naver KnowledgeiN for Q&A and community-driven answers. Find solutions to problems, get expert advice, and discover community insights on various topics. For recent questions or current discussions, use get_current_korean_time first. (네이버 지식iN 검색 - 질문과 답변, 커뮤니티 지식, 최근 질문이나 현재 토론을 찾을 때는 먼저 get_current_korean_time으로 현재 시간을 확인하세요)",
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
    "search_book",
    {
      description:
        "📚 Search for books, publications, and literary content. Find book reviews, author information, publication details, and reading recommendations in Korean literature and translated works. For new releases or current bestsellers, use get_current_korean_time first. (네이버 책 검색 - 도서 정보와 서평, 신간도서나 현재 베스트셀러를 찾을 때는 먼저 get_current_korean_time으로 현재 시간을 확인하세요)",
      inputSchema: SearchArgsSchema.shape,
    },
    async (args) => {
      const result = await searchToolHandlers.search_book(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "search_encyc",
    {
      description:
        "📖 Search Naver Encyclopedia for authoritative knowledge and definitions. Best for academic research, getting reliable information, and understanding Korean concepts and terminology. For current definitions or recent updates, use get_current_korean_time for context. (네이버 지식백과 검색 - 신뢰할 수 있는 정보와 정의, 현재 정의나 최근 업데이트를 찾을 때는 get_current_korean_time으로 상황을 파악하세요)",
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
    "search_academic",
    {
      description:
        "🎓 Search academic papers, research documents, and scholarly content. Access Korean academic resources, research papers, theses, and professional publications. For recent publications or current research, use get_current_korean_time first. (네이버 전문자료 검색 - 학술 논문과 전문 자료, 최근 발표나 현재 연구를 찾을 때는 먼저 get_current_korean_time으로 현재 시간을 확인하세요)",
      inputSchema: SearchArgsSchema.shape,
    },
    async (args) => {
      const result = await searchToolHandlers.search_academic(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "search_local",
    {
      description:
        "📍 Search for local businesses, restaurants, and places in Korea. Find location information, reviews, contact details, and business hours for Korean establishments. For current business hours or today's availability, use get_current_korean_time first. (네이버 지역 검색 - 지역 업체와 장소 정보, 현재 영업시간이나 오늘 이용 가능 여부를 확인할 때는 먼저 get_current_korean_time으로 현재 시간을 확인하세요)",
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
        "☕ Search Naver Cafe articles for community discussions and specialized content. Find niche communities, hobby groups, and specialized discussions on various topics. For recent discussions or current community topics, use get_current_korean_time first. (네이버 카페글 검색 - 커뮤니티 토론과 전문 정보, 최근 논의나 현재 커뮤니티 주제를 찾을 때는 먼저 get_current_korean_time으로 현재 시간을 확인하세요)",
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
        "📊 Analyze search keyword trends over time using Naver DataLab. Track popularity changes, seasonal patterns, and compare multiple keywords. Perfect for market research and trend analysis. For current trend analysis or 'recent trends', use get_current_korean_time to determine proper date ranges. (네이버 데이터랩 검색어 트렌드 분석, 현재 트렌드나 최근 동향 분석 시 get_current_korean_time으로 적절한 날짜 범위를 설정하세요)",
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
        "🛍️ STEP 2: Analyze shopping category trends over time. Use find_category first to get category codes. BUSINESS CASES: Market size analysis, seasonal trend identification, category performance comparison. EXAMPLE: Compare '패션의류' vs '화장품' trends over 6 months. For current period analysis, use get_current_korean_time to set proper date ranges. (네이버 쇼핑 카테고리별 트렌드 분석 - 먼저 find_category 도구로 카테고리 코드를 찾고, 현재 기간 분석시 get_current_korean_time으로 적절한 날짜 범위 설정)",
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
        "📱 Analyze shopping trends by device (PC vs Mobile). Use find_category first. BUSINESS CASES: Mobile commerce strategy, responsive design priority, device-specific campaigns. EXAMPLE: 'PC 사용자가 더 많이 구매하는 카테고리는?' For current device trends, use get_current_korean_time to set proper analysis period. (기기별 쇼핑 트렌드 분석 - 먼저 find_category 도구로 카테고리 코드를 찾고, 현재 기기 트렌드 분석시 get_current_korean_time으로 적절한 분석 기간 설정)",
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
        "👥 Analyze shopping trends by gender (Male vs Female). Use find_category first. BUSINESS CASES: Gender-targeted marketing, product positioning, demographic analysis. EXAMPLE: '화장품 쇼핑에서 남녀 비율은?' For current gender trends, use get_current_korean_time to set proper analysis period. (성별 쇼핑 트렌드 분석 - 먼저 find_category 도구로 카테고리 코드를 찾고, 현재 성별 트렌드 분석시 get_current_korean_time으로 적절한 분석 기간 설정)",
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
        "👶👦👨👴 Analyze shopping trends by age groups (10s, 20s, 30s, 40s, 50s, 60s+). Use find_category first. BUSINESS CASES: Age-targeted products, generational preferences, lifecycle marketing. EXAMPLE: '개발 도구는 어느 연령대가 많이 구매하나?' For current age trends, use get_current_korean_time to set proper analysis period. (연령별 쇼핑 트렌드 - 먼저 find_category 도구로 카테고리 코드를 찾고, 현재 연령 트렌드 분석시 get_current_korean_time으로 적절한 분석 기간 설정)",
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
        "🔍 Compare specific keywords within a shopping category. Use find_category first. BUSINESS CASES: Product keyword optimization, competitor analysis, search trend identification. EXAMPLE: Within '패션' category, compare '원피스' vs '자켓' vs '드레스' trends. For current keyword trends, use get_current_korean_time to set proper analysis period. (카테고리 내 키워드 비교 - 먼저 find_category 도구로 카테고리 코드를 찾고, 현재 키워드 트렌드 분석시 get_current_korean_time으로 적절한 분석 기간 설정)",
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

    // Get config from environment variables - check for empty strings too
    const clientId = process.env.NAVER_CLIENT_ID?.trim();
    const clientSecret = process.env.NAVER_CLIENT_SECRET?.trim();

    console.error("Environment variables:", {
      NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID
        ? `[${process.env.NAVER_CLIENT_ID.length} chars]`
        : "undefined",
      NAVER_CLIENT_SECRET: process.env.NAVER_CLIENT_SECRET
        ? `[${process.env.NAVER_CLIENT_SECRET.length} chars]`
        : "undefined",
    });

    if (!clientId || !clientSecret) {
      throw new Error(`Missing required environment variables:
        NAVER_CLIENT_ID: ${clientId ? "provided" : "missing"}
        NAVER_CLIENT_SECRET: ${clientSecret ? "provided" : "missing"}
        
        Please set these environment variables before running the server.`);
    }

    const config = {
      NAVER_CLIENT_ID: clientId,
      NAVER_CLIENT_SECRET: clientSecret,
    };

    console.error("Config loaded successfully");

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
