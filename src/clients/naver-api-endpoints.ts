/** 네이버 API 제공 플랫폼 */
export type NaverApiProvider = "legacy" | "hub";

export interface NaverApiEndpoints {
  /** 검색 API base. `${search}/${type}` 형태로 사용한다. */
  search: string;
  /** 검색어 트렌드 전체 URL. suffix를 붙이지 않는다. */
  trend: string;
  /** 쇼핑인사이트 base. `${shopping}/categories` 형태로 사용한다. */
  shopping: string;
}

export interface NaverAuthHeaderNames {
  id: string;
  secret: string;
}

const ENDPOINTS: Record<NaverApiProvider, NaverApiEndpoints> = {
  legacy: {
    search: "https://openapi.naver.com/v1/search",
    trend: "https://openapi.naver.com/v1/datalab/search",
    shopping: "https://openapi.naver.com/v1/datalab/shopping",
  },
  hub: {
    search: "https://naverapihub.apigw.ntruss.com/search/v1",
    trend: "https://naverapihub.apigw.ntruss.com/search-trend/v1/search",
    shopping: "https://naverapihub.apigw.ntruss.com/shopping/v1",
  },
};

const AUTH_HEADER_NAMES: Record<NaverApiProvider, NaverAuthHeaderNames> = {
  legacy: { id: "X-Naver-Client-Id", secret: "X-Naver-Client-Secret" },
  hub: { id: "X-NCP-APIGW-API-KEY-ID", secret: "X-NCP-APIGW-API-KEY" },
};

export function getEndpoints(provider: NaverApiProvider): NaverApiEndpoints {
  return ENDPOINTS[provider];
}

export function getAuthHeaderNames(
  provider: NaverApiProvider
): NaverAuthHeaderNames {
  return AUTH_HEADER_NAMES[provider];
}
