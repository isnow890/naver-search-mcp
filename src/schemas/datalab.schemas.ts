import { z } from "zod";

// 기본 DataLab 스키마
export const DatalabBaseSchema = z.object({
  startDate: z.string().describe("Start date (yyyy-mm-dd or 'today' for KST today)"),
  endDate: z.string().describe("End date (yyyy-mm-dd or 'today' for KST today)"),
  timeUnit: z.enum(["date", "week", "month"]).describe("Time unit"),
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

// 쇼핑인사이트 공통 선택 필터
// 네이버 문서상 쇼핑인사이트 8개 엔드포인트 모두에서 device/gender/ages는 선택(N)이다.
// 생략하면 전체 사용자 기준이고, 기기별/성별/연령별 엔드포인트는 해당 축을 생략해야
// results[].data[].group 으로 나뉜 결과가 온다. 지정하면 그 값 하나로 걸러진다.
export const ShoppingFilterSchema = z.object({
  device: z
    .enum(["pc", "mo"])
    .optional()
    .describe("Device filter (pc: PC, mo: mobile). Omit for all devices"),
  gender: z
    .enum(["f", "m"])
    .optional()
    .describe("Gender filter (f: female, m: male). Omit for all genders"),
  ages: z
    .array(z.enum(["10", "20", "30", "40", "50", "60"]))
    .optional()
    .describe(
      "Age filter (10: 10-19, 20: 20-29, ..., 60: 60+). Omit for all ages"
    ),
});

// 기기별/성별/연령별 엔드포인트에서 분석 축이 되는 필드의 설명
const DeviceBreakdown = ShoppingFilterSchema.shape.device.describe(
  "Omit to get PC and mobile side by side (data[].group: 'pc' | 'mo'). Set only to restrict to one device"
);
const GenderBreakdown = ShoppingFilterSchema.shape.gender.describe(
  "Omit to get female and male side by side (data[].group: 'f' | 'm'). Set only to restrict to one gender"
);
const AgesBreakdown = ShoppingFilterSchema.shape.ages.describe(
  "Omit to get every age group side by side (data[].group: '10' ... '60'). Set only to restrict to specific age groups"
);

// 쇼핑 카테고리 스키마
export const DatalabShoppingSchema = DatalabBaseSchema.merge(
  ShoppingFilterSchema
).extend({
  category: z
    .array(
      z.object({
        name: z.string().describe("Category name"),
        param: z.array(z.string()).describe("Category codes"),
      })
    )
    .describe("Array of category name and code pairs"),
});

// 기기별 트렌드 스키마
export const DatalabShoppingDeviceSchema = DatalabBaseSchema.merge(
  ShoppingFilterSchema
).extend({
  category: z.string().describe("Category code"),
  device: DeviceBreakdown,
});

// 성별 트렌드 스키마
export const DatalabShoppingGenderSchema = DatalabBaseSchema.merge(
  ShoppingFilterSchema
).extend({
  category: z.string().describe("Category code"),
  gender: GenderBreakdown,
});

// 연령별 트렌드 스키마
export const DatalabShoppingAgeSchema = DatalabBaseSchema.merge(
  ShoppingFilterSchema
).extend({
  category: z.string().describe("Category code"),
  ages: AgesBreakdown,
});

// 키워드 트렌드 스키마
export const DatalabShoppingKeywordsSchema = DatalabBaseSchema.merge(
  ShoppingFilterSchema
).extend({
  category: z.string().describe("Category code"),
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
export const DatalabShoppingKeywordDeviceSchema = DatalabBaseSchema.merge(
  ShoppingFilterSchema
).extend({
  category: z.string().describe("Category code"),
  keyword: z.string().describe("Search keyword"),
  device: DeviceBreakdown,
});

// 키워드 성별 트렌드 스키마
export const DatalabShoppingKeywordGenderSchema = DatalabBaseSchema.merge(
  ShoppingFilterSchema
).extend({
  category: z.string().describe("Category code"),
  keyword: z.string().describe("Search keyword"),
  gender: GenderBreakdown,
});

// 키워드 연령별 트렌드 스키마
export const DatalabShoppingKeywordAgeSchema = DatalabBaseSchema.merge(
  ShoppingFilterSchema
).extend({
  category: z.string().describe("Category code"),
  keyword: z.string().describe("Search keyword"),
  ages: AgesBreakdown,
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