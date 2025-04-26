import { NaverSearchClient } from "../clients/naver-search.client.js";
import { NaverLocalSearchParams } from "../schemas/search.schemas.js";

import { SearchArgs } from "../schemas/search.schemas.js";
import { SearchArgsSchema } from "../schemas/search.schemas.js";

// 클라이언트 인스턴스
const client = NaverSearchClient.getInstance();

export const searchToolHandlers: Record<string, (args: any) => Promise<any>> = {
  search_webkr: (args) => handleWebKrSearch(SearchArgsSchema.parse(args)),
  search_news: (args) => handleNewsSearch(SearchArgsSchema.parse(args)),
  search_blog: (args) => handleBlogSearch(SearchArgsSchema.parse(args)),
  search_shop: (args) => handleShopSearch(SearchArgsSchema.parse(args)),
  search_image: (args) => handleImageSearch(SearchArgsSchema.parse(args)),
  search_kin: (args) => handleKinSearch(SearchArgsSchema.parse(args)),
  search_book: (args) => handleBookSearch(SearchArgsSchema.parse(args)),
  search_encyc: (args) => handleEncycSearch(SearchArgsSchema.parse(args)),
  search_academic: (args) => handleAcademicSearch(SearchArgsSchema.parse(args)),
  search_local: (args) => handleLocalSearch(args),
  search_cafearticle: (args) => handleCafeArticleSearch(args),
};

/**
 * 전문자료 검색 핸들러
 */
export async function handleAcademicSearch(params: SearchArgs) {
  return client.searchAcademic(params);
}

/**
 * 도서 검색 핸들러
 */
export async function handleBookSearch(params: SearchArgs) {
  return client.search("book", params);
}

/**
 * 지식백과 검색 핸들러
 */
export async function handleEncycSearch(params: SearchArgs) {
  return client.search("encyc", params);
}

/**
 * 이미지 검색 핸들러
 */
export async function handleImageSearch(params: SearchArgs) {
  return client.search("image", params);
}

/**
 * 지식iN 검색 핸들러
 */
export async function handleKinSearch(params: SearchArgs) {
  return client.search("kin", params);
}

/**
 * 지역 검색 핸들러
 */
export async function handleLocalSearch(params: NaverLocalSearchParams) {
  return client.searchLocal(params);
}

/**
 * 뉴스 검색 핸들러
 */
export async function handleNewsSearch(params: SearchArgs) {
  return client.search("news", params);
}

/**
 * 블로그 검색 핸들러
 */
export async function handleBlogSearch(params: SearchArgs) {
  return client.search("blog", params);
}

/**
 * 쇼핑 검색 핸들러
 */
export async function handleShopSearch(params: SearchArgs) {
  return client.search("shop", params);
}

/**
 * 카페글 검색 핸들러
 */
export async function handleCafeArticleSearch(params: SearchArgs) {
  return client.search("cafearticle", params);
}

export async function handleWebKrSearch(args: SearchArgs) {
  const client = NaverSearchClient.getInstance();
  return await client.search("webkr", args);
}
