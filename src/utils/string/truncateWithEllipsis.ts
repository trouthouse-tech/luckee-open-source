/**
 * Truncate a string to a maximum length and append ellipsis if truncated.
 *
 * @param content - String to truncate
 * @param maxLength - Maximum length before truncation (default 100)
 * @returns Original string if within limit, otherwise truncated string ending with "..."
 * @example
 * truncateWithEllipsis('Short') // "Short"
 * truncateWithEllipsis('A'.repeat(150), 100) // "AAA... (100 chars + ...)"
 */
export const truncateWithEllipsis = (content: string, maxLength = 100): string => {
  if (content.length <= maxLength) return content;
  return `${content.substring(0, maxLength)}...`;
};
