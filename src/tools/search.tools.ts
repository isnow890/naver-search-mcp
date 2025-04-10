import { zodToJsonSchema } from "zod-to-json-schema";
import { SearchArgsSchema } from "../schemas/search.schemas.js";
import { NaverLocalSearchParamsSchema } from "../types/naver-search.types.js";

/**
 * 검색 관련 도구 정의
 */
export const searchTools = [
  {
    name: "search_unified",
    description: `Naver Unified Search - Search multiple types at once.
Response format:
{
  "webkr": {
    "lastBuildDate": "Result generation timestamp",
    "total": "Total number of search results",
    "start": "Search result start position",
    "display": "Number of results per page",
    "items": [
      {
        "title": "Title of the content",
        "link": "URL of the content",
        "description": "Content summary",
        "bloggername": "Name of blogger (for blog results)",
        "postdate": "Publication date (for blog/news)",
        "thumbnail": "Thumbnail URL (for image/shopping)",
        "price": "Price information (for shopping)",
        "category": "Category (for shopping/knowledge)",
        "author": "Author (for books)"
      }
    ]
  },
  "blog": { /* Blog search results - same structure as above */ },
  "news": { /* News search results - same structure as above */ },
  /* Other selected search types will follow the same structure */
}`,
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query",
        },
        display: {
          type: "number",
          description: "Number of results to display (default: 10)",
        },
        start: {
          type: "number",
          description: "Start position of search results (default: 1)",
        },
        sort: {
          type: "string",
          enum: ["sim", "date"],
          description: "Sort method (sim: similarity, date: date)",
        },
        types: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "webkr",
              "blog",
              "news",
              "encyc",
              "book",
              "cafearticle",
              "kin",
              "shop",
              "image",
            ],
          },
          description:
            'Search types to include (default: ["webkr", "blog", "news"])',
        },
      },
      required: ["query"],
    },
  },
  {
    name: "search_news",
    description: "Perform a search on Naver News. (네이버 뉴스 검색)",
    inputSchema: zodToJsonSchema(SearchArgsSchema),
  },
  {
    name: "search_blog",
    description: "Perform a search on Naver Blog. (네이버 블로그 검색)",
    inputSchema: zodToJsonSchema(SearchArgsSchema),
  },
  {
    name: "search_shop",
    description: "Perform a search on Naver Shopping. (네이버 쇼핑 검색)",
    inputSchema: zodToJsonSchema(SearchArgsSchema),
  },
  {
    name: "search_image",
    description: "Perform a search on Naver Image. (네이버 이미지 검색)",
    inputSchema: zodToJsonSchema(SearchArgsSchema),
  },
  {
    name: "search_kin",
    description: "Perform a search on Naver KnowledgeiN. (네이버 지식iN 검색)",
    inputSchema: zodToJsonSchema(SearchArgsSchema),
  },
  {
    name: "search_book",
    description: "Perform a search on Naver Book. (네이버 책 검색)",
    inputSchema: zodToJsonSchema(SearchArgsSchema),
  },
  {
    name: "search_encyc",
    description:
      "Perform a search on Naver Encyclopedia. (네이버 지식백과 검색)",
    inputSchema: zodToJsonSchema(SearchArgsSchema),
  },
  {
    name: "search_academic",
    description: "Perform a search on Naver Academic. (네이버 전문자료 검색)",
    inputSchema: zodToJsonSchema(SearchArgsSchema),
  },
  {
    name: "search_local",
    description: "Perform a search on Naver Local. (네이버 지역 검색)",
    inputSchema: zodToJsonSchema(NaverLocalSearchParamsSchema),
  },
];
