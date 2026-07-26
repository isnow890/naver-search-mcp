#!/usr/bin/env node
// 17개 엔드포인트를 실제로 호출해 provider 배선을 검증한다.
// 사용법: node scripts/smoke-endpoints.mjs
// .env의 자격증명을 읽어 존재하는 provider를 모두 검사한다.

import "dotenv/config";
import { NaverSearchClient } from "../dist/src/clients/naver-search.client.js";
import { resolveCredentials } from "../dist/src/config/credentials.js";

const RANGE = { startDate: "2026-01-01", endDate: "2026-03-31", timeUnit: "month" };
const CATEGORY = "50000000";

// 성공 판정이 왜 이렇게 까다로운지:
//  - 필드 존재만 보면 200에 에러 본문이 실려와도 PASS로 센다.
//  - 존재 + 비어있음까지 허용하면 더 나쁘다. 네이버는 존재하지 않는 카테고리
//    코드(99999999)에도 HTTP 200과 results:[{..., data: []}] 를 돌려준다
//    (2026-07-26 실측). 없는 키워드도 같다. 그래서 데이터가 하나도 없는데
//    "17/17 passed"가 찍히는 상황이 실제로 가능하다.
// 따라서 배열이 비어있지 않은 것까지 확인한다.
function emptinessProblem(expectedKey, value) {
  if (!Array.isArray(value)) return `'${expectedKey}'가 배열이 아님`;
  if (value.length === 0) return `'${expectedKey}'가 비어 있음`;

  if (expectedKey === "results") {
    const empty = value.filter(
      (row) => !Array.isArray(row.data) || row.data.length === 0
    );
    if (empty.length > 0) {
      return `results[].data 가 비어 있음 (${empty.length}/${value.length}건)`;
    }
  }

  return null;
}

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

    const problem = emptinessProblem(expectedKey, result[expectedKey]);
    if (problem) {
      console.log(`  FAIL  ${label}  (${problem})`);
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

// 반쪽만 설정된 provider를 조용히 건너뛰면 안 된다. HUB 변수 하나에 오타가 났는데
// legacy가 온전하면 "17/17 passed"가 찍히고 종료 코드도 0인데 정작 이번 이관의
// 대상인 HUB는 한 번도 호출되지 않은 상태가 된다.
function pickTarget(idVar, secretVar, label) {
  const id = process.env[idVar];
  const secret = process.env[secretVar];

  if (id && secret) return resolveCredentials({ [idVar]: id, [secretVar]: secret });

  if (id || secret) {
    console.log(
      `[경고] ${label} 자격증명이 반쪽이라 검사에서 제외합니다 — ${
        id ? secretVar : idVar
      } 가 설정되지 않았습니다.`
    );
  }
  return null;
}

const targets = [
  pickTarget("NCP_APIGW_API_KEY_ID", "NCP_APIGW_API_KEY", "NAVER API HUB"),
  pickTarget("NAVER_CLIENT_ID", "NAVER_CLIENT_SECRET", "네이버 개발자센터"),
].filter(Boolean);

if (targets.length === 0) {
  console.error("검사할 자격증명이 없습니다. .env를 확인하세요.");
  process.exit(1);
}

let allOk = true;
for (const credentials of targets) {
  allOk = (await runProvider(credentials)) && allOk;
}
process.exit(allOk ? 0 : 1);
