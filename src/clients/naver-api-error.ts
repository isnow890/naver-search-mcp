import { NaverApiProvider } from "./naver-api-endpoints.js";

const PROVIDER_LABEL: Record<NaverApiProvider, string> = {
  legacy: "네이버 개발자센터",
  hub: "NAVER API HUB",
};

const SWAPPED_KEY_HINT: Record<NaverApiProvider, string> = {
  legacy:
    "인증에 실패했습니다. NAVER API HUB 키를 NAVER_CLIENT_ID/NAVER_CLIENT_SECRET에 넣지 않았는지 확인하세요. HUB 키는 NCP_APIGW_API_KEY_ID/NCP_APIGW_API_KEY에 넣어야 합니다.",
  hub: "인증에 실패했습니다. 개발자센터 키를 NCP_APIGW_API_KEY_ID/NCP_APIGW_API_KEY에 넣지 않았는지 확인하세요. 개발자센터 키는 NAVER_CLIENT_ID/NAVER_CLIENT_SECRET에 넣어야 합니다.",
};

// HUB는 키가 맞아도 Application에 해당 API가 켜져 있지 않으면 401을 준다.
// 이때는 키를 바꿔 넣으라는 힌트가 오히려 사용자를 엉뚱한 곳으로 보낸다.
// 키 자체가 틀리면 본문이 "Authentication Failed"로 온다 (2026-10-21 실측).
const HUB_API_NOT_ENABLED =
  /요청한 API는 이 Application에서 활성화되어 있지 않습니다/;

const HUB_API_NOT_ENABLED_HINT =
  "키는 정상이지만 이 API가 NAVER API HUB Application에서 활성화되어 있지 않습니다. NAVER Cloud Platform 콘솔 > NAVER API HUB에서 해당 Application에 이 API를 활성화하세요.";

function stringifyBody(body: unknown): string {
  if (body === undefined || body === null) return "";
  if (typeof body === "string") return body;
  try {
    return JSON.stringify(body);
  } catch {
    return String(body);
  }
}

/**
 * 두 플랫폼의 오류 응답 형식이 다르므로 파싱하지 않고 그대로 실어 보낸다.
 */
export function formatApiError(
  provider: NaverApiProvider,
  url: string,
  status: number | undefined,
  body: unknown
): string {
  const statusText = status === undefined ? "no response" : `HTTP ${status}`;
  const lines = [`[${PROVIDER_LABEL[provider]}] ${statusText} — ${url}`];

  const bodyText = stringifyBody(body);
  if (bodyText) lines.push(bodyText);

  if (status === 401) {
    const notEnabled =
      provider === "hub" && HUB_API_NOT_ENABLED.test(bodyText);
    lines.push(notEnabled ? HUB_API_NOT_ENABLED_HINT : SWAPPED_KEY_HINT[provider]);
  }

  return lines.join("\n");
}
