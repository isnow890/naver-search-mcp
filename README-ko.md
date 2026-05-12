# Naver Search MCP Server

[![English](https://img.shields.io/badge/English-README-yellow)](README.md)
[![MCP.so](https://img.shields.io/badge/MCP.so-Naver%20Search%20MCP-blue)](https://mcp.so/server/naver-search-mcp/isnow890)

Naver 검색 API와 DataLab API 통합을 위한 MCP 서버로, 다양한 Naver 서비스에서의 종합적인 검색과 데이터 트렌드 분석을 가능하게 합니다.

## 빠른 시작: API 키 없이 사용하기

[Kakao PlayMCP](https://playmcp.kakao.com/mcp/154)를 통해 API 키 없이 즉시 사용할 수 있습니다. 링크를 방문하여 바로 시작하세요!

## 도구 세부 정보

### 사용 가능한 도구:

#### 🆕 카테고리 검색

- **find_category**: 카테고리 검색 도구 - 이제 트렌드와 쇼핑 인사이트 검색을 위하여 카테고리 번호를 url로 일일히 찾을 필요가 없습니다. 편하게 자연어로 검색하세요.

#### 검색 도구

- **search_webkr**: 웹 문서 검색
- **search_news**: 뉴스 검색
- **search_blog**: 블로그 검색
- **search_cafearticle**: 카페글 검색
- **search_shop**: 쇼핑 검색
- **search_image**: 이미지 검색
- **search_kin**: 지식iN 검색
- **search_book**: 책 검색
- **search_encyc**: 백과사전 검색
- **search_academic**: 학술 논문 검색
- **search_local**: 지역 장소 검색

#### DataLab 도구

- **datalab_search**: 검색어 트렌드 분석
- **datalab_shopping_category**: 쇼핑 카테고리 트렌드 분석
- **datalab_shopping_by_device**: 기기별 쇼핑 트렌드 분석
- **datalab_shopping_by_gender**: 성별 쇼핑 트렌드 분석
- **datalab_shopping_by_age**: 연령대별 쇼핑 트렌드 분석
- **datalab_shopping_keywords**: 쇼핑 키워드 트렌드 분석
- **datalab_shopping_keyword_by_device**: 쇼핑 키워드 기기별 트렌드 분석
- **datalab_shopping_keyword_by_gender**: 쇼핑 키워드 성별 트렌드 분석
- **datalab_shopping_keyword_by_age**: 쇼핑 키워드 연령별 트렌드 분석

## API 키 얻기

1. [Naver Developers](https://developers.naver.com/apps/#/register)에 방문하여 네이버 계정으로 로그인
2. "애플리케이션 등록" 버튼 클릭
3. 애플리케이션 정보 입력:
   - **애플리케이션 이름**: 원하는 이름 입력 (예: "Naver Search MCP")
   - **사용 API**: "검색" 선택
4. API 설정에서 다음 API를 **모두 체크**:
   - **검색** - 블로그, 뉴스, 책, 카페글, 웹문서, 이미지, 지식iN, 백과사전, 학술논문, 지역 검색에 필요
   - **데이터랩 - 검색어 트렌드** - 검색어 트렌드 분석에 필요
   - **데이터랩 - 쇼핑인사이트** - 쇼핑 트렌드 분석에 필요
5. "등록하기" 버튼 클릭하여 등록 완료
6. 등록 완료 후 애플리케이션 상세 페이지에서 **Client ID**와 **Client Secret** 확인
7. 아래 설정에서 이 credentials를 사용하세요

## 설치

### 방법 1: NPX 설치 (권장)

이 MCP 서버를 사용하는 가장 안정적인 방법은 NPX 직접 설치입니다. 자세한 패키지 정보는 [NPM 패키지 페이지](https://www.npmjs.com/package/@isnow890/naver-search-mcp)를 참조하세요.

#### Claude Desktop 설정

Claude Desktop 설정 파일에 다음을 추가하세요 (Windows: `%APPDATA%\Claude\claude_desktop_config.json`, macOS/Linux: `~/Library/Application Support/Claude/claude_desktop_config.json`):

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

#### Claude Code 설정

Claude Code 설정에 다음을 추가하세요:

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

### 방법 2: OpenClaw용 ClawHub 설치

이 MCP 서버는 ClawHub skill wrapper를 통해 OpenClaw에서도 사용할 수 있습니다. ClawHub에 skill이 배포된 후 다음 명령으로 설치하세요:

```bash
openclaw skills install naver-search-mcp
```

ClawHub skill은 내부적으로 동일한 npm 패키지를 사용합니다:

```bash
npx -y @isnow890/naver-search-mcp
```

사용 전에 OpenClaw 환경에 `NAVER_CLIENT_ID`와 `NAVER_CLIENT_SECRET`을 설정해야 합니다.

### 방법 3: 로컬 설치

로컬 개발이나 커스텀 수정이 필요한 경우:

#### 1단계: 소스 코드 다운로드 및 빌드

##### Git으로 클론하기

```bash
git clone https://github.com/isnow890/naver-search-mcp.git
cd naver-search-mcp
npm install
npm run build
```

##### 또는 ZIP 파일로 다운로드

1. [GitHub 릴리스 페이지](https://github.com/isnow890/naver-search-mcp/)에서 최신 버전을 다운로드
2. ZIP 파일을 원하는 위치에 압축 해제
3. 터미널에서 압축 해제된 폴더로 이동:

```bash
cd /path/to/naver-search-mcp
npm install
npm run build
```

⚠️ **중요**: 설치 후 반드시 `npm run build`를 실행하여 컴파일된 JavaScript 파일이 포함된 `dist` 폴더를 생성해야 합니다.

#### 2단계: Claude Desktop 설정

빌드 완료 후 다음 정보가 필요합니다:

- **NAVER_CLIENT_ID**: Naver Developers에서 발급받은 클라이언트 ID
- **NAVER_CLIENT_SECRET**: Naver Developers에서 발급받은 클라이언트 시크릿
- **설치 경로**: 다운로드한 폴더의 절대 경로

##### Windows 설정

Claude Desktop 설정 파일(`%APPDATA%\Claude\claude_desktop_config.json`)에 다음을 추가:

```json
{
  "mcpServers": {
    "naver-search": {
      "type": "stdio",
      "command": "cmd",
      "args": [
        "/c",
        "node",
        "C:\\path\\to\\naver-search-mcp\\dist\\src\\index.js"
      ],
      "cwd": "C:\\path\\to\\naver-search-mcp",
      "env": {
        "NAVER_CLIENT_ID": "your-naver-client-id",
        "NAVER_CLIENT_SECRET": "your-naver-client-secret"
      }
    }
  }
}
```

##### macOS/Linux 설정

Claude Desktop 설정 파일(`~/Library/Application Support/Claude/claude_desktop_config.json`)에 다음을 추가:

```json
{
  "mcpServers": {
    "naver-search": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/naver-search-mcp/dist/src/index.js"],
      "cwd": "/path/to/naver-search-mcp",
      "env": {
        "NAVER_CLIENT_ID": "your-naver-client-id",
        "NAVER_CLIENT_SECRET": "your-naver-client-secret"
      }
    }
  }
}
```

##### 경로 설정 주의사항

⚠️ **중요**: 위 설정에서 다음 경로들을 실제 설치 경로로 변경해야 합니다:

- **Windows**: `C:\\path\\to\\naver-search-mcp`를 실제 다운로드한 폴더 경로로 변경
- **macOS/Linux**: `/path/to/naver-search-mcp`를 실제 다운로드한 폴더 경로로 변경
- **빌드 경로**: 경로가 `dist/src/index.js`를 가리키는지 확인 (`index.js`만이 아님)

경로 찾기:

```bash
# 현재 위치 확인
pwd

# 절대 경로 예시
# Windows: C:\Users\홍길동\Downloads\naver-search-mcp
# macOS: /Users/홍길동/Downloads/naver-search-mcp
# Linux: /home/홍길동/Downloads/naver-search-mcp
```

#### 3단계: Claude Desktop 재시작

설정 완료 후 Claude Desktop을 완전히 종료하고 다시 시작하면 Naver Search MCP 서버가 활성화됩니다.

## API 키 얻기

1. [Naver Developers](https://developers.naver.com/apps/#/register)에 방문
2. "애플리케이션 등록"을 클릭
3. 애플리케이션 이름을 입력하고 다음 API를 모두 선택:
   - 검색 (블로그, 뉴스, 책 검색 등을 위한)
   - DataLab (검색 트렌드)
   - DataLab (쇼핑 인사이트)
4. 얻은 클라이언트 ID와 클라이언트 시크릿을 환경 변수로 설정

## 필수 요구 사항

- Naver Developers API 키(클라이언트 ID 및 시크릿)
- Node.js 18 이상
- NPM 8 이상

## 라이선스

MIT 라이선스

---

## 버전 히스토리

### 1.0.47 (2025-01-03)

- **"today" 키워드 지원 추가** - 모든 DataLab 날짜 파라미터에서 별도 시간 도구 호출 불필요
- **서버 종료 문제 해결** - 클라이언트 연결 해제 시 MCP 서버가 정상적으로 종료
- **정상 종료 핸들러 추가** - SIGINT, SIGTERM, 전송 닫기 이벤트 처리
- **get_current_korean_time 도구 제거** - "today" 키워드 기능으로 중복 제거
- **메모리 모니터링 모듈 제거** - setInterval로 인한 프로세스 종료 방지 문제 해결
- **@gloomyrobot님께 감사** - 서버 종료 문제를 보고해주셔서 해결할 수 있었습니다

### 1.0.45 (2025-09-28)

- 호스팅 MCP 설치 환경 호환성 문제 해결
- 카테고리 검색에서 엑셀 호환성 문제 해결 - JSON 기능으로 교체
- 웹 한국어 검색(`search_webkr`) 기능 복구
- 호스팅 플랫폼 설치 호환성 개선

### 1.0.44 (2025-08-31)

- `get_current_korean_time` 도구 추가 - 한국 시간대를 위한 필수 시간 컨텍스트 도구
- 시간적 쿼리를 위한 시간 도구 참조로 모든 기존 도구 설명 강화
- "오늘", "지금", "현재" 검색을 위한 시간적 컨텍스트 처리 개선
- 다양한 출력 형식의 포괄적인 한국어 시간 포맷팅

### 1.0.40 (2025-08-21)

- `find_category` 도구 추가
**이제 트렌드와 쇼핑 인사이트 검색을 위하여 카테고리 번호를 url로 일일히 찾을 필요가 없습니다. 편하게 자연어로 검색하세요.**

- Zod 스키마 기반 매개변수 검증 강화
- 카테고리 검색 워크플로우 개선
- 레벨 기반 카테고리 순위 시스템 구현 (대분류 우선)

### 1.0.30 (2025-08-04)

- MCP SDK 1.17.1로 업그레이드
- 호스팅 MCP 플랫폼 스펙 변경으로 인한 호환성 오류 수정
- DataLab 쇼핑 카테고리 코드 상세 문서화 추가

### 1.0.2 (2025-04-26)

- README 업데이트: 카페글 검색 도구 및 버전 히스토리 안내 개선

### 1.0.1 (2025-04-26)

- 카페글 검색 기능 추가
- zod에 쇼핑 카테고리 정보 추가
- 소스코드 리팩토링

### 1.0.0 (2025-04-08)

- 오픈오픈
