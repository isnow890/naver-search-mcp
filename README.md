# Naver Search MCP Server

[![한국어](https://img.shields.io/badge/한국어-README-yellow)](README-ko.md)

[![Trust Score](https://archestra.ai/mcp-catalog/api/badge/quality/isnow890/naver-search-mcp)](https://archestra.ai/mcp-catalog/isnow890__naver-search-mcp)
[![smithery badge](https://smithery.ai/badge/@isnow890/naver-search-mcp)](https://smithery.ai/server/@isnow890/naver-search-mcp)
[![MCP.so](https://img.shields.io/badge/MCP.so-Naver%20Search%20MCP-blue)](https://mcp.so/server/naver-search-mcp/isnow890)

MCP server for Naver Search API and DataLab API integration, enabling comprehensive search across various Naver services and data trend analysis.

#### Version History

###### 1.0.4 (2025-08-21)

- Migration to Fast MCP 3.1.1 architecture (simplified codebase)
- Added `find_category` tool with fuzzy matching and ranking system
- Enhanced parameter validation using Zod schemas
- Improved category search workflow
- Implemented level-based category ranking system (대분류 priority)
- Added dynamic Excel file detection

###### 1.0.30 (2025-08-04)

- MCP SDK upgraded to 1.17.1
- Fixed compatibility issues with Smithery specification changes
- Added comprehensive DataLab shopping category code documentation

###### 1.0.2 (2025-04-26)

- README updated: cafe article search tool and version history section improved

###### 1.0.1 (2025-04-26)

- Cafe article search feature added
- Shopping category info added to zod
- Source code refactored

###### 1.0.0 (2025-04-08)

- Initial release

#### Information

**If you want to install the MCP via npm, do NOT use @mseep/server-naver-search (https://www.npmjs.com/package/@mseep/server-naver-search). That package is a copy of my work and was published without my permission. The npx version of that package is also broken and will not work properly. Please use this official package instead.**

#### Prerequisites

- Naver Developers API Key (Client ID and Secret)
- Node.js 22 or higher
- NPM 8 or higher
- Docker (optional, for container deployment)

#### Getting API Keys

1. Visit [Naver Developers](https://developers.naver.com/apps/#/register)
2. Click "Register Application"
3. Enter application name and select ALL of the following APIs:
   - Search (for blog, news, book search, etc.)
   - DataLab (Search Trends)
   - DataLab (Shopping Insight)
4. Set the obtained Client ID and Client Secret as environment variables

## Tool Details

### Available tools:

#### 🆕 Smart Category Search
- **find_category**: Category search tool with fuzzy matching and ranking system for efficient category discovery

#### Search Tools
- **search_webkr**: Search Naver web documents
- **search_news**: Search Naver news
- **search_blog**: Search Naver blogs
- **search_cafearticle**: Search Naver cafe articles
- **search_shop**: Search Naver shopping
- **search_image**: Search Naver images
- **search_kin**: Search Naver KnowledgeiN
- **search_book**: Search Naver books
- **search_encyc**: Search Naver encyclopedia
- **search_academic**: Search Naver academic papers
- **search_local**: Search Naver local places

#### DataLab Shopping Intelligence 📊
- **datalab_search**: Analyze search term trends
- **datalab_shopping_category**: Analyze shopping category trends
- **datalab_shopping_device**: Analyze shopping trends by device (PC vs Mobile)
- **datalab_shopping_gender**: Analyze shopping trends by gender
- **datalab_shopping_age**: Analyze shopping trends by age group (10s-60s+)
- **datalab_shopping_keywords**: Compare keyword performance within categories
- **datalab_shopping_keyword_device**: Analyze keyword trends by device
- **datalab_shopping_keyword_gender**: Analyze keyword trends by gender
- **datalab_shopping_keyword_age**: Analyze keyword trends by age group

## 🚀 Smart Category Search & Shopping Intelligence

### Improved Workflow

**Before v1.0.4** (Complex, Manual):
```
1. Visit Naver Shopping website
2. Browse categories manually
3. Extract 8-digit codes from URLs
4. Remember or document codes
5. Use codes in DataLab tools
```

**After v1.0.4** (Simple, Efficient):
```
1. Use find_category("fashion") 
2. Get ranked results
3. Direct path to trend analysis
```

### 🎯 Business Use Cases & Scenarios

#### 🛍️ E-commerce Market Research
```javascript
// Discover fashion trends
find_category("패션") → Get top fashion categories with codes
datalab_shopping_category → Analyze seasonal fashion trends
datalab_shopping_age → Target age demographics for fashion
datalab_shopping_keywords → Compare "원피스" vs "자켓" vs "드레스"
```

#### 📱 Digital Marketing Strategy
```javascript
// Beauty industry analysis
find_category("화장품") → Find beauty categories
datalab_shopping_gender → 95% female vs 5% male shoppers
datalab_shopping_device → Mobile dominance in beauty shopping
datalab_shopping_keywords → "틴트" vs "립스틱" keyword performance
```

#### 🏢 Business Intelligence & Competitive Analysis
```javascript
// Tech product insights
find_category("스마트폰") → Get electronics categories
datalab_shopping_category → Track iPhone vs Galaxy trends
datalab_shopping_age → 20s-30s are primary smartphone buyers
datalab_shopping_device → PC vs Mobile shopping behavior
```

#### 📊 Seasonal Business Planning
```javascript
// Holiday shopping analysis
find_category("선물") → Gift categories
datalab_shopping_category → Black Friday, Christmas trends
datalab_shopping_keywords → "어버이날 선물" vs "생일선물"
datalab_shopping_age → Gift-giving patterns by age group
```

#### 🎯 Customer Persona Development
```javascript
// Fitness market analysis
find_category("운동") → Sports/fitness categories  
datalab_shopping_gender → Male vs female fitness spending
datalab_shopping_age → Peak fitness demographics (20s-40s)
datalab_shopping_keywords → "홈트" vs "헬스장" trend analysis
```

### 📈 Advanced Analytics Scenarios

#### Market Entry Strategy
1. **Category Discovery**: Use `find_category` to explore market segments
2. **Trend Analysis**: Identify growing vs declining categories  
3. **Demographic Targeting**: Age/gender analysis for customer targeting
4. **Competitive Intelligence**: Keyword performance comparison
5. **Device Strategy**: Mobile vs PC shopping optimization

#### Product Launch Planning
1. **Market Validation**: Category growth trends and seasonality
2. **Target Audience**: Demographic analysis for product positioning
3. **Marketing Channels**: Device preference for advertising strategy
4. **Competitive Landscape**: Keyword competition and opportunities
5. **Pricing Strategy**: Category performance correlation with pricing

#### Performance Monitoring
1. **Category Health**: Monitor your product category trends
2. **Keyword Tracking**: Track brand and product keyword performance
3. **Demographic Shifts**: Monitor changing customer demographics
4. **Seasonal Patterns**: Plan inventory and marketing campaigns
5. **Competitive Benchmarking**: Compare performance against category averages

### Quick Reference: Popular Category Codes
| Category | Code | Korean |
|----------|------|---------|
| Fashion/Clothing | 50000000 | 패션의류 |
| Cosmetics/Beauty | 50000002 | 화장품/미용 |
| Digital/Electronics | 50000003 | 디지털/가전 |
| Sports/Leisure | 50000004 | 스포츠/레저 |
| Food/Beverages | 50000008 | 식품/음료 |
| Health/Medical | 50000009 | 건강/의료용품 |

💡 **Tip**: Use `find_category` with fuzzy search like "뷰티", "패션", "전자제품" to easily find categories.

## Installation

### Option 1: Quick Install via Smithery (Recommended)

To install Naver Search MCP Server automatically via Smithery, use one of these commands based on your AI client:

For Claude Desktop:

```bash
npx -y @smithery/cli@latest install @isnow890/naver-search-mcp --client claude
```

For Cursor:

```bash
npx -y @smithery/cli@latest install @isnow890/naver-search-mcp --client cursor
```

For Windsurf:

```bash
npx -y @smithery/cli@latest install @isnow890/naver-search-mcp --client windsurf
```

For Cline:

```bash
npx -y @smithery/cli@latest install @isnow890/naver-search-mcp --client cline
```

The installer will prompt you for:

- NAVER_CLIENT_ID
- NAVER_CLIENT_SECRET

### Option 2: Manual Installation

#### Environment Variables

```bash
# Windows
set NAVER_CLIENT_ID=your_client_id
set NAVER_CLIENT_SECRET=your_client_secret

# Linux/Mac
export NAVER_CLIENT_ID=your_client_id
export NAVER_CLIENT_SECRET=your_client_secret
```

#### Run with NPX

```bash
npx @isnow890/naver-search-mcp
```

#### Run with Docker

```bash
docker run -i --rm \
  -e NAVER_CLIENT_ID=your_client_id \
  -e NAVER_CLIENT_SECRET=your_client_secret \
  mcp/naver-search
```

## Claude Desktop Configuration

Add to `claude_desktop_config.json`:

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

## Cursor AI Configuration

Add to `mcp.json`:

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

For Docker:

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

## Build

Docker build:

```bash
docker build -t mcp/naver-search .
```

## License

MIT License
