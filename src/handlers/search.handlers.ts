import { NaverSearchClient } from "../clients/naver-search.client.js";
import { 
    NaverLocalSearchParams, 
    SearchArgs, 
    SearchArgsSchema 
} from "../schemas/search.schemas.js";

// 클라이언트 인스턴스
const client = NaverSearchClient.getInstance();

export const searchToolHandlers: Record<string, (args: any) => Promise<any>> = {
  search_webkr: (args) => {
    console.error("search_webkr called with args:", JSON.stringify(args, null, 2));
    return handleWebKrSearch(SearchArgsSchema.parse(args));
  },
  search_news: (args) => {
    console.error("search_news called with args:", JSON.stringify(args, null, 2));
    return handleNewsSearch(SearchArgsSchema.parse(args));
  },
  search_blog: (args) => {
    console.error("search_blog called with args:", JSON.stringify(args, null, 2));
    return handleBlogSearch(SearchArgsSchema.parse(args));
  },
  search_shop: (args) => {
    console.error("search_shop called with args:", JSON.stringify(args, null, 2));
    return handleShopSearch(SearchArgsSchema.parse(args));
  },
  search_image: (args) => {
    console.error("search_image called with args:", JSON.stringify(args, null, 2));
    return handleImageSearch(SearchArgsSchema.parse(args));
  },
  search_kin: (args) => {
    console.error("search_kin called with args:", JSON.stringify(args, null, 2));
    return handleKinSearch(SearchArgsSchema.parse(args));
  },
  search_book: (args) => {
    console.error("search_book called with args:", JSON.stringify(args, null, 2));
    return handleBookSearch(SearchArgsSchema.parse(args));
  },
  search_encyc: (args) => {
    console.error("search_encyc called with args:", JSON.stringify(args, null, 2));
    return handleEncycSearch(SearchArgsSchema.parse(args));
  },
  search_academic: (args) => {
    console.error("search_academic called with args:", JSON.stringify(args, null, 2));
    return handleAcademicSearch(SearchArgsSchema.parse(args));
  },
  search_local: (args) => {
    console.error("search_local called with args:", JSON.stringify(args, null, 2));
    return handleLocalSearch(args);
  },
  search_cafearticle: (args) => {
    console.error("search_cafearticle called with args:", JSON.stringify(args, null, 2));
    return handleCafeArticleSearch(SearchArgsSchema.parse(args));
  },
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
