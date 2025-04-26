import { zodToJsonSchema } from "zod-to-json-schema";
import {
  SearchArgsSchema,
  NaverLocalSearchParamsSchema,
} from "../schemas/search.schemas.js";

/**
 * 검색 관련 도구 정의
 */
export const searchTools = [
  {
    name: "search_webkr",
    description:
      "Perform a search on Naver Web Documents. (네이버 웹문서 검색)",
    inputSchema: zodToJsonSchema(SearchArgsSchema),
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
  {
    name: "search_cafearticle",
    description:
      "Perform a search on Naver Cafe Articles. (네이버 카페글 검색)",
    inputSchema: zodToJsonSchema(SearchArgsSchema),
  },
];
