## 2.0.0

### Breaking

- `search_shop`, `search_book`, `search_academic` 툴을 제거했습니다. 네이버가
  2026-07-31에 검색 쇼핑/책/전문자료 API를 종료했으며 대체 API가 없습니다.
  (공지: developers.naver.com/notice/article/32564)
  쇼핑 인사이트(`datalab_shopping_*`)와 `find_category`는 별개 API로 그대로 유지됩니다.

### Added

- NAVER API HUB(네이버 클라우드 플랫폼) 지원. `NCP_APIGW_API_KEY_ID`와
  `NCP_APIGW_API_KEY`을 설정하면 API HUB로 호출합니다.
  기존 `NAVER_CLIENT_ID`/`NAVER_CLIENT_SECRET`은 그대로 동작합니다.
- 오류 메시지에 어느 플랫폼으로 호출했는지와 HTTP 상태 코드를 포함합니다.
  인증 실패(401) 시 키를 반대쪽 환경변수에 넣지 않았는지 안내합니다.

### Notes

- 개발자센터 키는 2027-06-30까지 지원됩니다. 그 이후에는 API HUB 키가 필요합니다.
- **개발자센터(레거시) 경로는 실제 API 호출로 검증되지 않았습니다.** 개발자센터 자격증명을
  확보하지 못해 직접 호출 테스트를 하지 못했습니다. 검증된 것은: (1) 새 코드가 생성하는
  URL이 이관 전 코드와 바이트 단위로 동일함을 3회 독립 확인, (2) 의도적으로 잘못된
  자격증명으로 `openapi.naver.com`에 요청했을 때 404가 아닌 401을 반환함 — 즉 호스트,
  경로, 헤더 이름은 실제 서버 기준으로 유효합니다. 검증되지 않은 것은 유효한 개발자센터
  자격증명이 새 코드를 통해 실제로 200을 반환하는지 여부입니다. 이 부분이 확인되기 전까지
  `npm publish`를 보류합니다.

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
