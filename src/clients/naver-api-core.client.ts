import axios, { AxiosRequestConfig, AxiosInstance } from "axios";
import { NaverSearchConfig } from "../schemas/search.schemas.js";
import {
  NaverApiProvider,
  getEndpoints,
  getAuthHeaderNames,
} from "./naver-api-endpoints.js";
import { formatApiError } from "./naver-api-error.js";

export abstract class NaverApiCoreClient {
  protected config: NaverSearchConfig | null = null;
  protected axiosInstance: AxiosInstance;

  constructor() {
    // HTTP/HTTPS 에이전트 설정으로 연결 풀링 및 메모리 누수 방지
    this.axiosInstance = axios.create({
      timeout: 30000, // 30초 타임아웃
      maxRedirects: 3,
    });
  }

  initialize(config: NaverSearchConfig) {
    this.config = config;
  }

  private requireConfig(): NaverSearchConfig {
    if (!this.config) throw new Error("NaverApiCoreClient is not initialized.");
    return this.config;
  }

  get provider(): NaverApiProvider {
    return this.requireConfig().provider;
  }

  /** 검색 API base. `${searchBaseUrl}/${type}` 형태로 사용한다. */
  get searchBaseUrl(): string {
    return getEndpoints(this.provider).search;
  }

  /** 검색어 트렌드 전체 URL. suffix를 붙이지 않는다. */
  get trendUrl(): string {
    return getEndpoints(this.provider).trend;
  }

  /** 쇼핑인사이트 base. `${shoppingBaseUrl}/categories` 형태로 사용한다. */
  get shoppingBaseUrl(): string {
    return getEndpoints(this.provider).shopping;
  }

  protected getHeaders(
    contentType: string = "application/json"
  ): AxiosRequestConfig {
    const config = this.requireConfig();
    const names = getAuthHeaderNames(config.provider);
    return {
      headers: {
        [names.id]: config.clientId,
        [names.secret]: config.clientSecret,
        "Content-Type": contentType,
      },
    };
  }

  protected async get<T>(url: string, params: any): Promise<T> {
    // provider를 요청 시점에 고정한다. 응답이 도착하기 전에 destroyInstance()가
    // config를 비울 수 있고, 그때 this.provider를 읽으면 원래 에러가 사라진다.
    const provider = this.provider;
    try {
      const response = await this.axiosInstance.get<T>(url, {
        params,
        ...this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw this.wrapError(provider, url, error);
    }
  }

  protected async post<T>(url: string, data: any): Promise<T> {
    const provider = this.provider;
    try {
      const response = await this.axiosInstance.post<T>(
        url,
        data,
        this.getHeaders()
      );
      return response.data;
    } catch (error) {
      throw this.wrapError(provider, url, error);
    }
  }

  /**
   * 두 플랫폼의 오류 응답 형식이 다르므로 파싱하지 않고 그대로 감싼다.
   */
  private wrapError(
    provider: NaverApiProvider,
    url: string,
    error: unknown
  ): Error {
    const response = (error as any)?.response;
    // 응답이 아예 없는 실패(타임아웃, DNS 실패, 연결 거부)는 axios 메시지가 유일한
    // 단서다. 이걸 버리면 모든 네트워크 오류가 똑같은 문장으로 뭉개진다.
    const body = response ? response.data : (error as any)?.message;
    return new Error(formatApiError(provider, url, response?.status, body));
  }

  /**
   * 리소스 정리 메서드 (메모리 누수 방지)
   */
  protected cleanup(): void {
    this.config = null;
  }
}
