import { NaverSearchClient } from "../clients/naver-search.client.js";
import { NaverLocalSearchParams } from "../schemas/search.schemas.js";

import {
  SearchArgs,
  SearchWithoutSortArgs,
  KinSearchArgs,
  ImageSearchArgs,
} from "../schemas/search.schemas.js";
import {
  SearchArgsSchema,
  SearchWithoutSortArgsSchema,
  KinSearchArgsSchema,
  ImageSearchArgsSchema,
} from "../schemas/search.schemas.js";

// 클라이언트는 호출 시점에 꺼낸다. 모듈 로드 시점에 잡아두면 설정 변경으로
// resetServerInstance()가 싱글톤을 교체한 뒤에도 비워진 옛 인스턴스를 계속 쓴다.
const client = () => NaverSearchClient.getInstance();

export const searchToolHandlers: Record<string, (args: any) => Promise<any>> = {
  search_webkr: (args) => {
    console.error("search_webkr called with args:", JSON.stringify(args, null, 2));
    return handleWebKrSearch(SearchWithoutSortArgsSchema.parse(args));
  },
  search_news: (args) => {
    console.error("search_news called with args:", JSON.stringify(args, null, 2));
    return handleNewsSearch(SearchArgsSchema.parse(args));
  },
  search_blog: (args) => {
    console.error("search_blog called with args:", JSON.stringify(args, null, 2));
    return handleBlogSearch(SearchArgsSchema.parse(args));
  },
  search_image: (args) => {
    console.error("search_image called with args:", JSON.stringify(args, null, 2));
    return handleImageSearch(ImageSearchArgsSchema.parse(args));
  },
  search_kin: (args) => {
    console.error("search_kin called with args:", JSON.stringify(args, null, 2));
    return handleKinSearch(KinSearchArgsSchema.parse(args));
  },
  search_encyc: (args) => {
    console.error("search_encyc called with args:", JSON.stringify(args, null, 2));
    return handleEncycSearch(SearchWithoutSortArgsSchema.parse(args));
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
 * 지식백과 검색 핸들러
 */
export async function handleEncycSearch(params: SearchWithoutSortArgs) {
  return client().search("encyc", params);
}

/**
 * 이미지 검색 핸들러
 */
export async function handleImageSearch(params: ImageSearchArgs) {
  return client().search("image", params);
}

/**
 * 지식iN 검색 핸들러
 */
export async function handleKinSearch(params: KinSearchArgs) {
  return client().search("kin", params);
}

/**
 * 지역 검색 핸들러
 */
export async function handleLocalSearch(params: NaverLocalSearchParams) {
  return client().searchLocal(params);
}

/**
 * 뉴스 검색 핸들러
 */
export async function handleNewsSearch(params: SearchArgs) {
  return client().search("news", params);
}

/**
 * 블로그 검색 핸들러
 */
export async function handleBlogSearch(params: SearchArgs) {
  return client().search("blog", params);
}

/**
 * 카페글 검색 핸들러
 */
export async function handleCafeArticleSearch(params: SearchArgs) {
  return client().search("cafearticle", params);
}

export async function handleWebKrSearch(args: SearchWithoutSortArgs) {
  return client().search("webkr", args);
}
