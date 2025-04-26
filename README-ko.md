# Naver Search MCP Server

[![English](https://img.shields.io/badge/English-README-yellow)](README.md)
[![smithery badge](https://smithery.ai/badge/@isnow890/naver-search-mcp)](https://smithery.ai/server/@isnow890/naver-search-mcp)
[![MCP.so](https://img.shields.io/badge/MCP.so-Naver%20Search%20MCP-blue)](https://mcp.so/server/naver-search-mcp/isnow890)

Naver 검색 API와 DataLab API 통합을 위한 MCP 서버로, 다양한 Naver 서비스에서의 종합적인 검색과 데이터 트렌드 분석을 가능하게 합니다.

#### 버전 히스토리

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
- Node.js 18 이상
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
- **datalab_search**: 검색어 트렌드 분석
- **datalab_shopping_category**: 쇼핑 카테고리 트렌드 분석
- **datalab_shopping_by_device**: 기기별 쇼핑 트렌드 분석
- **datalab_shopping_by_gender**: 성별 쇼핑 트렌드 분석
- **datalab_shopping_by_age**: 연령대별 쇼핑 트렌드 분석
- **datalab_shopping_keywords**: 쇼핑 키워드 트렌드 분석
- **datalab_shopping_keyword_by_device**: 쇼핑 키워드 기기별 트렌드 분석
- **datalab_shopping_keyword_by_gender**: 쇼핑 키워드 성별 트렌드 분석
- **datalab_shopping_keyword_by_age**: 쇼핑 키워드 연령별 트렌드 분석

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
