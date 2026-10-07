<p align="center">
  <img src="https://img1.kakaocdn.net/thumb/R0x200a.i/?fname=https%3A%2F%2Ft1.kakaocdn.net%2Fkomi%2Fupload-files%2Fmcp%2Fimages%2FnQzoe8vIxql0oK7Rwi239dxO2iYrxozLLQCIPRpVjmOjwGyPw0ZNUnNJfGkO1kAZmKf16eLZPAYi8NIS8XaBZJ.png" alt="Naver Search MCP Server Logo" width="128" />
</p>

# Naver Search MCP Server

[![npm version](https://img.shields.io/npm/v/@isnow890/naver-search-mcp.svg)](https://www.npmjs.com/package/@isnow890/naver-search-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Model Context Protocol (MCP) server for Naver Search and DataLab APIs.  
Supports web/news/blog searches, shopping insights, keyword trend analysis, and natural language shopping category lookups.

* [한국어 문서 (README.md)](README.md)

---

## Quick Start

Add the following to your MCP client configuration file (e.g., `claude_desktop_config.json`, `mcp.json`) in tools like Claude Desktop, Cursor, Claude Code, or Cline:

> **Notice:** The zero-setup [Kakao PlayMCP](https://playmcp.kakao.com/mcp/154) service has been discontinued. Please provide your own API credentials in your local environment.

### 1. NAVER API HUB (Recommended / New Users)
Using keys issued from [NAVER API HUB](https://www.ncloud.com/product/applicationService/naverApiHub) on NAVER Cloud Platform (NCP):

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

### 2. Naver Developers Center (Existing Key Holders)
Using legacy keys issued from the Naver Developers Center (`openapi.naver.com`) (Supported until 2027-06-30):

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

### 3. OpenClaw (ClawHub)
If you use OpenClaw, you can install it as a ClawHub skill:

```bash
openclaw skills install naver-search-mcp
```

> **Note:** Configure **one** credential pair in your OpenClaw environment — either the NAVER API HUB pair (`NCP_APIGW_API_KEY_ID` / `NCP_APIGW_API_KEY`) or the Developers Center pair (`NAVER_CLIENT_ID` / `NAVER_CLIENT_SECRET`).

---

## API Credentials Guide

The server automatically detects the target platform based on the environment variables provided. (Set **one pair only**):

| Platform | Environment Variables | Note |
|---|---|---|
| **NAVER API HUB (Recommended)** | `NCP_APIGW_API_KEY_ID`<br>`NCP_APIGW_API_KEY` | • Visit [NAVER Cloud Platform Console](https://www.ncloud.com)<br>• Go to Menu > All Services > Application Services > **NAVER API HUB**<br>• Register Application and check 'Authentication Info' |
| **Naver Developers (Legacy)** | `NAVER_CLIENT_ID`<br>`NAVER_CLIENT_SECRET` | • New applications closed as of 2026-07-31<br>• Existing keys continue to work until 2027-06-30 |

---

## Available Tools

### 1. Category Search
- **`find_category`**: Search shopping categories in natural language to find category IDs for shopping insight queries.

### 2. Search Tools
- **`search_webkr`**: Search Naver web documents
- **`search_news`**: Search Naver news
- **`search_blog`**: Search Naver blogs
- **`search_cafearticle`**: Search Naver cafe posts
- **`search_image`**: Search Naver images
- **`search_kin`**: Search KnowledgeiN (Q&A)
- **`search_encyc`**: Search encyclopedia entries
- **`search_local`**: Search local places

### 3. DataLab Trend Analysis
Supports the `"today"` keyword for date parameters (e.g., `endDate: "today"`).
- **`datalab_search`**: Analyze search term trends
- **`datalab_shopping_category`**: Analyze shopping category click trends
- **`datalab_shopping_by_device`**: Analyze shopping trends by device (PC/Mobile)
- **`datalab_shopping_by_gender`**: Analyze shopping trends by gender
- **`datalab_shopping_by_age`**: Analyze shopping trends by age group
- **`datalab_shopping_keywords`**: Analyze shopping keyword trends
- **`datalab_shopping_keyword_by_device`**: Analyze keyword trends by device
- **`datalab_shopping_keyword_by_gender`**: Analyze keyword trends by gender
- **`datalab_shopping_keyword_by_age`**: Analyze keyword trends by age group

---

## License
MIT License
