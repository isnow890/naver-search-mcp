import test from "node:test";
import assert from "node:assert/strict";
import { NaverSearchClient } from "../dist/src/clients/naver-search.client.js";

test("legacy로 초기화하면 개발자센터 URL을 노출한다", () => {
  const client = NaverSearchClient.getInstance();
  client.initialize({
    provider: "legacy",
    clientId: "id",
    clientSecret: "secret",
  });
  assert.equal(client.provider, "legacy");
  assert.equal(client.searchBaseUrl, "https://openapi.naver.com/v1/search");
  assert.equal(client.trendUrl, "https://openapi.naver.com/v1/datalab/search");
  assert.equal(
    client.shoppingBaseUrl,
    "https://openapi.naver.com/v1/datalab/shopping"
  );
  NaverSearchClient.destroyInstance();
});

test("hub로 초기화하면 API HUB URL을 노출한다", () => {
  const client = NaverSearchClient.getInstance();
  client.initialize({
    provider: "hub",
    clientId: "id",
    clientSecret: "secret",
  });
  assert.equal(
    client.searchBaseUrl,
    "https://naverapihub.apigw.ntruss.com/search/v1"
  );
  assert.equal(
    client.trendUrl,
    "https://naverapihub.apigw.ntruss.com/search-trend/v1/search"
  );
  assert.equal(
    client.shoppingBaseUrl,
    "https://naverapihub.apigw.ntruss.com/shopping/v1"
  );
  NaverSearchClient.destroyInstance();
});

test("초기화 전에 provider를 읽으면 실패한다", () => {
  NaverSearchClient.destroyInstance();
  const client = NaverSearchClient.getInstance();
  assert.throws(() => client.provider, /not initialized/);
  NaverSearchClient.destroyInstance();
});
