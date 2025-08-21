import { NaverSearchClient } from "../clients/naver-search.client.js";
import {
  DatalabSearch,
  DatalabShopping,
  DatalabShoppingDevice,
  DatalabShoppingGender,
  DatalabShoppingAge,
  DatalabShoppingKeywords,
  DatalabShoppingKeywordDevice,
  DatalabShoppingKeywordGender,
  DatalabShoppingKeywordAge,
  DatalabSearchSchema,
  DatalabShoppingSchema,
  DatalabShoppingDeviceSchema,
  DatalabShoppingGenderSchema,
  DatalabShoppingAgeSchema,
  DatalabShoppingKeywordsSchema,
  DatalabShoppingKeywordDeviceSchema,
  DatalabShoppingKeywordGenderSchema,
  DatalabShoppingKeywordAgeSchema
} from "../schemas/datalab.schemas.js";

// 클라이언트 인스턴스 (싱글톤)
const client = NaverSearchClient.getInstance();

/**
 * 데이터랩 도구 핸들러 맵
 * 각 도구 이름을 키로, 실행할 핸들러 함수를 값으로 가짐
 * index.ts에서 도구 실행 분기 없이 바로 사용
 */
export const datalabToolHandlers: Record<string, (args: any) => Promise<any>> =
  {
    datalab_search: (args) => {
      console.error("datalab_search called with args:", JSON.stringify(args, null, 2));
      return handleSearchTrend(DatalabSearchSchema.parse(args));
    },
    datalab_shopping_category: (args) => {
      console.error("datalab_shopping_category called with args:", JSON.stringify(args, null, 2));
      return handleShoppingCategoryTrend(DatalabShoppingSchema.parse(args));
    },
    datalab_shopping_by_device: (args) => {
      console.error("datalab_shopping_by_device called with args:", JSON.stringify(args, null, 2));
      return handleShoppingByDeviceTrend(DatalabShoppingDeviceSchema.parse(args));
    },
    datalab_shopping_by_gender: (args) => {
      console.error("datalab_shopping_by_gender called with args:", JSON.stringify(args, null, 2));
      return handleShoppingByGenderTrend(DatalabShoppingGenderSchema.parse(args));
    },
    datalab_shopping_by_age: (args) => {
      console.error("datalab_shopping_by_age called with args:", JSON.stringify(args, null, 2));
      return handleShoppingByAgeTrend(DatalabShoppingAgeSchema.parse(args));
    },
    datalab_shopping_keywords: (args) => {
      console.error("datalab_shopping_keywords called with args:", JSON.stringify(args, null, 2));
      return handleShoppingKeywordsTrend(DatalabShoppingKeywordsSchema.parse(args));
    },
    datalab_shopping_keyword_by_device: (args) => {
      console.error("datalab_shopping_keyword_by_device called with args:", JSON.stringify(args, null, 2));
      return handleShoppingKeywordByDeviceTrend(DatalabShoppingKeywordDeviceSchema.parse(args));
    },
    datalab_shopping_keyword_by_gender: (args) => {
      console.error("datalab_shopping_keyword_by_gender called with args:", JSON.stringify(args, null, 2));
      return handleShoppingKeywordByGenderTrend(DatalabShoppingKeywordGenderSchema.parse(args));
    },
    datalab_shopping_keyword_by_age: (args) => {
      console.error("datalab_shopping_keyword_by_age called with args:", JSON.stringify(args, null, 2));
      return handleShoppingKeywordByAgeTrend(DatalabShoppingKeywordAgeSchema.parse(args));
    },
  };

/**
 * 검색어 트렌드 핸들러
 * 네이버 데이터랩 검색어 트렌드 분석 API 호출
 * @param params DatalabSearch
 */
export async function handleSearchTrend(params: DatalabSearch) {
  return client.searchTrend(params);
}

/**
 * 쇼핑 카테고리 트렌드 핸들러
 * 네이버 데이터랩 쇼핑 카테고리별 트렌드 분석 API 호출
 * @param params DatalabShopping
 */
export async function handleShoppingCategoryTrend(params: DatalabShopping) {
  return client.datalabShoppingCategory(params);
}

/**
 * 쇼핑 기기별 트렌드 핸들러
 * 네이버 데이터랩 쇼핑 기기별 트렌드 분석 API 호출
 * @param params DatalabShoppingDevice
 */
export async function handleShoppingByDeviceTrend(
  params: DatalabShoppingDevice
) {
  return client.datalabShoppingByDevice({
    startDate: params.startDate,
    endDate: params.endDate,
    timeUnit: params.timeUnit,
    category: params.category,
    device: params.device,
  });
}

/**
 * 쇼핑 성별 트렌드 핸들러
 * 네이버 데이터랩 쇼핑 성별 트렌드 분석 API 호출
 * @param params DatalabShoppingGender
 */
export async function handleShoppingByGenderTrend(
  params: DatalabShoppingGender
) {
  return client.datalabShoppingByGender({
    startDate: params.startDate,
    endDate: params.endDate,
    timeUnit: params.timeUnit,
    category: params.category,
    gender: params.gender,
  });
}

/**
 * 쇼핑 연령별 트렌드 핸들러
 * 네이버 데이터랩 쇼핑 연령별 트렌드 분석 API 호출
 * @param params DatalabShoppingAge
 */
export async function handleShoppingByAgeTrend(params: DatalabShoppingAge) {
  return client.datalabShoppingByAge({
    startDate: params.startDate,
    endDate: params.endDate,
    timeUnit: params.timeUnit,
    category: params.category,
    ages: params.ages,
  });
}

/**
 * 쇼핑 키워드 트렌드 핸들러 (복수 키워드 그룹 지원)
 * 네이버 데이터랩 쇼핑 키워드 그룹 트렌드 분석 API 호출
 * @param params DatalabShoppingKeywords
 */
export async function handleShoppingKeywordsTrend(
  params: DatalabShoppingKeywords
) {
  // 키워드 배열을 네이버 API에 맞는 형식으로 변환
  return client.datalabShoppingKeywords({
    startDate: params.startDate,
    endDate: params.endDate,
    timeUnit: params.timeUnit,
    category: params.category,
    keyword: params.keyword,
  });
}

/**
 * 쇼핑 키워드 기기별 트렌드 핸들러
 * 네이버 데이터랩 쇼핑 키워드 기기별 트렌드 분석 API 호출
 * @param params DatalabShoppingKeywordDevice
 */
export async function handleShoppingKeywordByDeviceTrend(
  params: DatalabShoppingKeywordDevice
) {
  return client.datalabShoppingKeywordByDevice({
    startDate: params.startDate,
    endDate: params.endDate,
    timeUnit: params.timeUnit,
    category: params.category,
    keyword: params.keyword,
    device: params.device,
  });
}

/**
 * 쇼핑 키워드 성별 트렌드 핸들러
 * 네이버 데이터랩 쇼핑 키워드 성별 트렌드 분석 API 호출
 * @param params DatalabShoppingKeywordGender
 */
export async function handleShoppingKeywordByGenderTrend(
  params: DatalabShoppingKeywordGender
) {
  return client.datalabShoppingKeywordByGender({
    startDate: params.startDate,
    endDate: params.endDate,
    timeUnit: params.timeUnit,
    category: params.category,
    keyword: params.keyword,
    gender: params.gender,
  });
}

/**
 * 쇼핑 키워드 연령별 트렌드 핸들러
 * 네이버 데이터랩 쇼핑 키워드 연령별 트렌드 분석 API 호출
 * @param params DatalabShoppingKeywordAge
 */
export async function handleShoppingKeywordByAgeTrend(
  params: DatalabShoppingKeywordAge
) {
  return client.datalabShoppingKeywordByAge({
    startDate: params.startDate,
    endDate: params.endDate,
    timeUnit: params.timeUnit,
    category: params.category,
    keyword: params.keyword,
    ages: params.ages,
  });
}
