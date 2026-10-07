---
name: naver-search-mcp
description: Use for Korean web search, Naver News, Blog, Cafe, Image, Knowledge iN, Encyclopedia, Local search, and Naver DataLab search-trend and shopping-insight analysis through the published npm MCP server.
version: 1.0.54
metadata:
  openclaw:
    requires:
      env:
        - NCP_APIGW_API_KEY_ID
        - NCP_APIGW_API_KEY
        - NAVER_CLIENT_ID
        - NAVER_CLIENT_SECRET
      bins:
        - node
        - npx
    primaryEnv: NCP_APIGW_API_KEY
    envVars:
      - name: NCP_APIGW_API_KEY_ID
        required: false
        description: NAVER API HUB Client ID (NAVER Cloud Platform console > NAVER API HUB). Recommended for all new setups.
      - name: NCP_APIGW_API_KEY
        required: false
        description: NAVER API HUB Client Secret. Recommended for all new setups.
      - name: NAVER_CLIENT_ID
        required: false
        description: Naver Developers Center (legacy) Client ID. Supported for existing key holders until 2027-06-30.
      - name: NAVER_CLIENT_SECRET
        required: false
        description: Naver Developers Center (legacy) Client Secret. Supported for existing key holders until 2027-06-30.
    install:
      - kind: node
        package: "@isnow890/naver-search-mcp"
        bins:
          - naver-search-mcp
    homepage: https://github.com/isnow890/naver-search-mcp
---

# Naver Search MCP

Use this skill for Korean search tasks that are better served by Naver than general web search: news, blogs, cafe posts, images, Knowledge iN, encyclopedia, local places, and DataLab trend analysis (search trends and shopping insight).

한국 웹 검색, 네이버 뉴스/블로그/카페/이미지/지식iN/백과사전/지역 검색, 네이버 DataLab 검색어 트렌드와 쇼핑인사이트 분석에 사용합니다.

github: https://github.com/isnow890/naver-search-mcp

This skill wraps the published MCP server:

```bash
npx -y @isnow890/naver-search-mcp
```

## Setup

- Install from ClawHub with `openclaw skills install naver-search-mcp`.
- Supply **one** credential pair — never a partial mix of the two:
  - **NAVER API HUB** (Recommended / New setups): `NCP_APIGW_API_KEY_ID` and `NCP_APIGW_API_KEY` from NAVER Cloud Platform console.
  - **Naver Developers** (Legacy / Existing keys only): `NAVER_CLIENT_ID` and `NAVER_CLIENT_SECRET` (Supported until 2027-06-30).
- In OpenClaw, `apiKey` maps to `NCP_APIGW_API_KEY`. Set `NCP_APIGW_API_KEY_ID` in the skill `env` configuration.
- Restart OpenClaw or the Gateway after changing credentials.

### Example OpenClaw Config (NAVER API HUB - Recommended)

```json
{
  "skills": {
    "entries": {
      "naver-search-mcp": {
        "enabled": true,
        "apiKey": "your_ncp_apigw_api_key",
        "env": {
          "NCP_APIGW_API_KEY_ID": "your_ncp_apigw_api_key_id"
        }
      }
    }
  }
}
```

### Example OpenClaw Config (Naver Developers - Legacy)

For users with existing Naver Developers keys, specify both variables explicitly in `env`:

```json
{
  "skills": {
    "entries": {
      "naver-search-mcp": {
        "enabled": true,
        "env": {
          "NAVER_CLIENT_ID": "your_naver_client_id",
          "NAVER_CLIENT_SECRET": "your_naver_client_secret"
        }
      }
    }
  }
}
```

## Search Guidance

- Prefer this skill when the user wants Korean-source results, Naver-specific results, Korean shopping insight data, or Korean local data.
- Choose the tool that matches intent: news, blog reviews, cafe discussions, images, local places, encyclopedia lookup, or general Korean web search.
- For shopping data, use DataLab Shopping Insight (`datalab_shopping_*` plus `find_category`).
- Summarize results instead of dumping raw API output. Include source, date, link, price, location, or category details when useful.

## DataLab Guidance

- Use `datalab_search` for keyword trend comparisons.
- For shopping insight requests, call `find_category` first when the user provides a natural-language category name (e.g. `화장품`, `노트북`, `여성의류`).
- `find_category` provides direct category codes so you do not need to look up category URLs manually.
- Date parameters support the `"today"` keyword (e.g. `endDate: "today"`).
