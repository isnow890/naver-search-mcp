import test from "node:test";
import assert from "node:assert/strict";
import { formatApiError } from "../dist/src/clients/naver-api-error.js";

test("provider 이름과 상태 코드와 URL을 담는다", () => {
  const msg = formatApiError(
    "hub",
    "https://naverapihub.apigw.ntruss.com/search/v1/blog",
    500,
    { error: { message: "boom" } }
  );
  assert.match(msg, /NAVER API HUB/);
  assert.match(msg, /HTTP 500/);
  assert.match(msg, /search\/v1\/blog/);
  assert.match(msg, /boom/);
});

test("legacy provider는 개발자센터로 표기한다", () => {
  const msg = formatApiError(
    "legacy",
    "https://openapi.naver.com/v1/search/blog",
    500,
    { errorMessage: "boom" }
  );
  assert.match(msg, /개발자센터/);
});

test("401이면 키를 반대쪽 변수에 넣었는지 힌트를 붙인다", () => {
  const msg = formatApiError("legacy", "https://openapi.naver.com/v1/search/blog", 401, {
    errorMessage: "Not Exist Client ID",
  });
  assert.match(msg, /NCP_APIGW_API_KEY_ID/);
});

test("HUB 401이 API 미활성 응답이면 키 교체 대신 활성화 힌트를 붙인다", () => {
  const msg = formatApiError(
    "hub",
    "https://naverapihub.apigw.ntruss.com/search/v1/blog",
    401,
    {
      error: {
        errorCode: 401,
        message: "요청한 API는 이 Application에서 활성화되어 있지 않습니다.",
      },
    }
  );
  assert.match(msg, /활성화하세요/);
  assert.doesNotMatch(msg, /NAVER_CLIENT_ID/);
});

test("HUB 401이 인증 실패 응답이면 키 교체 힌트를 유지한다", () => {
  const msg = formatApiError(
    "hub",
    "https://naverapihub.apigw.ntruss.com/search/v1/blog",
    401,
    {
      error: {
        errorCode: "200",
        message: "Authentication Failed",
        details: "Invalid authentication information.",
      },
    }
  );
  assert.match(msg, /NAVER_CLIENT_ID/);
  assert.doesNotMatch(msg, /활성화하세요/);
});

test("401이 아니면 힌트를 붙이지 않는다", () => {
  const msg = formatApiError("legacy", "https://openapi.naver.com/v1/search/blog", 429, {});
  assert.doesNotMatch(msg, /NCP_APIGW_API_KEY_ID/);
});

test("응답이 없으면 no response로 표기한다", () => {
  const msg = formatApiError("hub", "https://example.com", undefined, undefined);
  assert.match(msg, /no response/);
});

test("문자열 본문은 그대로 싣는다", () => {
  const msg = formatApiError("hub", "https://example.com", 502, "Bad Gateway");
  assert.match(msg, /Bad Gateway/);
});
