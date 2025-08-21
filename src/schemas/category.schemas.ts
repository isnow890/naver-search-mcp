import { z } from "zod";

// Find category schema - Simple and powerful!
export const FindCategorySchema = z.object({
  query: z.string().describe("Korean category search query (한국어 카테고리 검색어, 예: '패션', '화장품', '가구', '스마트폰'). Supports exact match and fuzzy search with level-based priority"),
  max_results: z.number().optional().default(10).describe("Maximum number of results to return (반환할 최대 결과 수, 기본값: 10)")
});