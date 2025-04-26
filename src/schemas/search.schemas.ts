import { z } from "zod";
// 네이버 검색 타입(카테고리)
export const NaverSearchTypeSchema = z.enum([
  "news",
  "encyc",
  "blog",
  "shop",
  "webkr",
  "image",
  "doc",
  "kin",
  "book",
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
export const SearchArgsSchema = z.object({
  query: z.string().describe("검색어"),
  display: z.number().optional().describe("한 번에 가져올 결과 수 (기본 10)"),
  start: z.number().optional().describe("검색 시작 위치 (기본 1)"),
  sort: z
    .enum(["sim", "date"])
    .optional()
    .describe("정렬 방식 (sim: 유사도, date: 날짜순)"),
});

// 네이버 API 인증 정보
export const NaverSearchConfigSchema = z.object({
  clientId: z.string().describe("네이버 개발자센터에서 발급받은 Client ID"),
  clientSecret: z
    .string()
    .describe("네이버 개발자센터에서 발급받은 Client Secret"),
});

// 전문자료(논문 등) 검색 파라미터
export const NaverDocumentSearchParamsSchema = z.object({
  query: z.string().describe("검색어"),
  display: z.number().optional().describe("한 번에 가져올 결과 수 (최대 100)"),
  start: z.number().optional().describe("검색 시작 위치 (최대 1000)"),
});

// 지역 검색 파라미터
export const NaverLocalSearchParamsSchema = SearchArgsSchema.extend({
  sort: z
    .enum(["random", "comment"])
    .optional()
    .describe("정렬 방식 (random: 정확도순, comment: 리뷰 많은순)"),
  display: z.number().optional().describe("한 번에 가져올 결과 수 (최대 5)"),
  start: z.number().optional().describe("검색 시작 위치 (최대 1)"),
});
export type NaverLocalSearchParams = z.infer<
  typeof NaverLocalSearchParamsSchema
>;
export type NaverSearchParams = z.infer<typeof NaverSearchParamsSchema>;

export type SearchArgs = z.infer<typeof SearchArgsSchema>;
export type NaverSearchType = z.infer<typeof NaverSearchTypeSchema>;
export type NaverSearchConfig = z.infer<typeof NaverSearchConfigSchema>;
export type NaverDocumentSearchParams = z.infer<
  typeof NaverDocumentSearchParamsSchema
>;
