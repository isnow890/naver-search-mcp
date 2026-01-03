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
 * KST is UTC+9
 *
 * @returns Date string in yyyy-mm-dd format
 */
export function getKoreanToday(): string {
  const now = new Date();

  // Convert to KST (UTC+9)
  const kstOffset = 9 * 60 * 60 * 1000; // 9 hours in milliseconds
  const kstTime = new Date(now.getTime() + kstOffset + (now.getTimezoneOffset() * 60 * 1000));

  const year = kstTime.getUTCFullYear();
  const month = String(kstTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(kstTime.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
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
