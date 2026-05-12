---
name: naver-search-mcp
description: Use for Korean web search, Naver News, Blog, Cafe, Shopping, Image, Knowledge iN, Local search, and Naver DataLab trend analysis through the published npm MCP server.
version: 1.0.2
metadata:
  openclaw:
    requires:
      env:
        - NAVER_CLIENT_ID
        - NAVER_CLIENT_SECRET
      bins:
        - node
        - npx
    primaryEnv: NAVER_CLIENT_SECRET
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

Use this skill for Korean search tasks that are better served by Naver than general web search: news, blogs, cafe posts, shopping, images, Knowledge iN, books, encyclopedia, academic content, local places, and DataLab trend analysis.

한국 웹 검색, 네이버 뉴스/블로그/카페/쇼핑/이미지/지식iN/지역 검색, 네이버 DataLab 검색어 트렌드와 쇼핑인사이트 분석에 사용합니다.

github: https://github.com/isnow890/naver-search-mcp

This skill wraps the published MCP server:

```bash
npx -y @isnow890/naver-search-mcp
```

## Setup

- Install from ClawHub with `openclaw skills install naver-search-mcp`.
- Requires `NAVER_CLIENT_ID` and `NAVER_CLIENT_SECRET` from Naver Developers.
- In OpenClaw, `apiKey` maps to `NAVER_CLIENT_SECRET` because this skill declares `primaryEnv: NAVER_CLIENT_SECRET`.
- Provide `NAVER_CLIENT_ID` through the skill `env` config or OpenClaw environment.
- Restart OpenClaw or the Gateway after changing credentials.
- Do not ask users to clone this repository for normal use; cloning is only for development.

Example OpenClaw config:

```json
{
  "skills": {
    "entries": {
      "naver-search-mcp": {
        "enabled": true,
        "apiKey": "your_naver_client_secret",
        "env": {
          "NAVER_CLIENT_ID": "your_naver_client_id"
        }
      }
    }
  }
}
```

## Search Guidance

- Prefer this skill when the user wants Korean-source results, Naver-specific results, Korean shopping data, or Korean local data.
- Choose the tool that matches intent: news, blog reviews, cafe discussions, shopping, images, local places, academic/book/encyclopedia lookup, or general Korean web search.
- Summarize results instead of dumping raw API output. Include source, date, link, price, location, or category details when useful.

## DataLab Guidance

- Use `datalab_search` for keyword trend comparisons.
- For shopping insight requests, call `find_category` first when the user gives a natural-language category such as `화장품`, `노트북`, or `여성의류`.
- `find_category` is the main advantage of this MCP: users should not have to inspect Naver Shopping or DataLab URLs manually to find category codes.
- After selecting a category code, use the matching shopping trend tool for overall, device, gender, age, or keyword analysis.
- Ask the user only when multiple category candidates are genuinely ambiguous.
- For relative dates like today, recent, or current, use `"today"` when supported or state the assumed date range clearly.
