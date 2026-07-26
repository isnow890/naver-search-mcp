# Release 2.0.0 - NAVER API HUB Migration

## Summary

Naver is moving the Search, Search Trend, and Shopping Insight APIs from the Naver Developers Center to NAVER API HUB on NAVER Cloud Platform. This release supports both platforms from a single version, and removes three tools whose APIs Naver is shutting down entirely.

## Breaking Changes

- **Removed**: `search_shop`, `search_book`, `search_academic`. Naver shuts down the Shopping / Book / Academic-document search APIs on 2026-07-31 with no grace period and no replacement on any platform — they already return 404 on NAVER API HUB. See https://developers.naver.com/notice/article/32564
- Shopping **Insight** (`datalab_shopping_*`) and `find_category` are a different API and are **not** affected. They continue to work on both platforms.
- **Error type changed**: API errors now throw a plain `Error` instead of propagating the raw `AxiosError`. A consumer branching on `error.response?.status` will now see `undefined`. The `Error.message` carries the same information instead: the platform, the HTTP status, and the response body.

## New Features

- **NAVER API HUB support**: set `NCP_APIGW_API_KEY_ID` and `NCP_APIGW_API_KEY` to call NAVER API HUB. Existing `NAVER_CLIENT_ID` / `NAVER_CLIENT_SECRET` keep working unchanged.
- The platform is selected by which variable pair you set, never by inspecting key values — the two platforms' credentials are indistinguishable by sight, and Developers Center keys cannot be used against API HUB at all. NAVER API HUB wins if both pairs are set.
- If only one HUB variable is set while a complete Developers Center pair exists, the server starts on the legacy platform and warns which HUB variable is missing, instead of refusing to start.
- Error messages now name the platform and the HTTP status. On 401 they suggest checking whether a key was placed in the other platform's variables.

## Migration Timeline

| Date | What happens |
|---|---|
| 2026-06-25 | NAVER API HUB launched |
| 2026-07-31 | Developers Center stops accepting new applications |
| 2027-06-30 | Developers Center support ends — existing keys stop working |

Existing Developers Center keys keep working until 2027-06-30. To migrate, get a key from the NAVER Cloud Platform console and set `NCP_APIGW_API_KEY_ID` / `NCP_APIGW_API_KEY`.

## Verification

Both platforms were exercised against the live APIs with valid credentials — all 17 endpoints on each (8 searches, 1 search trend, 8 shopping insight), with every response checked for its expected non-empty payload rather than merely a 2xx status.

The URLs the new code produces for the Developers Center path are also byte-identical to the pre-migration code, confirmed independently three times, so existing users upgrade onto the same requests they were already making.

## Installation

```bash
npx -y @isnow890/naver-search-mcp@2.0.0
```

---

# Release 1.0.48 - find_category Data Path Fix

## Summary

This release fixes `find_category` when the MCP server is launched by `npx` or MCP runners from a working directory outside the installed npm package.

## Bug Fixes

- **Fixed**: `find_category` now loads `dist/data/categories.json` relative to the installed package location before checking `process.cwd()` fallbacks.
- **Impact**: OpenClaw, npx, and other MCP runner environments can now resolve Naver shopping category data correctly.

## Installation

```bash
npx -y @isnow890/naver-search-mcp@1.0.48
```

---

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
