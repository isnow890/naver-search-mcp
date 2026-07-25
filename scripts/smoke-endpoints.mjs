#!/usr/bin/env node
// 17개 엔드포인트를 실제로 호출해 provider 배선을 검증한다.
// 사용법: node scripts/smoke-endpoints.mjs
// .env의 자격증명을 읽어 존재하는 provider를 모두 검사한다.

import "dotenv/config";
import { NaverSearchClient } from "../dist/src/clients/naver-search.client.js";
import { resolveCredentials } from "../dist/src/config/credentials.js";

const RANGE = { startDate: "2026-01-01", endDate: "2026-03-31", timeUnit: "month" };
const CATEGORY = "50000000";

// expectedKey: 성공 응답이면 반드시 있어야 하는 최상위 필드.
// 이걸 확인하지 않으면 200에 에러 본문이 실려와도 PASS로 세게 된다.
async function runOne(label, expectedKey, fn) {
  try {
    const result = await fn();

    if (result === null || typeof result !== "object") {
      console.log(`  FAIL  ${label}  (응답이 객체가 아님: ${typeof result})`);
      return false;
    }

    const keys = Object.keys(result);
    if (!keys.includes(expectedKey)) {
      console.log(
        `  FAIL  ${label}  ('${expectedKey}' 필드 없음 — 받은 키: ${keys.join(",")})`
      );
      return false;
    }

    console.log(`  PASS  ${label}  (object: ${keys.join(",")})`);
    return true;
  } catch (error) {
    console.log(`  FAIL  ${label}\n        ${String(error.message).split("\n").join("\n        ")}`);
    return false;
  }
}

async function runProvider(credentials) {
  console.log(`\n=== provider: ${credentials.provider} ===`);
  NaverSearchClient.destroyInstance();
  const client = NaverSearchClient.getInstance();
  client.initialize(credentials);
  console.log(`  searchBaseUrl   ${client.searchBaseUrl}`);
  console.log(`  trendUrl        ${client.trendUrl}`);
  console.log(`  shoppingBaseUrl ${client.shoppingBaseUrl}\n`);

  const results = [];
  for (const type of ["blog", "news", "encyc", "cafearticle", "image", "kin", "webkr"]) {
    results.push(await runOne(`search/${type}`, "items", () => client.search(type, { query: "커피", display: 1 })));
  }
  results.push(await runOne("search/local", "items", () => client.searchLocal({ query: "스타벅스", display: 1 })));

  results.push(
    await runOne("datalab/search-trend", "results", () =>
      client.searchTrend({ ...RANGE, keywordGroups: [{ groupName: "커피", keywords: ["커피"] }] })
    )
  );

  const cat = [{ name: "패션의류", param: [CATEGORY] }];
  results.push(await runOne("shopping/categories", "results", () => client.datalabShoppingCategory({ ...RANGE, category: cat })));
  results.push(await runOne("shopping/category/device", "results", () => client.datalabShoppingByDevice({ ...RANGE, category: CATEGORY })));
  results.push(await runOne("shopping/category/gender", "results", () => client.datalabShoppingByGender({ ...RANGE, category: CATEGORY })));
  results.push(await runOne("shopping/category/age", "results", () => client.datalabShoppingByAge({ ...RANGE, category: CATEGORY })));
  results.push(
    await runOne("shopping/category/keywords", "results", () =>
      client.datalabShoppingKeywords({ ...RANGE, category: CATEGORY, keyword: [{ name: "코트", param: ["코트"] }] })
    )
  );
  const kw = { ...RANGE, category: CATEGORY, keyword: "코트" };
  results.push(await runOne("shopping/category/keyword/device", "results", () => client.datalabShoppingKeywordByDevice(kw)));
  results.push(await runOne("shopping/category/keyword/gender", "results", () => client.datalabShoppingKeywordByGender(kw)));
  results.push(await runOne("shopping/category/keyword/age", "results", () => client.datalabShoppingKeywordByAge(kw)));

  NaverSearchClient.destroyInstance();
  const passed = results.filter(Boolean).length;
  console.log(`\n  ${passed}/${results.length} passed`);
  return passed === results.length;
}

const targets = [];
if (process.env.NCP_APIGW_API_KEY_ID && process.env.NCP_APIGW_API_KEY) {
  targets.push(resolveCredentials({
    NCP_APIGW_API_KEY_ID: process.env.NCP_APIGW_API_KEY_ID,
    NCP_APIGW_API_KEY: process.env.NCP_APIGW_API_KEY,
  }));
}
if (process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET) {
  targets.push(resolveCredentials({
    NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID,
    NAVER_CLIENT_SECRET: process.env.NAVER_CLIENT_SECRET,
  }));
}

if (targets.length === 0) {
  console.error("검사할 자격증명이 없습니다. .env를 확인하세요.");
  process.exit(1);
}

let allOk = true;
for (const credentials of targets) {
  allOk = (await runProvider(credentials)) && allOk;
}
process.exit(allOk ? 0 : 1);
