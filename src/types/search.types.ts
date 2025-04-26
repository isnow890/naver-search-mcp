// 네이버 검색 API 공통 응답 타입
export interface NaverSearchResponse {
  lastBuildDate: string; // 검색 결과 생성 시각 (RFC822)
  total: number; // 전체 검색 결과 수
  start: number; // 검색 시작 위치
  display: number; // 한 번에 표시할 검색 결과 수
  items: NaverSearchItem[]; // 검색 결과 아이템 목록
  isError?: boolean; // 에러 여부(선택)
}

// 네이버 검색 API 공통 아이템 타입
export interface NaverSearchItem {
  title: string; // 아이템 제목 (검색어는 <b> 태그로 강조)
  link: string; // 아이템 URL
  description: string; // 아이템 설명 (검색어는 <b> 태그로 강조)
}

// 전문자료 검색 응답 타입
export interface NaverDocumentSearchResponse extends NaverSearchResponse {
  items: NaverDocumentItem[]; // 전문자료 아이템 목록
}

// 전문자료 아이템 타입
export interface NaverDocumentItem extends NaverSearchItem {
  title: string; // 문서 제목 (<b> 태그 강조)
  link: string; // 문서 URL
  description: string; // 문서 요약 (<b> 태그 강조)
}

// 지식백과 검색 응답 타입
export interface NaverEncyclopediaSearchResponse extends NaverSearchResponse {
  items: NaverEncyclopediaItem[]; // 지식백과 아이템 목록
}

// 지식백과 아이템 타입
export interface NaverEncyclopediaItem extends NaverSearchItem {
  title: string; // 백과사전 제목 (<b> 태그 강조)
  link: string; // 백과사전 문서 URL
  description: string; // 백과사전 요약 (<b> 태그 강조)
  thumbnail: string; // 썸네일 이미지 URL
}

// 지역 검색 응답 타입
export interface NaverLocalSearchResponse extends NaverSearchResponse {
  items: NaverLocalItem[]; // 지역 아이템 목록
}

// 지역 아이템 타입
export interface NaverLocalItem extends Omit<NaverSearchItem, "description"> {
  title: string; // 업체/기관명
  link: string; // 상세 정보 URL
  category: string; // 분류 정보
  description: string; // 설명
  telephone: string; // 전화번호(반환 안함)
  address: string; // 지번 주소
  roadAddress: string; // 도로명 주소
  mapx: number; // x좌표(KATECH)
  mapy: number; // y좌표(KATECH)
}
