import test from "node:test";
import assert from "node:assert/strict";
import {
  getEndpoints,
  getAuthHeaderNames,
} from "../dist/src/clients/naver-api-endpoints.js";

test("legacy 엔드포인트는 개발자센터 URL을 그대로 유지한다", () => {
  const e = getEndpoints("legacy");
  assert.equal(e.search, "https://openapi.naver.com/v1/search");
  assert.equal(e.trend, "https://openapi.naver.com/v1/datalab/search");
  assert.equal(e.shopping, "https://openapi.naver.com/v1/datalab/shopping");
});

test("hub 엔드포인트는 API HUB URL을 쓴다", () => {
  const e = getEndpoints("hub");
  assert.equal(e.search, "https://naverapihub.apigw.ntruss.com/search/v1");
  assert.equal(
    e.trend,
    "https://naverapihub.apigw.ntruss.com/search-trend/v1/search"
  );
  assert.equal(e.shopping, "https://naverapihub.apigw.ntruss.com/shopping/v1");
});

test("검색 URL은 양쪽 모두 base + /{type} 으로 조립된다", () => {
  assert.equal(
    `${getEndpoints("legacy").search}/blog`,
    "https://openapi.naver.com/v1/search/blog"
  );
  assert.equal(
    `${getEndpoints("hub").search}/blog`,
    "https://naverapihub.apigw.ntruss.com/search/v1/blog"
  );
});

test("쇼핑인사이트 suffix 8종은 양쪽에서 동일하게 붙는다", () => {
  const suffixes = [
    "/categories",
    "/category/device",
    "/category/gender",
    "/category/age",
    "/category/keywords",
    "/category/keyword/device",
    "/category/keyword/gender",
    "/category/keyword/age",
  ];
  for (const s of suffixes) {
    assert.equal(
      `${getEndpoints("legacy").shopping}${s}`,
      `https://openapi.naver.com/v1/datalab/shopping${s}`
    );
    assert.equal(
      `${getEndpoints("hub").shopping}${s}`,
      `https://naverapihub.apigw.ntruss.com/shopping/v1${s}`
    );
  }
});

test("인증 헤더명은 provider별로 다르다", () => {
  assert.deepEqual(getAuthHeaderNames("legacy"), {
    id: "X-Naver-Client-Id",
    secret: "X-Naver-Client-Secret",
  });
  assert.deepEqual(getAuthHeaderNames("hub"), {
    id: "X-NCP-APIGW-API-KEY-ID",
    secret: "X-NCP-APIGW-API-KEY",
  });
});
