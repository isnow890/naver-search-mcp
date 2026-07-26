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

test("HUB ID만 있어도 legacy 쌍이 온전하면 legacy로 폴백하고 경고를 반환한다", () => {
  const r = resolveCredentials({
    NCP_APIGW_API_KEY_ID: "hubid",
    NAVER_CLIENT_ID: "legacyid",
    NAVER_CLIENT_SECRET: "legacysecret",
  });
  assert.equal(r.provider, "legacy");
  assert.equal(r.clientId, "legacyid");
  assert.equal(r.clientSecret, "legacysecret");
  assert.match(r.warning, /NCP_APIGW_API_KEY/);
  assert.match(r.warning, /개발자센터/);
});

test("HUB 시크릿만 있어도 legacy 쌍이 온전하면 폴백한다", () => {
  const r = resolveCredentials({
    NCP_APIGW_API_KEY: "hubsecret",
    NAVER_CLIENT_ID: "legacyid",
    NAVER_CLIENT_SECRET: "legacysecret",
  });
  assert.equal(r.provider, "legacy");
  assert.match(r.warning, /NCP_APIGW_API_KEY_ID/);
});

test("HUB가 반쪽이고 legacy도 반쪽이면 폴백하지 않고 실패한다", () => {
  assert.throws(
    () =>
      resolveCredentials({
        NCP_APIGW_API_KEY_ID: "hubid",
        NAVER_CLIENT_ID: "legacyid",
      }),
    (err) => {
      assert.match(err.message, /NCP_APIGW_API_KEY/);
      return true;
    }
  );
});

test("경고가 없는 정상 해석 결과에는 warning 키가 아예 없다", () => {
  const hub = resolveCredentials({
    NCP_APIGW_API_KEY_ID: "hubid",
    NCP_APIGW_API_KEY: "hubsecret",
  });
  assert.equal("warning" in hub, false);

  const legacy = resolveCredentials({
    NAVER_CLIENT_ID: "legacyid",
    NAVER_CLIENT_SECRET: "legacysecret",
  });
  assert.equal("warning" in legacy, false);
});
