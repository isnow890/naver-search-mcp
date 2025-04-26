import { NaverApiCoreClient } from "./naver-api-core.client.js";
import {
  NaverSearchType,
  NaverSearchConfig,
  NaverLocalSearchParams,
  NaverDocumentSearchParams,
  SearchArgs,
} from "../schemas/search.schemas.js";
import {
  NaverDocumentSearchResponse,
  NaverLocalSearchResponse,
} from "../types/search.types.js";
import {
  DatalabSearchRequest,
  DatalabShoppingResponse,
  DatalabShoppingCategoryRequest,
  DatalabShoppingDeviceRequest,
  DatalabShoppingGenderRequest,
  DatalabShoppingAgeRequest,
  DatalabShoppingKeywordsRequest,
  DatalabShoppingKeywordRequest,
} from "../types/datalab.types.js";

/**
 * NaverSearchClient - 네이버 API 서비스를 위한 싱글톤 클라이언트
 * 검색, 데이터랩 API 요청 처리
 */
export class NaverSearchClient extends NaverApiCoreClient {
  private static instance: NaverSearchClient | null = null;

  private constructor() {
    super();
  }

  /**
   * 싱글톤 인스턴스 반환
   */
  static getInstance(): NaverSearchClient {
    if (!NaverSearchClient.instance) {
      NaverSearchClient.instance = new NaverSearchClient();
    }
    return NaverSearchClient.instance;
  }

  /**
   * API 자격 증명으로 클라이언트 초기화
   */
  initialize(config: NaverSearchConfig) {
    this.config = config;
  }

  /**
   * 네이버 검색 API 호출 (type별로)
   * @param type 검색 타입(카테고리)
   * @param params 검색 파라미터
   */
  async search(type: NaverSearchType, params: SearchArgs): Promise<any> {
    return this.get(`${this.searchBaseUrl}/${type}`, params);
  }

  /**
   * 전문자료 검색 메서드
   */
  async searchAcademic(
    params: NaverDocumentSearchParams
  ): Promise<NaverDocumentSearchResponse> {
    return this.get(`${this.searchBaseUrl}/doc`, params);
  }

  /**
   * 지역 검색 메서드
   */
  async searchLocal(
    params: NaverLocalSearchParams
  ): Promise<NaverLocalSearchResponse> {
    return this.get(`${this.searchBaseUrl}/local`, params);
  }

  /**
   * 검색어 트렌드 분석 메서드
   */
  async searchTrend(params: DatalabSearchRequest): Promise<any> {
    return this.post(`${this.datalabBaseUrl}/search`, params);
  }

  /**
   * 쇼핑 카테고리 트렌드 분석 메서드
   */
  async datalabShoppingCategory(
    params: DatalabShoppingCategoryRequest
  ): Promise<DatalabShoppingResponse> {
    return this.post(`${this.datalabBaseUrl}/shopping/categories`, params);
  }

  /**
   * 쇼핑 기기별 트렌드 분석 메서드
   */
  async datalabShoppingByDevice(
    params: DatalabShoppingDeviceRequest
  ): Promise<DatalabShoppingResponse> {
    return this.post(`${this.datalabBaseUrl}/shopping/category/device`, params);
  }

  /**
   * 쇼핑 성별 트렌드 분석 메서드
   */
  async datalabShoppingByGender(
    params: DatalabShoppingGenderRequest
  ): Promise<DatalabShoppingResponse> {
    return this.post(`${this.datalabBaseUrl}/shopping/category/gender`, params);
  }

  /**
   * 쇼핑 연령별 트렌드 분석 메서드
   */
  async datalabShoppingByAge(
    params: DatalabShoppingAgeRequest
  ): Promise<DatalabShoppingResponse> {
    return this.post(`${this.datalabBaseUrl}/shopping/category/age`, params);
  }

  /**
   * 쇼핑 키워드 트렌드 분석 메서드
   */
  async datalabShoppingKeywords(
    params: DatalabShoppingKeywordsRequest
  ): Promise<DatalabShoppingResponse> {
    return this.post(
      `${this.datalabBaseUrl}/shopping/category/keywords`,
      params
    );
  }

  /**
   * 쇼핑 키워드 기기별 트렌드 분석 메서드
   */
  async datalabShoppingKeywordByDevice(
    params: DatalabShoppingKeywordRequest
  ): Promise<DatalabShoppingResponse> {
    return this.post(
      `${this.datalabBaseUrl}/shopping/category/keyword/device`,
      params
    );
  }

  /**
   * 쇼핑 키워드 성별 트렌드 분석 메서드
   */
  async datalabShoppingKeywordByGender(
    params: DatalabShoppingKeywordRequest
  ): Promise<DatalabShoppingResponse> {
    return this.post(
      `${this.datalabBaseUrl}/shopping/category/keyword/gender`,
      params
    );
  }

  /**
   * 쇼핑 키워드 연령별 트렌드 분석 메서드
   */
  async datalabShoppingKeywordByAge(
    params: DatalabShoppingKeywordRequest
  ): Promise<DatalabShoppingResponse> {
    return this.post(
      `${this.datalabBaseUrl}/shopping/category/keyword/age`,
      params
    );
  }
}
