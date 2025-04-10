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
  DatalabShoppingKeywordAge,
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

export async function handleUnifiedDatalab(params: any) {
  const { types = ["search", "shopping_category"], ...commonParams } = params;
  const results: Record<string, any> = {};

  await Promise.all(
    types.map(async (type: string) => {
      try {
        let result;
        switch (type) {
          case "search":
            result = await handleSearchTrend(params);
            break;
          case "shopping_category":
            result = await handleShoppingCategoryTrend(params);
            break;
          case "shopping_by_device":
            result = await handleShoppingByDeviceTrend(params);
            break;
          case "shopping_by_gender":
            result = await handleShoppingByGenderTrend(params);
            break;
          case "shopping_by_age":
            result = await handleShoppingByAgeTrend(params);
            break;
          case "shopping_keywords":
            result = await handleShoppingKeywordsTrend(params);
            break;
          case "shopping_keyword_by_device":
            result = await handleShoppingKeywordByDeviceTrend(params);
            break;
          case "shopping_keyword_by_gender":
            result = await handleShoppingKeywordByGenderTrend(params);
            break;
          case "shopping_keyword_by_age":
            result = await handleShoppingKeywordByAgeTrend(params);
            break;
          default:
            throw new Error(`Unknown datalab type: ${type}`);
        }
        results[type] = result;
      } catch (error) {
        console.error(`Error analyzing ${type}:`, error);
        results[type] = {
          error: error instanceof Error ? error.message : String(error),
        };
      }
    })
  );

  return {
    startDate: params.startDate,
    endDate: params.endDate,
    timeUnit: params.timeUnit,
    results,
  };
}
