# Naver Search MCP Server

[![English](https://img.shields.io/badge/English-README-yellow)](README-en.md)
[![MCP.so](https://img.shields.io/badge/MCP.so-Naver%20Search%20MCP-blue)](https://mcp.so/server/naver-search-mcp/isnow890)

Naver 검색 API와 DataLab API 통합을 위한 MCP 서버로, 다양한 Naver 서비스에서의 종합적인 검색과 데이터 트렌드 분석을 가능하게 합니다.

## ⚠️ 네이버 API 이관 안내 — 설치 전에 읽어주세요

네이버가 검색·검색어 트렌드·쇼핑 인사이트 API를 개발자센터에서 네이버 클라우드 플랫폼의 **NAVER API HUB**로 이관합니다. 그와 별개로 검색 API 3종은 완전히 종료됩니다.

| 날짜 | 내용 |
|---|---|
| **2026-07-31** | 개발자센터에서 **신규** 키 발급 신청이 차단됩니다.<br>쇼핑·책·전문자료 검색 API가 완전히 종료됩니다. |
| **2027-06-30** | 개발자센터 지원이 종료되어 **기존 키도 사용할 수 없게 됩니다**. |

출처: [네이버 개발자센터 공지 — Search API, Search Trend, Shopping Insight 서비스 종료 및 NAVER API HUB 이관 안내](https://developers.naver.com/notice/article/32530)

**처음 설치하시나요?** NAVER API HUB에서 키를 발급받으세요. 개발자센터는 2026-07-31부터 신규 신청을 받지 않으므로 더 이상 시작점이 아닙니다. 발급 절차는 아래 [방법 A: NAVER API HUB](#방법-a-naver-api-hub-권장--앞으로의-방향)에 단계별로 정리해 두었습니다.

**이미 개발자센터 키로 쓰고 계신가요?** 바꿀 것이 없습니다. 2027-06-30까지 그대로 동작하고, 이 버전은 두 플랫폼을 같은 설치본에서 지원합니다. 이관하실 때가 되면 HUB 키를 발급받아 환경변수 두 개만 바꾸면 되고, 그 외에 손댈 것은 없습니다.

**이 서버의 지원 계획:** 네이버가 정한 2027-06-30까지는 두 플랫폼을 나란히 지원합니다. 개발자센터 경로는 그 날짜가 지나 누구에게도 동작할 수 없게 된 뒤에야 별도 메이저 버전에서 제거합니다. 그때까지는 버전을 올려도 쓰고 계신 설정이 끊기는 일은 없습니다.

**1.0.49에서 툴 3개가 제거되었습니다**: `search_shop`, `search_book`, `search_academic`. 네이버가 2026-07-31에 해당 검색 API를 종료하며 어느 플랫폼에도 대체 API가 없어서, 이 서버가 살려둘 방법이 없습니다. 쇼핑 **인사이트**(`datalab_shopping_*`)와 `find_category`는 *별개의* API이므로 영향받지 **않습니다**.

## OpenClaw용 ClawHub 지원

이 MCP 서버는 ClawHub에 OpenClaw skill로 배포되어 있습니다:

```bash
openclaw skills install naver-search-mcp
```

ClawHub skill은 내부적으로 npm에 배포된 패키지를 사용하며, OpenClaw 환경에 **한 쌍**의 자격증명을 설정해야 합니다 — NAVER API HUB 쌍(`NCP_APIGW_API_KEY_ID` / `NCP_APIGW_API_KEY`) 또는 개발자센터 쌍(`NAVER_CLIENT_ID` / `NAVER_CLIENT_SECRET`) 중 하나입니다. OpenClaw의 `apiKey` 필드는 `NAVER_CLIENT_SECRET`에 매핑되므로, HUB 사용자는 `apiKey` 대신 두 HUB 변수를 환경에 직접 설정하세요.

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
- **search_image**: 이미지 검색
- **search_kin**: 지식iN 검색
- **search_encyc**: 백과사전 검색
- **search_local**: 지역 장소 검색

> **1.0.49에서 제거됨:** `search_shop`, `search_book`, `search_academic`
> 네이버는 2026-07-31에 쇼핑·책·전문자료 검색 API를 종료하며 대체 API가 없습니다.
> 쇼핑 **인사이트**(`datalab_shopping_*`)는 별개의 API이며 영향받지 않습니다.

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

이 서버는 두 플랫폼 중 하나에서 키를 발급받아 사용합니다. 환경변수 **한 쌍만** 설정하세요 —
어느 쌍을 설정하는지에 따라 사용되는 플랫폼이 정해지는 원리는 아래 [설정](#설정)을 참고하세요.

### 방법 A: NAVER API HUB (권장 — 앞으로의 방향)

1. [네이버 클라우드 플랫폼 콘솔](https://www.ncloud.com)에서 회원가입하거나 로그인
2. 콘솔 화면 우측 상단의 리전 & 플랫폼 선택 버튼을 클릭해 이용 중인 리전과 플랫폼을 선택한 후 **적용** 클릭
3. **Menu > All Services > Application Services > [NAVER API HUB](https://www.ncloud.com/product/applicationService/naverApiHub)** 클릭
4. 좌측의 **Application** 메뉴를 클릭하고 애플리케이션을 선택(또는 생성)한 다음, API 관리 하위의 **인증 정보** 버튼 클릭
5. 팝업 창에 표시된 **Client ID**와 **Client Secret** 복사
6. 아래 설정에서 Client ID는 `NCP_APIGW_API_KEY_ID`로, Client Secret은 `NCP_APIGW_API_KEY`로 사용하세요

### 방법 B: 네이버 개발자센터 (기존 — 기존 키 보유자 전용)

> 네이버 개발자센터는 **2026-07-31**부터 신규 애플리케이션 등록을 받지 않습니다.
> 이 플랫폼의 Client ID/Secret이 아직 없다면 위 NAVER API HUB를 이용하세요.
> 기존에 발급받은 개발자센터 키는 2027-06-30까지 계속 동작합니다.

1. [Naver Developers](https://developers.naver.com/apps/#/register)에 방문하여 네이버 계정으로 로그인
2. "애플리케이션 등록" 버튼 클릭
3. 애플리케이션 정보 입력:
   - **애플리케이션 이름**: 원하는 이름 입력 (예: "Naver Search MCP")
   - **사용 API**: "검색" 선택
4. API 설정에서 다음 API를 **모두 체크**:
   - **검색** - 블로그, 뉴스, 카페글, 웹문서, 이미지, 지식iN, 백과사전, 지역 검색에 필요
   - **데이터랩 - 검색어 트렌드** - 검색어 트렌드 분석에 필요
   - **데이터랩 - 쇼핑인사이트** - 쇼핑 트렌드 분석에 필요
5. "등록하기" 버튼 클릭하여 등록 완료
6. 등록 완료 후 애플리케이션 상세 페이지에서 **Client ID**와 **Client Secret** 확인
7. 아래 설정에서 `NAVER_CLIENT_ID` / `NAVER_CLIENT_SECRET`로 사용하세요

## 설정

### 자격증명

두 플랫폼을 지원합니다. **한 쌍만** 설정하세요. 키 문자열만으로는 어느 플랫폼 키인지
구분할 수 없기 때문에, 어느 환경변수에 넣었는지로 플랫폼을 판단합니다.

| 환경변수 | 플랫폼 | 호출 대상 |
|---|---|---|
| `NCP_APIGW_API_KEY_ID`, `NCP_APIGW_API_KEY` | NAVER API HUB (NCP) | `naverapihub.apigw.ntruss.com` |
| `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET` | 네이버 개발자센터 (기존) | `openapi.naver.com` |

두 쌍을 모두 설정하면 NAVER API HUB를 사용합니다.

아래 설치 예시는 기존 `NAVER_CLIENT_ID` / `NAVER_CLIENT_SECRET` 쌍을 사용합니다.
NAVER API HUB 키를 가지고 있다면 위 표의 HUB 쌍으로 바꿔 넣으세요.

### NAVER API HUB 이관 안내

네이버는 이 API들을 개발자센터에서 네이버 클라우드 플랫폼의 NAVER API HUB로 이관하고 있습니다.

| 날짜 | 내용 |
|---|---|
| 2026-06-25 | NAVER API HUB 출시 |
| 2026-07-31 | 개발자센터 신규 신청 차단 |
| 2027-06-30 | 개발자센터 지원 종료 — 기존 키도 사용 불가 |

기존 키는 2027-06-30까지 그대로 동작합니다. 이관하려면 네이버 클라우드 플랫폼 콘솔에서
NAVER API HUB 키를 발급받아 `NCP_APIGW_API_KEY_ID` / `NCP_APIGW_API_KEY`에 넣으세요.
개발자센터 키는 NAVER API HUB에서 사용할 수 없습니다.

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

이 MCP 서버는 ClawHub skill wrapper를 통해 OpenClaw에서도 사용할 수 있습니다. 다음 명령으로 설치하세요:

```bash
openclaw skills install naver-search-mcp
```

ClawHub skill은 내부적으로 동일한 npm 패키지를 사용합니다:

```bash
npx -y @isnow890/naver-search-mcp
```

사용 전에 OpenClaw 환경에 **한 쌍**의 자격증명을 설정해야 합니다 — NAVER API HUB 쌍(`NCP_APIGW_API_KEY_ID` / `NCP_APIGW_API_KEY`) 또는 개발자센터 쌍(`NAVER_CLIENT_ID` / `NAVER_CLIENT_SECRET`). OpenClaw의 `apiKey`는 `NAVER_CLIENT_SECRET`에 매핑되므로, HUB 사용자는 `apiKey` 대신 두 HUB 변수를 직접 설정하세요.

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

## 필수 요구 사항

- 두 플랫폼 중 하나의 자격증명 — NAVER API HUB 또는 Naver Developers ([API 키 얻기](#api-키-얻기) 참고)
- Node.js 18 이상
- NPM 8 이상

## 라이선스

MIT 라이선스

---

## 버전 히스토리

### 1.0.49 (2026-07-26)

- NAVER API HUB 지원: `NCP_APIGW_API_KEY_ID` / `NCP_APIGW_API_KEY`를 설정하면 새 플랫폼으로 호출합니다. 기존 `NAVER_CLIENT_ID` / `NAVER_CLIENT_SECRET`은 그대로 동작하며, 어느 변수 쌍을 설정했는지로 플랫폼이 결정됩니다
- `search_shop`, `search_book`, `search_academic` **제거**. 네이버가 2026-07-31에 해당 검색 API를 종료하며 어느 플랫폼에도 대체가 없습니다
- API 에러가 raw `AxiosError` 대신 일반 `Error`로 던져집니다. `error.response?.status`로 분기하던 코드는 `undefined`를 보게 되며, 같은 정보는 `Error.message`에 담깁니다
- 에러 메시지에 플랫폼과 HTTP 상태가 표시되고, 401일 때는 키를 다른 플랫폼 변수에 넣지 않았는지 확인하도록 안내합니다

### 1.0.48 (2026-05-12)

- `npx`로 실행될 때 현재 작업 디렉터리가 달라도 `find_category`가 카테고리 데이터를 정상적으로 읽도록 수정
- 카테고리 데이터를 설치된 패키지 위치 기준으로 먼저 찾고, 로컬 개발 경로는 fallback으로 사용하도록 변경

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
