import axios, { AxiosRequestConfig } from "axios";
import { NaverSearchConfig } from "../schemas/search.schemas.js";

export abstract class NaverApiCoreClient {
  protected searchBaseUrl = "https://openapi.naver.com/v1/search";
  protected datalabBaseUrl = "https://openapi.naver.com/v1/datalab";
  protected config: NaverSearchConfig | null = null;

  initialize(config: NaverSearchConfig) {
    this.config = config;
  }

  protected getHeaders(
    contentType: string = "application/json"
  ): AxiosRequestConfig {
    if (!this.config) throw new Error("NaverApiCoreClient is not initialized.");
    return {
      headers: {
        "X-Naver-Client-Id": this.config.clientId,
        "X-Naver-Client-Secret": this.config.clientSecret,
        "Content-Type": contentType,
      },
    };
  }

  protected async get<T>(url: string, params: any): Promise<T> {
    const response = await axios.get<T>(url, { params, ...this.getHeaders() });
    return response.data;
  }

  protected async post<T>(url: string, data: any): Promise<T> {
    const response = await axios.post<T>(url, data, this.getHeaders());
    return response.data;
  }
}
