import { NaverSearchClient } from "../naver-search.client.js";
import {
  DatalabSearch,
  DatalabShopping,
  DatalabShoppingDevice,
  DatalabShoppingGender,
  DatalabShoppingAge,
  DatalabShoppingKeywords,
  DatalabShoppingKeywordDevice,
  DatalabShoppingKeywordGender,
  DatalabShoppingKeywordAge
} from "../schemas/datalab.schemas.js";

// 클라이언트 인스턴스
const client = NaverSearchClient.getInstance();

/**
 * 검색어 트렌드 핸들러
 */
export async function handleSearchTrend(params: DatalabSearch) {
  return client.searchTrend(params);
}

/**
 * 쇼핑 카테고리 트렌드 핸들러
 */
export async function handleShoppingCategoryTrend(params: DatalabShopping) {
  return client.datalabShoppingCategory(params);
}

/**
 * 쇼핑 기기별 트렌드 핸들러
 */
export async function handleShoppingByDeviceTrend(params: DatalabShoppingDevice) {
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
 */
export async function handleShoppingByGenderTrend(params: DatalabShoppingGender) {
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
 * 쇼핑 키워드 트렌드 핸들러
 * 복수 키워드 그룹을 지원합니다.
 */
export async function handleShoppingKeywordsTrend(params: DatalabShoppingKeywords) {
  // 키워드 배열을 네이버 API에 맞는 형식으로 변환
  return client.datalabShoppingKeywords({
    startDate: params.startDate,
    endDate: params.endDate,
    timeUnit: params.timeUnit,
    category: params.category,
    keyword: params.keyword
  });
}

/**
 * 쇼핑 키워드 기기별 트렌드 핸들러
 */
export async function handleShoppingKeywordByDeviceTrend(params: DatalabShoppingKeywordDevice) {
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
 */
export async function handleShoppingKeywordByGenderTrend(params: DatalabShoppingKeywordGender) {
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
 */
export async function handleShoppingKeywordByAgeTrend(params: DatalabShoppingKeywordAge) {
  return client.datalabShoppingKeywordByAge({
    startDate: params.startDate,
    endDate: params.endDate,
    timeUnit: params.timeUnit,
    category: params.category,
    keyword: params.keyword,
    ages: params.ages,
  });
} 