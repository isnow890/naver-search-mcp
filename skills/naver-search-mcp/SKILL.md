---
name: naver-search-mcp
description: OpenClaw에서 네이버 검색 API와 DataLab 트렌드 분석을 사용할 수 있게 해주는 Naver Search MCP skill. Runs the published npm package.
version: 1.0.0
metadata:
  openclaw:
    requires:
      env:
        - NAVER_CLIENT_ID
        - NAVER_CLIENT_SECRET
      bins:
        - node
        - npx
    primaryEnv: NAVER_CLIENT_ID
    envVars:
      - name: NAVER_CLIENT_ID
        required: true
        description: Naver Developers application Client ID.
      - name: NAVER_CLIENT_SECRET
        required: true
        description: Naver Developers application Client Secret.
    install:
      - kind: node
        package: "@isnow890/naver-search-mcp"
        bins:
          - naver-search-mcp
    homepage: https://github.com/isnow890/naver-search-mcp
---

# Naver Search MCP

네이버 검색 API와 DataLab API를 OpenClaw에서 사용할 수 있게 해주는 MCP skill입니다. 한국 웹문서, 뉴스, 블로그, 카페글, 쇼핑, 이미지, 지식iN, 도서, 백과사전, 학술자료, 지역 검색이 필요하거나 네이버 DataLab 트렌드 분석이 필요할 때 사용하세요.

Use this skill when the user needs Korean web search, Naver News, Blog, Cafe, Shopping, Image, Knowledge iN, Book, Encyclopedia, Academic, Local search, or Naver DataLab trend analysis.

github : https://github.com/isnow890/naver-search-mcp

이 skill은 MCP 서버 소스 코드를 포함하지 않습니다. 이미 npm에 배포된 패키지를 실행합니다:

This skill does not bundle the MCP server source. It runs the published npm package:

```bash
npx -y @isnow890/naver-search-mcp
```

## 특징

- 네이버 검색 API의 주요 검색 범위를 MCP 도구로 제공합니다: 웹문서, 뉴스, 블로그, 카페글, 쇼핑, 이미지, 지식iN, 도서, 백과사전, 학술자료, 지역 검색.
- 네이버 DataLab 검색어 트렌드 분석을 지원합니다.
- 네이버 DataLab 쇼핑인사이트를 지원합니다: 카테고리 트렌드, 기기별, 성별, 연령대별, 키워드별 쇼핑 트렌드 분석.
- 쇼핑인사이트에 필요한 카테고리 코드를 직접 URL에서 찾지 않아도 됩니다. 기존에는 네이버 쇼핑/데이터랩 화면에서 카테고리를 찾아 URL이나 요청값에서 코드를 확인해야 했지만, `find_category`를 쓰면 `화장품`, `노트북`, `여성의류`처럼 한국어 자연어로 검색해 바로 후보 카테고리와 코드를 찾을 수 있습니다.
- `find_category`는 쇼핑 트렌드 분석의 첫 단계로 쓰기 좋습니다. 사용자가 카테고리명을 말하면 먼저 카테고리 코드를 찾고, 이어서 DataLab 쇼핑인사이트 도구로 기간별/기기별/성별/연령대별 트렌드를 분석하세요.
- `today` 날짜 키워드를 지원해 최신 DataLab 조회에서 별도 시간 도구 호출을 줄일 수 있습니다.

- Covers the main Naver Search API surfaces: web documents, news, blogs, cafe articles, shopping, images, Knowledge iN, books, encyclopedia, academic content, and local places.
- Supports Naver DataLab search trend analysis.
- Supports Naver DataLab Shopping Insight: category, device, gender, age, and keyword shopping trends.
- Provides `find_category` so users do not have to inspect Naver Shopping or DataLab URLs manually to find category codes. They can search categories in Korean natural language, such as `화장품`, `노트북`, or `여성의류`, and get candidate category codes.
- Use `find_category` as the first step for shopping trend analysis, then pass the selected category code into DataLab Shopping Insight tools.
- Supports the `today` date keyword for DataLab queries.

## Requirements / 요구 사항

- Node.js 18 or newer
- `npx`
- `NAVER_CLIENT_ID`
- `NAVER_CLIENT_SECRET`

`NAVER_CLIENT_ID`와 `NAVER_CLIENT_SECRET`은 Naver Developers에서 발급받아야 합니다.

Get credentials from Naver Developers:

1. Open https://developers.naver.com/apps/#/register and sign in.
2. Register an application.
3. Enable Search, DataLab Search Trends, and DataLab Shopping Insight.
4. Copy the Client ID and Client Secret into the MCP environment.

한국어 절차:

1. https://developers.naver.com/apps/#/register 에 접속해 네이버 계정으로 로그인합니다.
2. 애플리케이션을 등록합니다.
3. 사용 API에서 검색, 데이터랩 검색어 트렌드, 데이터랩 쇼핑인사이트를 활성화합니다.
4. 발급된 Client ID와 Client Secret을 OpenClaw 또는 MCP 클라이언트 환경변수에 설정합니다.

## MCP Configuration / MCP 설정

MCP 서버를 지원하는 클라이언트에서는 다음 stdio 설정을 사용하세요.

Use this stdio server configuration in clients that support MCP servers:

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

## Agent Usage Guidance / 에이전트 사용 가이드

사용자가 한국 웹 검색, 네이버 검색 결과, 한국 뉴스, 상품 가격, 쇼핑 트렌드, 키워드 트렌드, 지역 장소, 카테고리별 쇼핑 인사이트를 요청하면 이 MCP 서버의 도구를 우선 사용하세요.

When the user asks for Korean web results, Naver results, Korean news, product prices, shopping trends, keyword trends, local places, or category-level shopping insight, prefer this MCP server's tools.

- 일반 검색은 의도에 맞는 검색 도구를 직접 선택합니다. 예: 뉴스는 `search_news`, 블로그 후기는 `search_blog`, 상품/가격 비교는 `search_shop`, 지역 장소는 `search_local`.
- 검색어 트렌드는 `datalab_search`를 사용합니다.
- 쇼핑 카테고리 트렌드는 먼저 `find_category`로 카테고리 코드를 찾고, 그 다음 `datalab_shopping_category` 또는 기기/성별/연령대별 쇼핑 도구를 사용합니다. 사용자가 정확한 카테고리 코드를 모르는 것은 정상적인 상황이므로 직접 코드 확인을 요구하지 마세요.
- 쇼핑 키워드 트렌드는 카테고리 코드가 필요하면 먼저 `find_category`를 사용한 뒤 `datalab_shopping_keywords` 또는 키워드 기기/성별/연령대별 도구를 사용합니다.
- 사용자가 “오늘”, “최근”, “현재”처럼 상대 날짜를 말하면 DataLab 날짜 파라미터에 `"today"`를 사용할 수 있습니다. 기간 비교가 필요하면 명확한 날짜 범위를 사용자에게 확인하거나 합리적인 범위를 설명하세요.
- 결과는 네이버 API 응답을 그대로 나열하기보다 사용자의 질문에 맞게 요약하고, 필요한 경우 출처명, 날짜, 링크, 가격, 카테고리 코드를 함께 제시하세요.

- For general search, choose the tool that matches intent: `search_news` for news, `search_blog` for reviews, `search_shop` for products and prices, and `search_local` for places.
- Use `datalab_search` for search keyword trends.
- For shopping category trends, call `find_category` first, then use `datalab_shopping_category` or the device/gender/age shopping trend tools. Do not ask users to manually provide category codes unless they already have one.
- For shopping keyword trends, use `find_category` first when a category code is needed, then call `datalab_shopping_keywords` or the keyword device/gender/age tools.
- For relative dates like today, recent, or current, DataLab date parameters can use `"today"`. If a comparison period is required, clarify the date range or state the assumed range.
- Summarize results for the user's question instead of dumping raw API output; include source names, dates, links, prices, or category codes when useful.

## Tool Coverage / 지원 도구

Search tools / 검색 도구:

- `search_webkr`: 네이버 웹문서 검색. 한국 웹사이트의 일반 문서와 정보를 찾을 때 사용합니다.
- `search_news`: 네이버 뉴스 검색. 최신 한국 뉴스, 시사 이슈, 사건/정책/경제 뉴스를 찾을 때 사용합니다.
- `search_blog`: 네이버 블로그 검색. 후기, 리뷰, 개인 경험, 튜토리얼성 글을 찾을 때 사용합니다.
- `search_cafearticle`: 네이버 카페글 검색. 커뮤니티 글, 사용자 토론, 관심사 기반 게시글을 찾을 때 사용합니다.
- `search_shop`: 네이버 쇼핑 검색. 상품, 가격, 판매처, 쇼핑 비교 정보를 찾을 때 사용합니다.
- `search_image`: 네이버 이미지 검색. 이미지, 사진, 시각 자료를 찾을 때 사용합니다.
- `search_kin`: 네이버 지식iN 검색. 질문/답변, 문제 해결, 생활 정보성 답변을 찾을 때 사용합니다.
- `search_book`: 네이버 책 검색. 도서, 저자, 출판 정보, 책 관련 자료를 찾을 때 사용합니다.
- `search_encyc`: 네이버 지식백과 검색. 개념, 정의, 백과사전식 설명을 찾을 때 사용합니다.
- `search_academic`: 네이버 전문자료 검색. 논문, 학술자료, 연구 문서를 찾을 때 사용합니다.
- `search_local`: 네이버 지역 검색. 장소, 업체, 주소, 지역 기반 정보를 찾을 때 사용합니다.

DataLab tools / DataLab 도구:

- `datalab_search`: 검색어 트렌드 분석. 여러 검색어의 기간별 관심도 변화를 비교할 때 사용합니다.
- `datalab_shopping_category`: 쇼핑 카테고리 트렌드 분석. 특정 쇼핑 카테고리의 기간별 관심도 변화를 볼 때 사용합니다.
- `datalab_shopping_by_device`: 쇼핑 카테고리 트렌드를 PC/모바일 등 기기별로 나눠 분석합니다.
- `datalab_shopping_by_gender`: 쇼핑 카테고리 트렌드를 성별로 나눠 분석합니다.
- `datalab_shopping_by_age`: 쇼핑 카테고리 트렌드를 연령대별로 나눠 분석합니다.
- `datalab_shopping_keywords`: 특정 쇼핑 카테고리 안에서 키워드별 트렌드를 분석합니다.
- `datalab_shopping_keyword_by_device`: 쇼핑 키워드 트렌드를 기기별로 나눠 분석합니다.
- `datalab_shopping_keyword_by_gender`: 쇼핑 키워드 트렌드를 성별로 나눠 분석합니다.
- `datalab_shopping_keyword_by_age`: 쇼핑 키워드 트렌드를 연령대별로 나눠 분석합니다.

Category helper / 카테고리 검색:

- `find_category`: DataLab 쇼핑인사이트에 필요한 네이버 쇼핑 카테고리 코드를 자연어 한국어 검색으로 찾습니다. 사용자가 직접 네이버 쇼핑 URL이나 데이터랩 화면에서 카테고리 번호를 찾아야 하는 번거로움을 줄여주는 핵심 도구입니다. 예: `화장품`, `노트북`, `여성의류`.

DataLab 쇼핑 분석에서 사용자가 자연어로 카테고리를 말하면 먼저 `find_category`로 카테고리 코드를 찾으세요. 여러 후보가 나오면 가장 적합한 후보를 선택하거나, 애매할 때만 사용자에게 확인하세요.

For DataLab shopping queries, use `find_category` first when the user gives a natural-language shopping category. If multiple candidates are returned, pick the best fit or ask only when the category is ambiguous.
