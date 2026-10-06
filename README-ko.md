<p align="center">
  <img src="https://img1.kakaocdn.net/thumb/R0x200a.i/?fname=https%3A%2F%2Ft1.kakaocdn.net%2Fkomi%2Fupload-files%2Fmcp%2Fimages%2FnQzoe8vIxql0oK7Rwi239dxO2iYrxozLLQCIPRpVjmOjwGyPw0ZNUnNJfGkO1kAZmKf16eLZPAYi8NIS8XaBZJ.png" alt="Naver Search MCP Server Logo" width="128" />
</p>

# Naver Search MCP Server

[![npm version](https://img.shields.io/npm/v/@isnow890/naver-search-mcp.svg)](https://www.npmjs.com/package/@isnow890/naver-search-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

네이버 검색 API 및 DataLab(데이터랩) API 연동을 위한 Model Context Protocol(MCP) 서버입니다.  
웹, 뉴스, 블로그, 쇼핑인사이트, 검색어 트렌드 분석 및 자연어 쇼핑 카테고리 검색을 지원합니다.

---

## 빠른 설정 (Quick Start)

Claude Desktop, Cursor, Claude Code, Cline 등 사용하시는 MCP 클라이언트 설정 파일(`claude_desktop_config.json`, `mcp.json` 등)의 `mcpServers`에 아래 설정을 추가하세요.

> **안내:** [Kakao PlayMCP](https://playmcp.kakao.com/mcp/154) 연동 서비스는 지원이 종료되었습니다. 로컬 환경에서 직접 API 키를 설정하여 이용해 주세요.

### 1. NAVER API HUB (권장 / 신규 발급)
네이버 클라우드 플랫폼(NCP)의 [NAVER API HUB](https://www.ncloud.com/product/applicationService/naverApiHub) 키를 사용하는 경우:

```json
{
  "mcpServers": {
    "naver-search": {
      "command": "npx",
      "args": ["-y", "@isnow890/naver-search-mcp"],
      "env": {
        "NCP_APIGW_API_KEY_ID": "your_client_id",
        "NCP_APIGW_API_KEY": "your_client_secret"
      }
    }
  }
}
```

### 2. 네이버 개발자센터 (기존 발급자 전용)
기존 네이버 개발자센터(`openapi.naver.com`) 키를 사용하는 경우 (2027-06-30까지 지원):

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

---

## API 키 발급 안내

사용하시는 환경변수 쌍에 따라 호출 플랫폼이 자동으로 결정됩니다. (둘 중 **한 쌍만** 설정하세요)

| 플랫폼 | 환경변수 | 비고 |
|---|---|---|
| **NAVER API HUB (권장)** | `NCP_APIGW_API_KEY_ID`<br>`NCP_APIGW_API_KEY` | • [네이버 클라우드 플랫폼 콘솔](https://www.ncloud.com) 접속<br>• Menu > All Services > Application Services > **NAVER API HUB** > Application 등록 후 '인증 정보' 확인 |
| **네이버 개발자센터 (기존)** | `NAVER_CLIENT_ID`<br>`NAVER_CLIENT_SECRET` | • 2026-07-31 부로 신규 발급 차단됨<br>• 기존 발급된 키는 2027-06-30까지 정상 동작 |

---

## 제공 도구 (Tools)

### 1. 카테고리 검색
- **`find_category`**: 카테고리 번호를 몰라도 자연어로 검색하여 쇼핑 인사이트용 카테고리 ID를 조회합니다.

### 2. 검색 도구 (Search)
- **`search_webkr`**: 웹 문서 검색
- **`search_news`**: 뉴스 검색
- **`search_blog`**: 블로그 검색
- **`search_cafearticle`**: 카페 글 검색
- **`search_image`**: 이미지 검색
- **`search_kin`**: 지식iN 검색
- **`search_encyc`**: 백과사전 검색
- **`search_local`**: 지역 장소 검색

### 3. 데이터랩 트렌드 분석 (DataLab)
날짜 파라미터에 `"today"` 키워드를 지원합니다 (예: `endDate: "today"`).
- **`datalab_search`**: 검색어 트렌드 분석
- **`datalab_shopping_category`**: 쇼핑 카테고리별 클릭 트렌드
- **`datalab_shopping_by_device`**: 기기별(PC/모바일) 쇼핑 트렌드
- **`datalab_shopping_by_gender`**: 성별 쇼핑 트렌드
- **`datalab_shopping_by_age`**: 연령대별 쇼핑 트렌드
- **`datalab_shopping_keywords`**: 쇼핑 키워드 트렌드
- **`datalab_shopping_keyword_by_device`**: 키워드 기기별 트렌드
- **`datalab_shopping_keyword_by_gender`**: 키워드 성별 트렌드
- **`datalab_shopping_keyword_by_age`**: 키워드 연령별 트렌드

---

## License
MIT License
