/**
 * Date utility functions for Naver Search MCP Server
 */

/**
 * Convert "today" keyword to Korean Standard Time (KST) date string
 * or return the original date string if it's already in yyyy-mm-dd format
 *
 * @param dateStr - Date string or "today" keyword
 * @returns Date string in yyyy-mm-dd format (KST)
 */
export function resolveDate(dateStr: string): string {
  if (dateStr.toLowerCase() === 'today') {
    return getKoreanToday();
  }

  // Validate yyyy-mm-dd format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (dateRegex.test(dateStr)) {
    return dateStr;
  }

  // If not "today" and not valid format, throw error
  throw new Error(`Invalid date format: "${dateStr}". Use "today" or yyyy-mm-dd format.`);
}

/**
 * Get current Korean Standard Time (KST) date string
 *
 * 직접 오프셋을 더하지 않는다. now.getTime() 은 이미 UTC 기준 epoch 이라
 * 거기에 9시간과 getTimezoneOffset() 을 함께 더하면 프로세스의 로컬
 * 타임존만큼 이중 보정된다. TZ=Asia/Seoul 인 호스트에서는 00:00~09:00 KST
 * 사이에 하루 전 날짜가 나온다. 타임존 변환은 Intl 에 맡긴다.
 * en-CA 로케일이 yyyy-mm-dd 를 준다.
 *
 * @returns Date string in yyyy-mm-dd format
 */
export function getKoreanToday(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/**
 * Resolve both startDate and endDate, handling "today" keyword
 *
 * @param startDate - Start date string or "today"
 * @param endDate - End date string or "today"
 * @returns Object with resolved dates
 */
export function resolveDateRange(startDate: string, endDate: string): {
  startDate: string;
  endDate: string;
} {
  return {
    startDate: resolveDate(startDate),
    endDate: resolveDate(endDate),
  };
}
