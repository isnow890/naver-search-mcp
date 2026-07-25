import { NaverApiProvider } from "../clients/naver-api-endpoints.js";

export interface CredentialEnv {
  NAVER_CLIENT_ID?: string;
  NAVER_CLIENT_SECRET?: string;
  NCP_APIGW_API_KEY_ID?: string;
  NCP_APIGW_API_KEY?: string;
}

export interface ResolvedCredentials {
  provider: NaverApiProvider;
  clientId: string;
  clientSecret: string;
}

const SETUP_GUIDE = `
NAVER API HUB(권장): NCP_APIGW_API_KEY_ID, NCP_APIGW_API_KEY
  발급: NAVER Cloud Platform 콘솔 > NAVER API HUB
네이버 개발자센터(2027-06-30 지원 종료): NAVER_CLIENT_ID, NAVER_CLIENT_SECRET

두 자격증명은 서로 호환되지 않습니다. 발급받은 플랫폼에 맞는 환경변수에 넣어주세요.`;

/**
 * 환경변수에서 자격증명을 읽어 사용할 provider를 결정한다.
 * 키 값 자체로는 두 플랫폼을 구분할 수 없으므로, 어느 변수에 들어있는지로 판단한다.
 * HUB 쌍이 legacy 쌍보다 우선한다.
 */
export function resolveCredentials(env: CredentialEnv): ResolvedCredentials {
  const hubId = env.NCP_APIGW_API_KEY_ID?.trim();
  const hubSecret = env.NCP_APIGW_API_KEY?.trim();
  const legacyId = env.NAVER_CLIENT_ID?.trim();
  const legacySecret = env.NAVER_CLIENT_SECRET?.trim();

  if (hubId && hubSecret) {
    return { provider: "hub", clientId: hubId, clientSecret: hubSecret };
  }

  if (hubId || hubSecret) {
    throw new Error(
      `NAVER API HUB 자격증명이 불완전합니다.
  NCP_APIGW_API_KEY_ID: ${hubId ? "provided" : "missing"}
  NCP_APIGW_API_KEY: ${hubSecret ? "provided" : "missing"}
두 값을 함께 설정해야 합니다.`
    );
  }

  if (legacyId && legacySecret) {
    return {
      provider: "legacy",
      clientId: legacyId,
      clientSecret: legacySecret,
    };
  }

  if (legacyId || legacySecret) {
    throw new Error(
      `네이버 개발자센터 자격증명이 불완전합니다.
  NAVER_CLIENT_ID: ${legacyId ? "provided" : "missing"}
  NAVER_CLIENT_SECRET: ${legacySecret ? "provided" : "missing"}
두 값을 함께 설정해야 합니다.`
    );
  }

  throw new Error(`자격증명이 설정되지 않았습니다.
${SETUP_GUIDE}`);
}
