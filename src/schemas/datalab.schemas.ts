import { z } from "zod";

// 기본 DataLab 스키마
export const DatalabBaseSchema = z.object({
  startDate: z.string().describe("Start date (yyyy-mm-dd)"),
  endDate: z.string().describe("End date (yyyy-mm-dd)"),
  timeUnit: z
    .enum(["date", "week", "month"])
    .default("date")
    .describe("Time unit (default: date)"),
});

// 검색어 트렌드 스키마
export const DatalabSearchSchema = DatalabBaseSchema.extend({
  keywordGroups: z
    .array(
      z.object({
        groupName: z.string().describe("Group name"),
        keywords: z
          .array(z.string())
          .min(1)
          .describe("List of keywords (min: 1)"),
      })
    )
    .min(1)
    .describe("Keyword groups (min: 1 group)"),
});

// 쇼핑 카테고리 스키마
export const DatalabShoppingSchema = DatalabBaseSchema.extend({
  category: z
    .array(
      z.object({
        name: z.string().describe("Category name"),
        param: z.array(z.string()).min(1).describe("Category codes (min: 1)"),
      })
    )
    .min(1)
    .describe("Array of category name and code pairs (min: 1 pair)"),
});

// 기기별 트렌드 스키마
export const DatalabShoppingDeviceSchema = DatalabBaseSchema.extend({
  category: z.string().describe("Category code"),
  device: z
    .enum(["pc", "mo"])
    .default("pc")
    .describe("Device type (pc: PC, mo: Mobile, default: pc)"),
});

// 성별 트렌드 스키마
export const DatalabShoppingGenderSchema = DatalabBaseSchema.extend({
  category: z.string().describe("Category code"),
  gender: z
    .enum(["f", "m"])
    .default("f")
    .describe("Gender (f: Female, m: Male, default: f)"),
});

// 연령별 트렌드 스키마
export const DatalabShoppingAgeSchema = DatalabBaseSchema.extend({
  category: z.string().describe("Category code"),
  ages: z
    .array(z.enum(["10", "20", "30", "40", "50", "60"]))
    .default(["20", "30", "40"])
    .describe("Age groups (default: 20, 30, 40)"),
});

// 키워드 트렌드 스키마
export const DatalabShoppingKeywordsSchema = DatalabBaseSchema.extend({
  category: z.string().describe("Category code"),
  keyword: z
    .array(
      z.object({
        name: z.string().describe("Keyword name"),
        param: z.array(z.string()).min(1).describe("Keyword values (min: 1)"),
      })
    )
    .min(1)
    .describe("Array of keyword name and value pairs (min: 1 pair)"),
});

// 키워드 기기별 트렌드 스키마
export const DatalabShoppingKeywordDeviceSchema = DatalabBaseSchema.extend({
  category: z.string().describe("Category code"),
  keyword: z.string().describe("Search keyword"),
  device: z
    .enum(["pc", "mo"])
    .default("pc")
    .describe("Device type (pc: PC, mo: Mobile, default: pc)"),
});

// 키워드 성별 트렌드 스키마
export const DatalabShoppingKeywordGenderSchema = DatalabBaseSchema.extend({
  category: z.string().describe("Category code"),
  keyword: z.string().describe("Search keyword"),
  gender: z
    .enum(["f", "m"])
    .default("f")
    .describe("Gender (f: Female, m: Male, default: f)"),
});

// 키워드 연령별 트렌드 스키마
export const DatalabShoppingKeywordAgeSchema = DatalabBaseSchema.extend({
  category: z.string().describe("Category code"),
  keyword: z.string().describe("Search keyword"),
  ages: z
    .array(z.enum(["10", "20", "30", "40", "50", "60"]))
    .default(["20", "30", "40"])
    .describe("Age groups (default: 20, 30, 40)"),
});

// 카테고리 디바이스/성별/연령별 트렌드 스키마
export const DatalabShoppingCategoryDeviceSchema = DatalabBaseSchema.extend({
  category: z
    .array(
      z.object({
        name: z.string().describe("Category name"),
        param: z.array(z.string()).describe("Category codes"),
      })
    )
    .describe("Array of category name and code pairs"),
  device: z.enum(["pc", "mo"]).optional().describe("Device type"),
  gender: z.enum(["f", "m"]).optional().describe("Gender"),
  ages: z
    .array(z.enum(["10", "20", "30", "40", "50", "60"]))
    .optional()
    .describe("Age groups"),
});

// 키워드 디바이스/성별/연령별 트렌드 스키마
export const DatalabShoppingKeywordTrendSchema = DatalabBaseSchema.extend({
  category: z.string().describe("Category code"),
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

// 통합 데이터랩 스키마
export const DatalabUnifiedSchema = DatalabBaseSchema.extend({
  types: z
    .array(
      z.enum([
        "search",
        "shopping_category",
        "shopping_by_device",
        "shopping_by_gender",
        "shopping_by_age",
        "shopping_keywords",
        "shopping_keyword_by_device",
        "shopping_keyword_by_gender",
        "shopping_keyword_by_age",
      ])
    )
    .default([
      "search",
      "shopping_category",
      "shopping_by_device",
      "shopping_by_gender",
      "shopping_by_age",
      "shopping_keywords",
      "shopping_keyword_by_device",
      "shopping_keyword_by_gender",
      "shopping_keyword_by_age",
    ])
    .describe("Types of analysis to perform (default: all types)"),
  keywordGroups: z
    .array(
      z.object({
        groupName: z.string().describe("Name for the keyword group"),
        keywords: z
          .array(z.string())
          .min(1)
          .describe("List of keywords to analyze (min: 1)"),
      })
    )
    .optional()
    .describe(
      "Groups of keywords to analyze trends for (required for search type)"
    ),
  category: z
    .string()
    .optional()
    .describe("Category code (required for shopping_* types)"),
  device: z
    .enum(["pc", "mo"])
    .default("pc")
    .describe(
      "Device type for shopping_by_device and shopping_keyword_by_device analysis (default: pc)"
    ),
  gender: z
    .enum(["f", "m"])
    .default("f")
    .describe(
      "Gender for shopping_by_gender and shopping_keyword_by_gender analysis (default: f)"
    ),
  ages: z
    .array(z.enum(["10", "20", "30", "40", "50", "60"]))
    .default(["20", "30", "40"])
    .describe(
      "Age groups for shopping_by_age and shopping_keyword_by_age analysis (default: 20, 30, 40)"
    ),
  keyword: z
    .string()
    .optional()
    .describe("Single keyword for shopping_keyword_by_* analysis"),
});

export type DatalabSearch = z.infer<typeof DatalabSearchSchema>;
export type DatalabShopping = z.infer<typeof DatalabShoppingSchema>;
export type DatalabShoppingDevice = z.infer<typeof DatalabShoppingDeviceSchema>;
export type DatalabShoppingGender = z.infer<typeof DatalabShoppingGenderSchema>;
export type DatalabShoppingAge = z.infer<typeof DatalabShoppingAgeSchema>;
export type DatalabShoppingKeywords = z.infer<
  typeof DatalabShoppingKeywordsSchema
>;
export type DatalabShoppingKeywordDevice = z.infer<
  typeof DatalabShoppingKeywordDeviceSchema
>;
export type DatalabShoppingKeywordGender = z.infer<
  typeof DatalabShoppingKeywordGenderSchema
>;
export type DatalabShoppingKeywordAge = z.infer<
  typeof DatalabShoppingKeywordAgeSchema
>;
export type DatalabUnified = z.infer<typeof DatalabUnifiedSchema>;
