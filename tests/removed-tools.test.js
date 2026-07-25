import test from "node:test";
import assert from "node:assert/strict";
import { searchToolHandlers } from "../dist/src/handlers/search.handlers.js";
import { NaverSearchTypeSchema } from "../dist/src/schemas/search.schemas.js";
import { NaverSearchClient } from "../dist/src/clients/naver-search.client.js";

test("폐지된 검색 툴 3종은 핸들러에 없다", () => {
  for (const name of ["search_shop", "search_book", "search_academic"]) {
    assert.equal(searchToolHandlers[name], undefined, `${name}이 남아있다`);
  }
});

test("살아있는 검색 툴 8종은 그대로 있다", () => {
  for (const name of [
    "search_blog",
    "search_news",
    "search_encyc",
    "search_cafearticle",
    "search_image",
    "search_kin",
    "search_local",
    "search_webkr",
  ]) {
    assert.equal(typeof searchToolHandlers[name], "function", `${name}이 없다`);
  }
});

test("검색 타입 enum에서 shop/book/doc이 빠졌다", () => {
  assert.deepEqual(NaverSearchTypeSchema.options.sort(), [
    "blog",
    "cafearticle",
    "encyc",
    "image",
    "kin",
    "local",
    "news",
    "webkr",
  ]);
});

test("searchAcademic 메서드가 사라졌다", () => {
  const client = NaverSearchClient.getInstance();
  assert.equal(client.searchAcademic, undefined);
  NaverSearchClient.destroyInstance();
});

test("쇼핑인사이트 메서드 8종은 유지된다", () => {
  const client = NaverSearchClient.getInstance();
  for (const name of [
    "datalabShoppingCategory",
    "datalabShoppingByDevice",
    "datalabShoppingByGender",
    "datalabShoppingByAge",
    "datalabShoppingKeywords",
    "datalabShoppingKeywordByDevice",
    "datalabShoppingKeywordByGender",
    "datalabShoppingKeywordByAge",
  ]) {
    assert.equal(typeof client[name], "function", `${name}이 사라졌다`);
  }
  NaverSearchClient.destroyInstance();
});
