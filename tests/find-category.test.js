import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { findCategoryHandler } from "../dist/src/handlers/category.handlers.js";

const CATEGORIES = JSON.parse(
  readFileSync(new URL("../data/categories.json", import.meta.url), "utf8")
);

// 대분류 이름 → 쇼핑인사이트 분야 코드
const TOP_LEVEL = {
  패션의류: "50000000",
  패션잡화: "50000001",
  "화장품/미용": "50000002",
  "디지털/가전": "50000003",
  "가구/인테리어": "50000004",
  "출산/육아": "50000005",
  식품: "50000006",
  "스포츠/레저": "50000007",
  "생활/건강": "50000008",
  "여가/생활편의": "50000009",
  도서: "50005542",
};

test("대분류마다 코드 행이 정확히 하나 있다", () => {
  const level1Names = [...new Set(CATEGORIES.map((c) => c.level1))].sort();
  assert.deepEqual(level1Names, Object.keys(TOP_LEVEL).sort());

  for (const [name, code] of Object.entries(TOP_LEVEL)) {
    const rows = CATEGORIES.filter((c) => c.level1 === name && !c.level2);
    assert.equal(rows.length, 1, `${name} 대분류 행이 ${rows.length}개다`);
    assert.deepEqual(rows[0], { code, level1: name, level2: "", level3: "", level4: "" });
  }
});

test("카테고리 코드는 중복되지 않는다", () => {
  const codes = CATEGORIES.map((c) => c.code);
  assert.equal(new Set(codes).size, codes.length);
});

test("대분류 이름으로 검색하면 대분류 코드가 1위다", async () => {
  for (const [name, code] of Object.entries(TOP_LEVEL)) {
    const { categories } = await findCategoryHandler({ query: name, max_results: 1 });
    assert.equal(categories[0].code, code, `${name}`);
    assert.equal(categories[0].category, name);
  }
});

test("대분류 이름의 앞부분으로 검색해도 대분류가 먼저 나온다", async () => {
  const { categories } = await findCategoryHandler({ query: "패션", max_results: 2 });
  assert.deepEqual(
    categories.map((c) => c.code),
    [TOP_LEVEL.패션의류, TOP_LEVEL.패션잡화]
  );
});

test("하위 분류 검색 결과는 바뀌지 않는다", async () => {
  for (const [query, code] of [
    ["노트북", "50000151"],
    ["립스틱", "50000391"],
  ]) {
    const { categories } = await findCategoryHandler({ query, max_results: 1 });
    assert.equal(categories[0].code, code, query);
  }
});

test("자체 코드가 없는 분류로 검색하면 결과가 하위 분류라고 표시하고 안내한다", async () => {
  const res = await findCategoryHandler({ query: "여성의류", max_results: 3 });
  for (const c of res.categories) {
    assert.match(c.category, /^패션의류 > 여성의류 > /);
    assert.equal(c.match_type, "정확일치(중분류의 하위 분류)");
  }
  assert.match(res.note, /"여성의류"\(중분류\) 자체의 카테고리 코드는 없습니다/);
  assert.match(res.note, new RegExp(TOP_LEVEL.패션의류));
});

test("자체 코드가 있는 분류는 기존 표시를 유지하고 안내하지 않는다", async () => {
  for (const [query, code, matchType] of [
    ["노트북", "50000151", "정확일치(중분류)"],
    ["립스틱", "50000391", "정확일치(소분류)"],
    ["패션의류", TOP_LEVEL.패션의류, "정확일치(대분류)"],
  ]) {
    const res = await findCategoryHandler({ query, max_results: 2 });
    assert.equal(res.categories[0].code, code, query);
    assert.equal(res.categories[0].match_type, matchType, query);
    assert.equal(res.note, undefined, query);
  }
  // 대분류 아래 하위 분류는 하위 분류로 표시된다.
  const res = await findCategoryHandler({ query: "패션의류", max_results: 2 });
  assert.equal(res.categories[1].match_type, "정확일치(대분류의 하위 분류)");
});

test("검색어가 분류 이름의 일부일 때는 안내하지 않는다", async () => {
  const res = await findCategoryHandler({ query: "여성", max_results: 3 });
  assert.equal(res.note, undefined);
});

test("같은 점수면 이름이 정확히 일치하는 분류가 하위 분류보다 먼저 나온다", async () => {
  const { categories } = await findCategoryHandler({ query: "정가제free", max_results: 3 });
  assert.match(categories[0].category, / > 정가제free$/);
  assert.doesNotMatch(categories[0].match_type, /하위 분류/);
});
