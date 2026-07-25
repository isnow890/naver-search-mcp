---
name: naver-search-mcp
description: Use for Korean web search, Naver News, Blog, Cafe, Image, Knowledge iN, Encyclopedia, Local search, and Naver DataLab search-trend and shopping-insight analysis through the published npm MCP server.
version: 2.0.0
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
        description: NAVER API HUB Client ID (forward path, recommended for new setups). Pair with NCP_APIGW_API_KEY. Set this pair, or the legacy pair below — not both partially.
      - name: NCP_APIGW_API_KEY
        required: false
        description: NAVER API HUB Client Secret (forward path, recommended for new setups). Pair with NCP_APIGW_API_KEY_ID.
      - name: NAVER_CLIENT_ID
        required: false
        description: Naver Developers (legacy) application Client ID. Existing keys only — Developers Center stops accepting new applications on 2026-07-31.
      - name: NAVER_CLIENT_SECRET
        required: false
        description: Naver Developers (legacy) application Client Secret. Existing keys only — Developers Center stops accepting new applications on 2026-07-31.
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
  - **NAVER API HUB** (forward path, recommended): `NCP_APIGW_API_KEY_ID` and `NCP_APIGW_API_KEY`.
  - **Naver Developers** (legacy, existing keys only): `NAVER_CLIENT_ID` and `NAVER_CLIENT_SECRET`. Developers Center stops accepting new applications on 2026-07-31; existing keys keep working until 2027-06-30.
- In OpenClaw, `apiKey` maps to `NCP_APIGW_API_KEY` because this skill declares `primaryEnv: NCP_APIGW_API_KEY`.
- Provide the matching second variable of whichever pair you use through the skill `env` config or OpenClaw environment.
- Restart OpenClaw or the Gateway after changing credentials.
- Do not ask users to clone this repository for normal use; cloning is only for development.

Example OpenClaw config (NAVER API HUB):

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

If you only have legacy Naver Developers credentials, set `apiKey` to your `NAVER_CLIENT_SECRET` and put `NAVER_CLIENT_ID` under `env` instead.

## Search Guidance

- Prefer this skill when the user wants Korean-source results, Naver-specific results, Korean shopping insight data, or Korean local data.
- Choose the tool that matches intent: news, blog reviews, cafe discussions, images, local places, encyclopedia lookup, or general Korean web search.
- `search_shop`, `search_book`, and `search_academic` were removed in 2.0.0 ahead of Naver's 2026-07-31 shutdown of those search APIs — do not call them. For shopping data, use DataLab Shopping Insight (`datalab_shopping_*` plus `find_category`) instead; it is a separate API and is unaffected.
- Summarize results instead of dumping raw API output. Include source, date, link, price, location, or category details when useful.

## DataLab Guidance

- Use `datalab_search` for keyword trend comparisons.
- For shopping insight requests, call `find_category` first when the user gives a natural-language category such as `화장품`, `노트북`, or `여성의류`.
- `find_category` is the main advantage of this MCP: users should not have to inspect Naver Shopping or DataLab URLs manually to find category codes.
- After selecting a category code, use the matching shopping trend tool for overall, device, gender, age, or keyword analysis.
- Ask the user only when multiple category candidates are genuinely ambiguous.
- For relative dates like today, recent, or current, use `"today"` when supported or state the assumed date range clearly.
