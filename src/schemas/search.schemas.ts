import { z } from "zod";
// 네이버 검색 타입(카테고리)
export const NaverSearchTypeSchema = z.enum([
  "news",
  "encyc",
  "blog",
  "webkr",
  "image",
  "kin",
  "cafearticle",
  "local",
]);

export const NaverSearchParamsSchema = z.object({
  query: z.string().describe("Search query"),
  display: z
    .number()
    .optional()
    .describe("Number of results to display (default: 10)"),
  start: z
    .number()
    .optional()
    .describe("Start position of search results (default: 1)"),
  sort: z
    .enum(["sim", "date"])
    .optional()
    .describe("Sort method (sim: similarity, date: chronological)"),
});
// 네이버 검색 공통 파라미터
// 범위는 네이버 검색 API 문서 기준이다. 벗어나면 API가 SE02/SE03으로 거절한다.
export const SearchArgsSchema = z.object({
  query: z.string().describe("검색어"),
  display: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .describe("한 번에 가져올 결과 수 (기본 10, 최대 100)"),
  start: z
    .number()
    .int()
    .min(1)
    .max(1000)
    .optional()
    .describe("검색 시작 위치 (기본 1, 최대 1000)"),
  sort: z
    .enum(["sim", "date"])
    .optional()
    .describe("정렬 방식 (sim: 유사도, date: 날짜순)"),
});

// 웹문서·지식백과 검색 파라미터
// 두 API는 sort를 정의하지 않고, 보내도 무시한다 (date를 줘도 sim과 같은 결과).
// 노출하면 모델이 날짜순을 요청해도 조용히 유사도순 결과를 받으므로 뺀다.
export const SearchWithoutSortArgsSchema = SearchArgsSchema.omit({
  sort: true,
});

// 지식iN 검색 파라미터 (평점순 정렬을 추가로 지원)
export const KinSearchArgsSchema = SearchArgsSchema.extend({
  sort: z
    .enum(["sim", "date", "point"])
    .optional()
    .describe("정렬 방식 (sim: 유사도, date: 날짜순, point: 평점순)"),
});

// 이미지 검색 파라미터 (크기 필터를 추가로 지원)
export const ImageSearchArgsSchema = SearchArgsSchema.extend({
  filter: z
    .enum(["all", "large", "medium", "small"])
    .optional()
    .describe(
      "이미지 크기 필터 (all: 전체(기본), large: 큰 이미지, medium: 중간 크기, small: 작은 크기)"
    ),
});

// 네이버 API 인증 정보
export const NaverSearchConfigSchema = z.object({
  provider: z
    .enum(["legacy", "hub"])
    .describe("자격증명 발급 플랫폼 (legacy: 개발자센터, hub: NAVER API HUB)"),
  clientId: z.string().describe("발급받은 Client ID"),
  clientSecret: z.string().describe("발급받은 Client Secret"),
});

// 지역 검색 파라미터
export const NaverLocalSearchParamsSchema = SearchArgsSchema.extend({
  sort: z
    .enum(["random", "comment"])
    .optional()
    .describe("정렬 방식 (random: 정확도순, comment: 리뷰 많은순)"),
  // 지역 검색은 display가 5를 넘으면 5로 줄이고, start가 2 이상이어도 첫 결과를 그대로 준다.
  // 페이지를 넘긴 것처럼 보이지만 같은 결과가 오므로 범위를 넘으면 거절한다.
  display: z
    .number()
    .int()
    .min(1)
    .max(5)
    .optional()
    .describe("한 번에 가져올 결과 수 (기본 1, 최대 5)"),
  start: z
    .number()
    .int()
    .min(1)
    .max(1)
    .optional()
    .describe("검색 시작 위치 (1만 지원, 다음 페이지 없음)"),
});
export type NaverLocalSearchParams = z.infer<
  typeof NaverLocalSearchParamsSchema
>;
export type NaverSearchParams = z.infer<typeof NaverSearchParamsSchema>;

export type SearchArgs = z.infer<typeof SearchArgsSchema>;
export type SearchWithoutSortArgs = z.infer<typeof SearchWithoutSortArgsSchema>;
export type KinSearchArgs = z.infer<typeof KinSearchArgsSchema>;
export type ImageSearchArgs = z.infer<typeof ImageSearchArgsSchema>;
export type NaverSearchType = z.infer<typeof NaverSearchTypeSchema>;
export type NaverSearchConfig = z.infer<typeof NaverSearchConfigSchema>;
