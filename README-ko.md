# Naver Search MCP Server

[![English](https://img.shields.io/badge/English-README-yellow)](README.md)
[![smithery badge](https://smithery.ai/badge/@isnow890/naver-search-mcp)](https://smithery.ai/server/@isnow890/naver-search-mcp)
[![MCP.so](https://img.shields.io/badge/MCP.so-Naver%20Search%20MCP-blue)](https://mcp.so/server/naver-search-mcp/isnow890)

Naver 검색 API와 DataLab API 통합을 위한 MCP 서버로, 다양한 Naver 서비스에서의 종합적인 검색과 데이터 트렌드 분석을 가능하게 합니다.

#### 버전 히스토리

###### 1.0.4 (2025-08-21)

- Fast MCP 3.1.1 아키텍처로 전환 (코드베이스 간소화)
- `find_category` 도구 추가 - 퍼지 매칭과 순위 시스템 지원
- Zod 스키마 기반 매개변수 검증 강화
- 카테고리 검색 워크플로우 개선
- 레벨 기반 카테고리 순위 시스템 구현 (대분류 우선)
- 동적 엑셀 파일 감지 기능 추가

###### 1.0.30 (2025-08-04)

- MCP SDK 1.17.1로 업그레이드
- Smithery 스펙 변경으로 인한 호환성 오류 수정
- DataLab 쇼핑 카테고리 코드 상세 문서화 추가

###### 1.0.2 (2025-04-26)

- README 업데이트: 카페글 검색 도구 및 버전 히스토리 안내 개선

###### 1.0.1 (2025-04-26)

- 카페글 검색 기능 추가
- zod에 쇼핑 카테고리 정보 추가
- 소스코드 리팩토링

###### 1.0.0 (2025-04-08)

- 오픈오픈

#### 안내

**npx로 설치하시려는 분들은
@mseep/server-naver-search(https://www.npmjs.com/package/@mseep/server-naver-search) 에서 절대 설치 하시지 마세요. 누군가 올렸는데 메일 보내도 응답이 없어요. 해당버전의 npx는 문제가 있어 설치해도 제대로 동작하지 않습니다.**

#### 필수 요구 사항

- Naver Developers API 키(클라이언트 ID 및 시크릿)
- Node.js 22 이상
- NPM 8 이상
- Docker (선택 사항, 컨테이너 배포용)

#### API 키 얻기

1. [Naver Developers](https://developers.naver.com/apps/#/register)에 방문
2. "애플리케이션 등록"을 클릭
3. 애플리케이션 이름을 입력하고 다음 API를 모두 선택:
   - 검색 (블로그, 뉴스, 책 검색 등을 위한)
   - DataLab (검색 트렌드)
   - DataLab (쇼핑 인사이트)
4. 얻은 클라이언트 ID와 클라이언트 시크릿을 환경 변수로 설정

## 도구 세부 정보

### 사용 가능한 도구:

#### 🆕 스마트 카테고리 검색

- **find_category**: 카테고리 검색 도구 - 퍼지 매칭과 순위 시스템을 통한 효율적인 카테고리 발견

#### 검색 도구

- **search_webkr**: 네이버 웹 문서 검색
- **search_news**: 네이버 뉴스 검색
- **search_blog**: 네이버 블로그 검색
- **search_cafearticle**: 네이버 카페글 검색
- **search_shop**: 네이버 쇼핑 검색
- **search_image**: 네이버 이미지 검색
- **search_kin**: 네이버 지식iN 검색
- **search_book**: 네이버 책 검색
- **search_encyc**: 네이버 백과사전 검색
- **search_academic**: 네이버 학술 논문 검색
- **search_local**: 네이버 지역 장소 검색

#### DataLab 쇼핑 인텔리전스 📊

- **datalab_search**: 검색어 트렌드 분석
- **datalab_shopping_category**: 쇼핑 카테고리 트렌드 분석
- **datalab_shopping_device**: 기기별 쇼핑 트렌드 분석 (PC vs 모바일)
- **datalab_shopping_gender**: 성별 쇼핑 트렌드 분석
- **datalab_shopping_age**: 연령대별 쇼핑 트렌드 분석 (10대-60대+)
- **datalab_shopping_keywords**: 카테고리 내 키워드 성과 비교
- **datalab_shopping_keyword_device**: 기기별 키워드 트렌드 분석
- **datalab_shopping_keyword_gender**: 성별 키워드 트렌드 분석
- **datalab_shopping_keyword_age**: 연령대별 키워드 트렌드 분석

## 🚀 스마트 카테고리 검색 & 쇼핑 인텔리전스

### 개선된 워크플로우

**v1.0.4 이전** (복잡하고 수동적):

```
1. 네이버 쇼핑 웹사이트 방문
2. 카테고리를 수동으로 탐색
3. URL에서 8자리 코드 추출
4. 코드를 기억하거나 문서화
5. DataLab 도구에서 코드 사용
```

**v1.0.4 이후** (간단하고 효율적):

```
1. find_category("패션") 사용
2. 순위가 매겨진 결과 확인
3. 트렌드 분석으로 직접 연결
```

### 🎯 비즈니스 활용 사례 & 시나리오

#### 🛍️ 전자상거래 시장 조사

```javascript
// 패션 트렌드 발견
find_category("패션") → 상위 패션 카테고리와 코드 확인
datalab_shopping_category → 계절별 패션 트렌드 분석
datalab_shopping_age → 패션 타겟 연령층 파악
datalab_shopping_keywords → "원피스" vs "자켓" vs "드레스" 비교
```

#### 📱 디지털 마케팅 전략

```javascript
// 뷰티 업계 분석
find_category("화장품") → 뷰티 카테고리 찾기
datalab_shopping_gender → 여성 95% vs 남성 5% 쇼핑객
datalab_shopping_device → 뷰티 쇼핑의 모바일 우세
datalab_shopping_keywords → "틴트" vs "립스틱" 키워드 성과
```

#### 🏢 비즈니스 인텔리전스 & 경쟁 분석

```javascript
// 테크 제품 인사이트
find_category("스마트폰") → 전자제품 카테고리 확인
datalab_shopping_category → 아이폰 vs 갤럭시 트렌드 추적
datalab_shopping_age → 20-30대가 주요 스마트폰 구매층
datalab_shopping_device → PC vs 모바일 쇼핑 행동
```

#### 📊 계절별 비즈니스 계획

```javascript
// 휴일 쇼핑 분석
find_category("선물") → 선물 카테고리
datalab_shopping_category → 블랙프라이데이, 크리스마스 트렌드
datalab_shopping_keywords → "어버이날 선물" vs "생일선물"
datalab_shopping_age → 연령대별 선물 구매 패턴
```

#### 🎯 고객 페르소나 개발

```javascript
// 피트니스 시장 분석
find_category("운동") → 스포츠/피트니스 카테고리
datalab_shopping_gender → 남녀 피트니스 지출 비교
datalab_shopping_age → 피트니스 주요 연령층 (20-40대)
datalab_shopping_keywords → "홈트" vs "헬스장" 트렌드 분석
```

### 📈 고급 분석 시나리오

#### 시장 진입 전략

1. **카테고리 발견**: `find_category`로 시장 세그먼트 탐색
2. **트렌드 분석**: 성장하는 vs 쇠퇴하는 카테고리 식별
3. **인구통계 타겟팅**: 고객 타겟팅을 위한 연령/성별 분석
4. **경쟁 인텔리전스**: 키워드 성과 비교
5. **기기 전략**: 모바일 vs PC 쇼핑 최적화

#### 제품 출시 계획

1. **시장 검증**: 카테고리 성장 트렌드와 계절성
2. **타겟 고객**: 제품 포지셔닝을 위한 인구통계 분석
3. **마케팅 채널**: 광고 전략을 위한 기기 선호도
4. **경쟁 환경**: 키워드 경쟁과 기회
5. **가격 전략**: 카테고리 성과와 가격 연관성

#### 성과 모니터링

1. **카테고리 건강도**: 제품 카테고리 트렌드 모니터링
2. **키워드 추적**: 브랜드 및 제품 키워드 성과 추적
3. **인구통계 변화**: 변화하는 고객 인구통계 모니터링
4. **계절 패턴**: 재고 및 마케팅 캠페인 계획
5. **경쟁 벤치마킹**: 카테고리 평균 대비 성과 비교

### 빠른 참조: 인기 카테고리 코드

| 카테고리        | 코드     | 한국어        |
| --------------- | -------- | ------------- |
| 패션/의류       | 50000000 | 패션의류      |
| 화장품/뷰티     | 50000002 | 화장품/미용   |
| 디지털/전자제품 | 50000003 | 디지털/가전   |
| 스포츠/레저     | 50000004 | 스포츠/레저   |
| 식품/음료       | 50000008 | 식품/음료     |
| 건강/의료       | 50000009 | 건강/의료용품 |

💡 **팁**: "뷰티", "패션", "전자제품"과 같은 퍼지 검색으로 `find_category`를 사용하여 카테고리를 쉽게 찾아보세요.

## 설치

### 옵션 1: Smithery를 통한 빠른 설치 (권장)

Smithery를 통해 Naver Search MCP 서버를 자동으로 설치하려면 AI 클라이언트에 따라 다음 명령 중 하나를 사용하세요:

Claude Desktop용:

```bash
npx -y @smithery/cli@latest install @isnow890/naver-search-mcp --client claude
```

Cursor용:

```bash
npx -y @smithery/cli@latest install @isnow890/naver-search-mcp --client cursor
```

Windsurf용:

```bash
npx -y @smithery/cli@latest install @isnow890/naver-search-mcp --client windsurf
```

Cline용:

```bash
npx -y @smithery/cli@latest install @isnow890/naver-search-mcp --client cline
```

설치 프로그램은 다음 정보를 요청할 것입니다:

- NAVER_CLIENT_ID
- NAVER_CLIENT_SECRET

### 옵션 2: 수동 설치

#### 환경 변수

```bash
# Windows
set NAVER_CLIENT_ID=your_client_id
set NAVER_CLIENT_SECRET=your_client_secret

# Linux/Mac
export NAVER_CLIENT_ID=your_client_id
export NAVER_CLIENT_SECRET=your_client_secret
```

#### NPX로 실행

```bash
npx @isnow890/naver-search-mcp
```

#### Docker로 실행

```bash
docker run -i --rm \
  -e NAVER_CLIENT_ID=your_client_id \
  -e NAVER_CLIENT_SECRET=your_client_secret \
  mcp/naver-search
```

## Claude Desktop 구성

`claude_desktop_config.json`에 추가:

```json
{
  "mcpServers": {
    "naver-search": {
      "command": "npx",
      "args": ["-y", "@isnow890/naver-search-mcp"],
      "env": {
        "NAVER_CLIENT_ID": "your_client_id",
        "NAVER_CLIENT_SECRET": "your_client_secret"
      }
    }
  }
}
```

## Cursor AI 구성

Add to `mcp.json`에 추가:

```json
{
  "mcpServers": {
    "naver-search": {
      "command": "npx",
      "args": ["-y", "@isnow890/naver-search-mcp"],
      "env": {
        "NAVER_CLIENT_ID": "your_client_id",
        "NAVER_CLIENT_SECRET": "your_client_secret"
      }
    }
  }
}
```

Docker의 경우:

```json
{
  "mcpServers": {
    "naver-search": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "NAVER_CLIENT_ID=your_client_id",
        "-e",
        "NAVER_CLIENT_SECRET=your_client_secret",
        "mcp/naver-search"
      ]
    }
  }
}
```

## 빌드

Docker 빌드:

```bash
docker build -t mcp/naver-search .
```

## 라이선스

MIT 라이선스
