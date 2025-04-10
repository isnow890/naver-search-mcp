import { z } from "zod";

const sortEnum = z.enum(["sim", "date"]);

// 기본 검색 파라미터 스키마
export const SearchArgsSchema = z.object({
  query: z.string().describe("Search query"),
  display: z
    .number()
    .default(10)
    .describe("Number of results to display (default: 10)"),
  start: z
    .number()
    .default(1)
    .describe("Start position of search results (default: 1)"),
  sort: sortEnum
    .default("sim")
    .describe("Sort method (sim: similarity, date: date)"),
});

export const UnifiedSearchArgsSchema = z.object({
  query: z.string().describe("Search query"),
  display: z
    .number()
    .default(10)
    .describe("Number of results to display (default: 10)"),
  start: z
    .number()
    .default(1)
    .describe("Start position of search results (default: 1)"),
  sort: sortEnum
    .default("sim")
    .describe("Sort method (sim: similarity, date: date)"),
  types: z
    .array(
      z.enum([
        "webkr",
        "blog",
        "news",
        "encyc",
        "book",
        "cafearticle",
        "kin",
        "shop",
        "image",
      ])
    )
    .default([
      "webkr",
      "blog",
      "news",
      "encyc",
      "book",
      "cafearticle",
      "kin",
      "shop",
      "image",
    ])
    .describe("Search types to include (default: all types)"),
});

export type SearchArgs = z.infer<typeof SearchArgsSchema>;
export type UnifiedSearchArgs = z.infer<typeof UnifiedSearchArgsSchema>;
