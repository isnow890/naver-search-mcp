import { zodToJsonSchema } from "zod-to-json-schema";
import {
  DatalabShoppingKeywordDeviceSchema,
  DatalabShoppingKeywordGenderSchema,
  DatalabShoppingKeywordAgeSchema,
  DatalabUnifiedSchema,
  DatalabSearchSchema,
  DatalabShoppingSchema,
  DatalabShoppingDeviceSchema,
  DatalabShoppingGenderSchema,
  DatalabShoppingAgeSchema,
  DatalabShoppingKeywordsSchema,
} from "../schemas/datalab.schemas.js";

/**
 * 데이터랩 관련 도구 정의
 */
export const datalabTools = [
  {
    name: "datalab_unified",
    description:
      "Analyze multiple Naver Datalab metrics at once. (네이버 데이터랩 통합 분석)",
    inputSchema: zodToJsonSchema(DatalabUnifiedSchema),
  },
  {
    name: "datalab_search",
    description:
      "Analyze search term trends on Naver. (네이버 검색어 트렌드 분석)",
    inputSchema: zodToJsonSchema(DatalabSearchSchema),
  },
  {
    name: "datalab_shopping_category",
    description:
      "Analyze shopping trends by category. (네이버 쇼핑 카테고리별 트렌드 분석)",
    inputSchema: zodToJsonSchema(DatalabShoppingSchema),
  },
  {
    name: "datalab_shopping_by_device",
    description:
      "Analyze shopping trends by device type (PC/Mobile). (네이버 쇼핑 기기별 트렌드 분석)",
    inputSchema: zodToJsonSchema(DatalabShoppingDeviceSchema),
  },
  {
    name: "datalab_shopping_by_gender",
    description:
      "Analyze shopping trends by gender. (네이버 쇼핑 성별 트렌드 분석)",
    inputSchema: zodToJsonSchema(DatalabShoppingGenderSchema),
  },
  {
    name: "datalab_shopping_by_age",
    description:
      "Analyze shopping trends by age groups. (네이버 쇼핑 연령별 트렌드 분석)",
    inputSchema: zodToJsonSchema(DatalabShoppingAgeSchema),
  },
  {
    name: "datalab_shopping_keywords",
    description:
      "Analyze shopping keyword trends. (네이버 쇼핑 키워드 트렌드 분석)",
    inputSchema: zodToJsonSchema(DatalabShoppingKeywordsSchema),
  },
  {
    name: "datalab_shopping_keyword_by_device",
    description:
      "Perform a trend analysis on Naver Shopping keywords by device. (네이버 쇼핑 키워드 기기별 트렌드 분석)",
    inputSchema: zodToJsonSchema(DatalabShoppingKeywordDeviceSchema),
  },
  {
    name: "datalab_shopping_keyword_by_gender",
    description:
      "Perform a trend analysis on Naver Shopping keywords by gender. (네이버 쇼핑 키워드 성별 트렌드 분석)",
    inputSchema: zodToJsonSchema(DatalabShoppingKeywordGenderSchema),
  },
  {
    name: "datalab_shopping_keyword_by_age",
    description:
      "Perform a trend analysis on Naver Shopping keywords by age. (네이버 쇼핑 키워드 연령별 트렌드 분석)",
    inputSchema: zodToJsonSchema(DatalabShoppingKeywordAgeSchema),
  },
];
