import { z } from "zod";

// 기본 DataLab 스키마
export const DatalabBaseSchema = z.object({
  startDate: z.string().describe("Start date (yyyy-mm-dd). Minimum: 2017-08-01 for shopping data, 2016-01-01 for search trends (시작 날짜)"),
  endDate: z.string().describe("End date (yyyy-mm-dd). Must be after startDate (종료 날짜)"),
  timeUnit: z.enum(["date", "week", "month"]).describe("Time unit for analysis: 'date'=daily trends, 'week'=weekly trends, 'month'=monthly trends. Monthly recommended for long periods (분석 단위: date=일간, week=주간, month=월간)"),
});

// 검색어 트렌드 스키마
export const DatalabSearchSchema = DatalabBaseSchema.extend({
  keywordGroups: z
    .array(
      z.object({
        groupName: z.string().describe("Group name"),
        keywords: z.array(z.string()).describe("List of keywords"),
      })
    )
    .describe("Keyword groups"),
});

// 쇼핑 카테고리 스키마
export const DatalabShoppingSchema = DatalabBaseSchema.extend({
  category: z
    .array(
      z.object({
        name: z.string().describe("Category name"),
        param: z.array(z.string()).describe("Category codes (use find_category tool to find category codes)"),
      })
    )
    .describe("Array of category name and code pairs. Use find_category tool first to find category codes"),
});

// 기기별 트렌드 스키마
export const DatalabShoppingDeviceSchema = DatalabBaseSchema.extend({
  category: z.string().describe("Category code (use find_category tool to find category codes)"),
  device: z.enum(["pc", "mo"]).describe("Device type"),
});

// 성별 트렌드 스키마
export const DatalabShoppingGenderSchema = DatalabBaseSchema.extend({
  category: z.string().describe("Category code (use find_category tool to find category codes)"),
  gender: z.enum(["f", "m"]).describe("Gender"),
});

// 연령별 트렌드 스키마
export const DatalabShoppingAgeSchema = DatalabBaseSchema.extend({
  category: z.string().describe("Category code (use find_category tool to find category codes)"),
  ages: z
    .array(z.enum(["10", "20", "30", "40", "50", "60"]))
    .describe("Age groups"),
});

// 키워드 트렌드 스키마
export const DatalabShoppingKeywordsSchema = DatalabBaseSchema.extend({
  category: z.string().describe("Category code (use find_category tool to find category codes)"),
  keyword: z
    .array(
      z.object({
        name: z.string().describe("Keyword name"),
        param: z.array(z.string()).describe("Keyword values"),
      })
    )
    .describe("Array of keyword name and value pairs"),
});

// 키워드 기기별 트렌드 스키마
export const DatalabShoppingKeywordDeviceSchema = DatalabBaseSchema.extend({
  category: z.string().describe("Category code (use find_category tool to find category codes)"),
  keyword: z.string().describe("Search keyword"),
  device: z.enum(["pc", "mo"]).describe("Device type"),
});

// 키워드 성별 트렌드 스키마
export const DatalabShoppingKeywordGenderSchema = DatalabBaseSchema.extend({
  category: z.string().describe("Category code (use find_category tool to find category codes)"),
  keyword: z.string().describe("Search keyword"),
  gender: z.enum(["f", "m"]).describe("Gender"),
});

// 키워드 연령별 트렌드 스키마
export const DatalabShoppingKeywordAgeSchema = DatalabBaseSchema.extend({
  category: z.string().describe("Category code (use find_category tool to find category codes)"),
  keyword: z.string().describe("Search keyword"),
  ages: z
    .array(z.enum(["10", "20", "30", "40", "50", "60"]))
    .describe("Age groups"),
});

// 카테고리 디바이스/성별/연령별 트렌드 스키마
export const DatalabShoppingCategoryDeviceSchema = DatalabBaseSchema.extend({
  category: z
    .array(
      z.object({
        name: z.string().describe("Category name"),
        param: z.array(z.string()).describe("Category codes (use find_category tool to find category codes)"),
      })
    )
    .describe("Array of category name and code pairs. Use find_category tool first to find category codes"),
  device: z.enum(["pc", "mo"]).optional().describe("Device type"),
  gender: z.enum(["f", "m"]).optional().describe("Gender"),
  ages: z
    .array(z.enum(["10", "20", "30", "40", "50", "60"]))
    .optional()
    .describe("Age groups"),
});

// 키워드 디바이스/성별/연령별 트렌드 스키마
export const DatalabShoppingKeywordTrendSchema = DatalabBaseSchema.extend({
  category: z.string().describe("Category code (use find_category tool to find category codes)"),
  keyword: z
    .array(
      z.object({
        name: z.string().describe("Keyword name"),
        param: z.array(z.string()).describe("Keyword values"),
      })
    )
    .describe("Array of keyword name and value pairs"),
  device: z.enum(["pc", "mo"]).optional().describe("Device type"),
  gender: z.enum(["f", "m"]).optional().describe("Gender"),
  ages: z
    .array(z.enum(["10", "20", "30", "40", "50", "60"]))
    .optional()
    .describe("Age groups"),
});

export type DatalabSearch = z.infer<typeof DatalabSearchSchema>;
export type DatalabShopping = z.infer<typeof DatalabShoppingSchema>;
export type DatalabShoppingDevice = z.infer<typeof DatalabShoppingDeviceSchema>;
export type DatalabShoppingGender = z.infer<typeof DatalabShoppingGenderSchema>;
export type DatalabShoppingAge = z.infer<typeof DatalabShoppingAgeSchema>;
export type DatalabShoppingKeywords = z.infer<typeof DatalabShoppingKeywordsSchema>;
export type DatalabShoppingKeywordDevice = z.infer<typeof DatalabShoppingKeywordDeviceSchema>;
export type DatalabShoppingKeywordGender = z.infer<typeof DatalabShoppingKeywordGenderSchema>;
export type DatalabShoppingKeywordAge = z.infer<typeof DatalabShoppingKeywordAgeSchema>; 