// 데이터랩 분석 단위 타입
export type DatalabTimeUnit = "date" | "week" | "month";

// 데이터랩 검색 요청 타입
export interface DatalabSearchRequest {
  startDate: string; // 분석 시작일 (yyyy-mm-dd)
  endDate: string; // 분석 종료일 (yyyy-mm-dd)
  timeUnit: DatalabTimeUnit; // 분석 단위
  keywordGroups: Array<{
    groupName: string; // 키워드 그룹명
    keywords: string[]; // 그룹 내 키워드 목록
  }>;
}

// 데이터랩 쇼핑 응답 타입
export interface DatalabShoppingResponse {
  startDate: string; // 분석 시작일
  endDate: string; // 분석 종료일
  timeUnit: string; // 분석 단위
  results: {
    title: string; // 결과 제목
    category?: string[]; // 카테고리 정보
    keyword?: string[]; // 키워드 정보
    data: {
      period: string; // 기간
      group?: string; // 그룹 정보
      ratio: number; // 비율 값
    }[];
  }[];
}

// 데이터랩 쇼핑 카테고리 요청 타입
export interface DatalabShoppingCategoryRequest {
  startDate: string; // 분석 시작일 (yyyy-mm-dd)
  endDate: string; // 분석 종료일 (yyyy-mm-dd)
  timeUnit: DatalabTimeUnit; // 분석 단위
  category: Array<{
    name: string; // 카테고리명
    param: string[]; // 카테고리 파라미터
  }>;
  device?: "pc" | "mo"; // 기기 구분 (PC/모바일)
  gender?: "f" | "m"; // 성별
  ages?: string[]; // 연령대
}

// 데이터랩 쇼핑 기기별 요청 타입
export interface DatalabShoppingDeviceRequest {
  startDate: string; // 분석 시작일
  endDate: string; // 분석 종료일
  timeUnit: DatalabTimeUnit; // 분석 단위
  category: string; // 카테고리 코드
  device: "pc" | "mo"; // 기기 구분
}

// 데이터랩 쇼핑 성별 요청 타입
export interface DatalabShoppingGenderRequest {
  startDate: string; // 분석 시작일
  endDate: string; // 분석 종료일
  timeUnit: DatalabTimeUnit; // 분석 단위
  category: string; // 카테고리 코드
  gender: "f" | "m"; // 성별
}

// 데이터랩 쇼핑 연령별 요청 타입
export interface DatalabShoppingAgeRequest {
  startDate: string; // 분석 시작일
  endDate: string; // 분석 종료일
  timeUnit: DatalabTimeUnit; // 분석 단위
  category: string; // 카테고리 코드
  ages: string[]; // 연령대
}

// 데이터랩 쇼핑 키워드 그룹 요청 타입
export interface DatalabShoppingKeywordsRequest {
  startDate: string; // 분석 시작일
  endDate: string; // 분석 종료일
  timeUnit: DatalabTimeUnit; // 분석 단위
  category: string; // 카테고리 코드
  keyword: Array<{
    name: string; // 키워드명
    param: string[]; // 키워드 파라미터
  }>;
}

// 데이터랩 쇼핑 키워드 단일 요청 타입
export interface DatalabShoppingKeywordRequest {
  startDate: string; // 분석 시작일
  endDate: string; // 분석 종료일
  timeUnit: DatalabTimeUnit; // 분석 단위
  category: string; // 카테고리 코드
  keyword: string; // 검색 키워드
  device?: "pc" | "mo"; // 기기 구분
  gender?: "f" | "m"; // 성별
  ages?: string[]; // 연령대
}
