// 네이버 검색 공통 파라미터
export interface SearchArgs {
  query: string; // 검색어
  display?: number; // 한 번에 가져올 결과 수 (기본 10)
  start?: number; // 검색 시작 위치 (기본 1)
  sort?: "sim" | "date"; // 정렬 방식 ("sim": 유사도, "date": 날짜순)
}

// 네이버 검색 타입(카테고리)
export type NaverSearchType =
  | "news"
  | "encyc"
  | "blog"
  | "shop"
  | "webkr"
  | "image"
  | "doc"
  | "kin"
  | "book"
  | "cafearticle"
  | "local";

// 네이버 API 인증 정보
export interface NaverSearchConfig {
  clientId: string; // 네이버 개발자센터에서 발급받은 Client ID
  clientSecret: string; // 네이버 개발자센터에서 발급받은 Client Secret
}

// 전문자료(논문 등) 검색 파라미터
export interface NaverDocumentSearchParams {
  query: string;
  display?: number; // (최대 100)
  start?: number; // (최대 1000)
}

// 지역 검색 파라미터
export interface NaverLocalSearchParams {
  query: string;
  display?: number; // (최대 5)
  start?: number; // (최대 1)
  sort?: "random" | "comment"; // "random": 정확도순, "comment": 리뷰 많은순
}
