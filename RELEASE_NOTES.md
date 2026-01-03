# Release 1.0.47 - Server Termination Fix & "today" Keyword Support

## Summary

This release fixes a critical server termination issue where the MCP server would continue running after the client disconnects. It also introduces convenient "today" keyword support for all DataLab date parameters, eliminating the need for separate time tool calls.

## Breaking Changes

- **Removed**: `get_current_korean_time` tool - functionality replaced by "today" keyword support
- **Removed**: Memory monitoring module - no longer needed after fixing setInterval blocking issue

## New Features

### "today" Keyword Support
All DataLab date parameters now accept `"today"` as a value, which automatically resolves to the current Korean Standard Time (KST) date.

**Before**:
```json
{
  "startDate": "2025-01-03",
  "endDate": "2025-01-03"
}
```

**After**:
```json
{
  "startDate": "today",
  "endDate": "today"
}
```

Affected tools:
- `datalab_search`
- `datalab_shopping_category`
- `datalab_shopping_by_device`
- `datalab_shopping_by_gender`
- `datalab_shopping_by_age`
- `datalab_shopping_keywords`
- `datalab_shopping_keyword_by_device`
- `datalab_shopping_keyword_by_gender`
- `datalab_shopping_keyword_by_age`

## Bug Fixes

### Server Termination Issue
- **Fixed**: MCP server now properly exits when client disconnects
- **Added**: Graceful shutdown handlers for SIGINT, SIGTERM, and transport close events
- **Root Cause**: Memory monitoring module using `setInterval` was blocking Node.js process exit
- **Solution**: Removed memory monitoring module entirely

## Documentation Updates

### README Changes
- **Added**: Kakao PlayMCP quick start section (https://playmcp.kakao.com/mcp/154)
- **Moved**: "Getting API Keys" section before "Installation" for better user flow
- **Enhanced**: API key registration instructions with detailed step-by-step guide
- **Removed**: Category code reference tables (redundant with `find_category` tool)
- **Removed**: Advanced Analysis Scenarios section
- **Removed**: Business Use Cases & Scenarios section

## Migration Guide

If you were using `get_current_korean_time` tool:

**Before**:
```typescript
// Step 1: Get current time
const time = await get_current_korean_time();
const today = time.formatted.date;

// Step 2: Use in datalab call
await datalab_search({
  startDate: today,
  endDate: today,
  ...
});
```

**After**:
```typescript
// Direct usage
await datalab_search({
  startDate: "today",
  endDate: "today",
  ...
});
```

## Acknowledgments

Special thanks to **@gloomyrobot** for reporting the server termination issue, which helped identify and fix the memory monitoring blocking problem.

## Installation

```bash
# NPX (recommended)
npx -y @isnow890/naver-search-mcp@1.0.47

# Or update existing installation
npm update @isnow890/naver-search-mcp
```

## Links

- **NPM Package**: https://www.npmjs.com/package/@isnow890/naver-search-mcp
- **GitHub**: https://github.com/isnow890/naver-search-mcp
- **Kakao PlayMCP**: https://playmcp.kakao.com/mcp/154
