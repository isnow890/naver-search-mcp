import { z } from "zod";

// 기본 검색 파라미터 스키마
export const SearchArgsSchema = z.object({
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
    .describe("Sort method (sim: similarity, date: date)"),
});

export type SearchArgs = z.infer<typeof SearchArgsSchema>; 