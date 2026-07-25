import test from "node:test";
import assert from "node:assert/strict";
import { resolveCredentials } from "../dist/src/config/credentials.js";

test("HUB 키 쌍이 있으면 hub를 고른다", () => {
  const r = resolveCredentials({
    NCP_APIGW_API_KEY_ID: "hubid",
    NCP_APIGW_API_KEY: "hubsecret",
  });
  assert.deepEqual(r, {
    provider: "hub",
    clientId: "hubid",
    clientSecret: "hubsecret",
  });
});

test("legacy 키 쌍만 있으면 legacy를 고른다", () => {
  const r = resolveCredentials({
    NAVER_CLIENT_ID: "legacyid",
    NAVER_CLIENT_SECRET: "legacysecret",
  });
  assert.deepEqual(r, {
    provider: "legacy",
    clientId: "legacyid",
    clientSecret: "legacysecret",
  });
});

test("두 쌍이 모두 있으면 HUB가 이긴다", () => {
  const r = resolveCredentials({
    NAVER_CLIENT_ID: "legacyid",
    NAVER_CLIENT_SECRET: "legacysecret",
    NCP_APIGW_API_KEY_ID: "hubid",
    NCP_APIGW_API_KEY: "hubsecret",
  });
  assert.equal(r.provider, "hub");
  assert.equal(r.clientId, "hubid");
});

test("HUB 키가 한 쪽만 있으면 어느 쪽이 빠졌는지 알려주며 실패한다", () => {
  assert.throws(
    () => resolveCredentials({ NCP_APIGW_API_KEY_ID: "hubid" }),
    (err) => {
      assert.match(err.message, /NCP_APIGW_API_KEY/);
      assert.match(err.message, /missing/);
      return true;
    }
  );
});

test("legacy 키가 한 쪽만 있으면 실패한다", () => {
  assert.throws(
    () => resolveCredentials({ NAVER_CLIENT_SECRET: "legacysecret" }),
    (err) => {
      assert.match(err.message, /NAVER_CLIENT_ID/);
      return true;
    }
  );
});

test("아무 키도 없으면 두 방식을 모두 안내하며 실패한다", () => {
  assert.throws(
    () => resolveCredentials({}),
    (err) => {
      assert.match(err.message, /NCP_APIGW_API_KEY_ID/);
      assert.match(err.message, /NAVER_CLIENT_ID/);
      return true;
    }
  );
});

test("공백만 들어있는 값은 없는 것으로 본다", () => {
  assert.throws(() =>
    resolveCredentials({
      NCP_APIGW_API_KEY_ID: "  ",
      NCP_APIGW_API_KEY: "  ",
      NAVER_CLIENT_ID: "  ",
      NAVER_CLIENT_SECRET: "  ",
    })
  );
});

test("값의 앞뒤 공백은 잘라낸다", () => {
  const r = resolveCredentials({
    NCP_APIGW_API_KEY_ID: " hubid ",
    NCP_APIGW_API_KEY: " hubsecret ",
  });
  assert.equal(r.clientId, "hubid");
  assert.equal(r.clientSecret, "hubsecret");
});
