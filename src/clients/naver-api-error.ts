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

  if (status === 401) lines.push(SWAPPED_KEY_HINT[provider]);

  return lines.join("\n");
}
