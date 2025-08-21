# Naver Search MCP - Complete Workflow Guide

## 🎯 비즈니스 시나리오별 도구 사용법

### 1. 패션 트렌드 분석하고 싶다면

```
🚀 원스톱 워크플로우: find_category → 바로 분석!

STEP 1: find_category
- query: "패션"
- 결과: 스마트 퍼지 검색으로 관련 카테고리 자동 발견 + 관련도 점수별 정렬
- 장점: 한 번의 호출로 모든 패션 관련 카테고리 코드 확보

STEP 2: datalab_shopping_category  
- category: [{"name": "패션의류", "param": ["50000000"]}]
- startDate: "2024-01-01", endDate: "2024-08-01"
- timeUnit: "month" (월별 트렌드)

STEP 3 (선택): 세부 분석
- datalab_shopping_gender: 남녀별 구매 패턴
- datalab_shopping_age: 연령대별 선호도
- datalab_shopping_keywords: "원피스" vs "자켓" 키워드 비교
```

### 2. 경쟁사 분석

```
STEP 1: search_webkr 또는 search_news
- query: "경쟁사명 + 신제품"
- 최신 소식, 마케팅 전략 파악

STEP 2: search_shop  
- query: "타겟 제품명"
- 가격, 리뷰, 판매 현황 확인

STEP 3: datalab_shopping_keywords
- 경쟁 제품 키워드들 트렌드 비교
```

### 3. 시장 기회 발굴

```
STEP 1: list_categories
- 전체 대분류 카테고리 확인

STEP 2: find_category  
- 관심 분야 검색 (예: "건강", "취미")

STEP 3: datalab_shopping_category
- 여러 카테고리 트렌드 비교
- 성장하는 시장 식별

STEP 4: datalab_shopping_by_device
- 모바일 친화적인 카테고리 확인
```

## 📊 파라미터 상세 가이드

### timeUnit 선택 가이드

| 기간 | 추천 timeUnit | 이유 |
|------|---------------|------|
| 1-2개월 | `"date"` | 일별 세밀한 패턴 분석 |
| 3-6개월 | `"week"` | 주별 트렌드, 계절성 파악 |
| 6개월+ | `"month"` | 장기 트렌드, 성장률 분석 |

### 날짜 범위 제한

- **검색 트렌드**: 2016-01-01부터 가능
- **쇼핑 데이터**: 2017-08-01부터 가능
- **권장**: 최근 1년 데이터 (더 정확함)

### 연령대 코드

| 코드 | 연령대 | 특징 |
|------|--------|------|
| "10" | 10-19세 | Z세대, 트렌드 민감 |
| "20" | 20-29세 | 구매력 상승, 온라인 주력 |
| "30" | 30-39세 | 주요 소비층, 가격 민감 |
| "40" | 40-49세 | 프리미엄 선호 |
| "50" | 50-59세 | 실용성 중시 |
| "60" | 60세+ | 신뢰성, 브랜드 중시 |

## 🔄 고급 워크플로우

### A. 계절성 분석

1. `find_category` → 카테고리 코드 확보
2. `datalab_shopping_category` (1년간, month)
3. 월별 패턴에서 피크/바텀 시즌 식별
4. `datalab_shopping_keywords`로 세부 제품 확인

### B. 타겟 고객 프로파일링

1. `find_category` → 관심 카테고리 선정
2. `datalab_shopping_by_age` → 주 구매연령 파악  
3. `datalab_shopping_by_gender` → 성비 확인
4. `datalab_shopping_by_device` → 선호 쇼핑 경로
5. 종합하여 페르소나 구성

### C. 키워드 최적화

1. `find_category` → 카테고리 선정
2. `datalab_shopping_keywords` → 주요 키워드 트렌드
3. `search_shop` → 실제 검색 결과 확인  
4. SEO/광고 키워드 우선순위 결정

## ⚠️ 주의사항

### 필수 규칙
- **카테고리 검색**: 반드시 한국어 사용 ("패션", "화장품")
- **날짜 형식**: "YYYY-MM-DD" (예: "2024-01-01")
- **시작일 < 종료일**: 날짜 순서 확인

### 토큰 효율성
- `find_category`: 최대 20개 결과 제한
- 넓은 검색어보다 구체적인 검색어 사용
- 필요한 파라미터만 지정 (선택 항목 생략)

### 에러 방지
- 존재하지 않는 카테고리 코드 사용 금지
- 너무 오래된 날짜 (2017년 이전) 피하기
- 빈 배열이나 null 값 전달 금지

## 📈 실전 예시

### "K-뷰티 해외 진출 전략"
```
1. find_category("화장품") → 카테고리 코드 확보
2. datalab_shopping_category → 화장품 시장 성장률
3. datalab_shopping_keywords → "K뷰티" vs "한국화장품" 트렌드
4. search_news("K뷰티 해외") → 최신 해외 진출 소식
5. datalab_shopping_by_age → 주 타겟층 확인
```

### "모바일 커머스 최적화"
```
1. find_category("전자제품") → 관심 카테고리
2. datalab_shopping_by_device → PC vs 모바일 비율
3. datalab_shopping_by_age → 모바일 선호 연령대
4. search_shop("스마트폰") → 모바일 쇼핑 UX 분석
```

이 가이드를 따라하면 LLM이 비즈니스 목적에 맞는 최적의 도구 조합을 선택할 수 있습니다!