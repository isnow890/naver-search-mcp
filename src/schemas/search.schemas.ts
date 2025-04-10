import { z } from "zod";

const sortEnum = z.enum(["sim", "date"]);

// 기본 검색 파라미터 스키마
export const SearchArgsSchema = z.object({
  query: z.string(),
  display: z.number().optional(),
  start: z.number().optional(),
  sort: sortEnum.optional(),
});

export const UnifiedSearchArgsSchema = z.object({
  query: z.string(),
  display: z.number().optional(),
  start: z.number().optional(),
  sort: sortEnum.optional(),
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
    .default(["webkr", "blog", "news"]), // 기본값으로 웹문서, 블로그, 뉴스 검색
});

export type SearchArgs = z.infer<typeof SearchArgsSchema>;
export type UnifiedSearchArgs = z.infer<typeof UnifiedSearchArgsSchema>;
