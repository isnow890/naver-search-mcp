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

test("getHeaders는 provider에 맞는 인증 헤더명만 싣는다", () => {
  NaverSearchClient.destroyInstance();
  const client = NaverSearchClient.getInstance();

  client.initialize({ provider: "hub", clientId: "id", clientSecret: "sec" });
  const hub = client.getHeaders().headers;
  assert.equal(hub["X-NCP-APIGW-API-KEY-ID"], "id");
  assert.equal(hub["X-NCP-APIGW-API-KEY"], "sec");
  assert.equal(hub["Content-Type"], "application/json");
  assert.equal("X-Naver-Client-Id" in hub, false);

  client.initialize({ provider: "legacy", clientId: "id", clientSecret: "sec" });
  const legacy = client.getHeaders().headers;
  assert.equal(legacy["X-Naver-Client-Id"], "id");
  assert.equal(legacy["X-Naver-Client-Secret"], "sec");
  assert.equal("X-NCP-APIGW-API-KEY-ID" in legacy, false);

  NaverSearchClient.destroyInstance();
});

test("응답이 없는 실패도 원인을 알 수 있는 메시지로 감싼다", async () => {
  NaverSearchClient.destroyInstance();
  const client = NaverSearchClient.getInstance();
  client.initialize({
    provider: "legacy",
    clientId: "id",
    clientSecret: "sec",
  });

  // 포트 1은 연결이 거부된다 — 응답 객체가 없는 경로를 탄다.
  await assert.rejects(
    () => client.get("http://127.0.0.1:1/nope", {}),
    (err) => {
      assert.match(err.message, /개발자센터/);
      assert.match(err.message, /ECONNREFUSED|connect/i);
      return true;
    }
  );

  NaverSearchClient.destroyInstance();
});

test("요청 중 인스턴스가 정리돼도 원래 에러가 유지된다", async () => {
  NaverSearchClient.destroyInstance();
  const client = NaverSearchClient.getInstance();
  client.initialize({ provider: "hub", clientId: "id", clientSecret: "sec" });

  const pending = client.get("http://127.0.0.1:1/nope", {});
  NaverSearchClient.destroyInstance(); // 응답 도착 전에 config를 비운다

  await assert.rejects(pending, (err) => {
    assert.doesNotMatch(err.message, /not initialized/);
    assert.match(err.message, /NAVER API HUB/);
    return true;
  });
});
