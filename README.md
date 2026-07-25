# Naver Search MCP Server

[![한국어](https://img.shields.io/badge/한국어-README-yellow)](README-ko.md)

[![Trust Score](https://archestra.ai/mcp-catalog/api/badge/quality/isnow890/naver-search-mcp)](https://archestra.ai/mcp-catalog/isnow890__naver-search-mcp)
[![MCP.so](https://img.shields.io/badge/MCP.so-Naver%20Search%20MCP-blue)](https://mcp.so/server/naver-search-mcp/isnow890)

MCP server for Naver Search API and DataLab API integration, enabling comprehensive search across various Naver services and data trend analysis.

## Available on ClawHub for OpenClaw

You can install this MCP server as an OpenClaw skill from ClawHub:

```bash
openclaw skills install naver-search-mcp
```

The ClawHub skill uses the published npm package internally and requires `NAVER_CLIENT_ID` and `NAVER_CLIENT_SECRET` in your OpenClaw environment.

## Quick Start: Use Without API Key

You can use this server immediately without API keys through [Kakao PlayMCP](https://playmcp.kakao.com/mcp/154). Simply visit the link and start using it right away!

## Tool Details

### Available tools:

#### 🆕 Category Search

- **find_category**: Category search tool so you no longer need to manually check category numbers in URLs for trend and shopping insight searches. Just describe the category in natural language.

#### Search Tools

- **search_webkr**: Search Naver web documents
- **search_news**: Search Naver news
- **search_blog**: Search Naver blogs
- **search_cafearticle**: Search Naver cafe articles
- **search_image**: Search Naver images
- **search_kin**: Search Naver KnowledgeiN
- **search_encyc**: Search Naver encyclopedia
- **search_local**: Search Naver local places

> **Removed in 2.0.0:** `search_shop`, `search_book`, `search_academic`.
> Naver shut down the Shopping / Book / Academic search APIs on 2026-07-31 with
> no replacement on any platform. This is not a limitation of this server.
> Shopping **Insight** (`datalab_shopping_*`) is a different API and is unaffected.

#### DataLab Tools

- **datalab_search**: Analyze search term trends
- **datalab_shopping_category**: Analyze shopping category trends
- **datalab_shopping_by_device**: Analyze shopping trends by device
- **datalab_shopping_by_gender**: Analyze shopping trends by gender
- **datalab_shopping_by_age**: Analyze shopping trends by age group
- **datalab_shopping_keywords**: Analyze shopping keyword trends
- **datalab_shopping_keyword_by_device**: Analyze shopping keyword trends by device
- **datalab_shopping_keyword_by_gender**: Analyze shopping keyword trends by gender
- **datalab_shopping_keyword_by_age**: Analyze shopping keyword trends by age group

## Getting API Keys

1. Visit [Naver Developers](https://developers.naver.com/apps/#/register) and log in with your Naver account
2. Click the "Application Registration" (애플리케이션 등록) button
3. Fill in the application information:
   - **Application Name**: Enter any name (e.g., "Naver Search MCP")
   - **Usage**: Select "Search" (검색)
4. In the API Settings section, check ALL of the following APIs:
   - **Search** (검색) - Required for blog, news, book, cafe article, web, image, kin, encyclopedia, academic, and local search
   - **DataLab - Search Trends** (데이터랩 - 검색어 트렌드) - Required for search term trend analysis
   - **DataLab - Shopping Insight** (데이터랩 - 쇼핑인사이트) - Required for shopping trend analysis
5. Click "Register" to complete registration
6. After registration, you'll see your **Client ID** and **Client Secret** on the application detail page
7. Use these credentials in the configuration below

## Configuration

### Credentials

Two platforms are supported. Set **one** pair — the server picks the platform from
which variables you set, since the key strings themselves are indistinguishable.

| Variables | Platform | Endpoint |
|---|---|---|
| `NCP_APIGW_API_KEY_ID`, `NCP_APIGW_API_KEY` | NAVER API HUB (NCP) | `naverapihub.apigw.ntruss.com` |
| `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET` | Naver Developers (legacy) | `openapi.naver.com` |

If both pairs are set, NAVER API HUB wins.

The installation examples below use the legacy `NAVER_CLIENT_ID` / `NAVER_CLIENT_SECRET`
pair; swap in the HUB pair from the table above if that's what you have.

### Migration to NAVER API HUB

Naver is moving these APIs from the Developers Center to NAVER API HUB on NAVER Cloud Platform.

| Date | What happens |
|---|---|
| 2026-06-25 | NAVER API HUB launched |
| 2026-07-31 | Developers Center stops accepting new applications |
| 2027-06-30 | Developers Center support ends — existing keys stop working |

Existing keys keep working until 2027-06-30. To migrate, get a key from the
NAVER Cloud Platform console and set `NCP_APIGW_API_KEY_ID` / `NCP_APIGW_API_KEY`.
Developers Center keys cannot be used against NAVER API HUB.

## Installation

### Method 1: NPX Installation (Recommended)

The most reliable way to use this MCP server is through NPX. For detailed package information, see the [NPM package page](https://www.npmjs.com/package/@isnow890/naver-search-mcp).

#### Claude Desktop Configuration

Add to Claude Desktop config file (`%APPDATA%\Claude\claude_desktop_config.json` on Windows, `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS/Linux):

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

#### Claude Code Configuration

Add to your Claude Code settings:

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

### Method 2: ClawHub Installation for OpenClaw

This MCP server can also be used from OpenClaw through the ClawHub skill wrapper. Install it with:

```bash
openclaw skills install naver-search-mcp
```

The ClawHub skill uses the same published npm package internally:

```bash
npx -y @isnow890/naver-search-mcp
```

Make sure `NAVER_CLIENT_ID` and `NAVER_CLIENT_SECRET` are configured in your OpenClaw environment before using the skill.

### Method 3: Local Installation

For local development or custom modifications:

#### Step 1: Download and Build Source Code

##### Clone with Git

```bash
git clone https://github.com/isnow890/naver-search-mcp.git
cd naver-search-mcp
npm install
npm run build
```

##### Or Download ZIP File

1. Download the latest version from [GitHub Releases](https://github.com/isnow890/naver-search-mcp)
2. Extract the ZIP file to your desired location
3. Navigate to the extracted folder in terminal:

```bash
cd /path/to/naver-search-mcp
npm install
npm run build
```

⚠️ **Important**: You must run `npm run build` after installation to generate the `dist` folder that contains the compiled JavaScript files.

#### Step 2: Claude Desktop Configuration

After building, you'll need the following information:

- **NAVER_CLIENT_ID**: Client ID from Naver Developers
- **NAVER_CLIENT_SECRET**: Client Secret from Naver Developers
- **Installation Path**: Absolute path to the downloaded folder

##### Windows Configuration

Add to Claude Desktop config file (`%APPDATA%\Claude\claude_desktop_config.json`):

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

##### macOS/Linux Configuration

Add to Claude Desktop config file (`~/Library/Application Support/Claude/claude_desktop_config.json`):

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

##### Path Configuration Important Notes

⚠️ **Important**: You must change the following paths in the above configuration to your actual installation paths:

- **Windows**: Change `C:\\path\\to\\naver-search-mcp` to your actual downloaded folder path
- **macOS/Linux**: Change `/path/to/naver-search-mcp` to your actual downloaded folder path
- **Build Path**: Make sure the path points to `dist/src/index.js` (not just `index.js`)

Finding your path:

```bash
# Check current location
pwd

# Absolute path examples
# Windows: C:\Users\username\Downloads\naver-search-mcp
# macOS: /Users/username/Downloads/naver-search-mcp
# Linux: /home/username/Downloads/naver-search-mcp
```

#### Step 3: Restart Claude Desktop

After completing the configuration, completely close and restart Claude Desktop to activate the Naver Search MCP server.

## Prerequisites

- Naver Developers API Key (Client ID and Secret)
- Node.js 18 or higher
- NPM 8 or higher

## License

MIT License

---

## Version History

### 1.0.48 (2026-05-12)

- Fixed `find_category` data loading when the MCP server is launched by `npx` from a different working directory
- Category data is now resolved relative to the installed package before falling back to local development paths

### 1.0.47 (2025-01-03)

- **Added "today" keyword support** for all DataLab date parameters - no need to call separate time tool
- **Fixed server termination issue** - MCP server now properly exits when client disconnects
- **Added graceful shutdown handlers** for SIGINT, SIGTERM, and transport close events
- **Removed get_current_korean_time tool** - redundant with new "today" keyword feature
- **Removed memory monitoring module** - resolved setInterval blocking process exit
- **Special thanks to @gloomyrobot** for reporting the server termination issue

### 1.0.45 (2025-09-28)

- Resolved platform compatibility issues for hosted MCP installations
- Replaced the Excel export in category search with JSON for better compatibility
- Restored the `search_webkr` tool for Korean web search
- Improved hosted platform installation compatibility

### 1.0.44 (2025-08-31)

- Added the `get_current_korean_time` tool for essential Korea Standard Time context
- Referenced the time tool across existing tool descriptions for temporal queries
- Improved handling of "today", "now", and "current" searches with temporal context
- Expanded Korean date and time formatting outputs with multiple formats

### 1.0.40 (2025-08-21)

- Added the `find_category` tool with fuzzy matching so you no longer need to check category numbers manually in URLs
- Enhanced parameter validation with Zod schema
- Improved the category search workflow
- Implemented a level-based category ranking system that prioritizes top-level categories

### 1.0.30 (2025-08-04)

- MCP SDK upgraded to 1.17.1
- Fixed compatibility issues with hosted MCP platform specification changes
- Added comprehensive DataLab shopping category code documentation

### 1.0.2 (2025-04-26)

- README updated: cafe article search tool and version history section improved

### 1.0.1 (2025-04-26)

- Cafe article search feature added
- Shopping category info added to zod
- Source code refactored

### 1.0.0 (2025-04-08)

- Initial release
