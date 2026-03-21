/**
 * Format a date value for locale-aware display (e.g. table cells).
 * Accepts string, Date, or unknown; returns a readable date string or stringified value.
 *
 * @param dateString - Date as string, Date instance, or unknown
 * @returns Locale date string or string representation of the value
 * @example
 * formatDateLocale('2026-02-16T12:00:00Z') // "2/16/2026" (locale-dependent)
 * formatDateLocale(new Date()) // "2/16/2026"
 */
export const formatDateLocale = (dateString: unknown): string => {
  if (typeof dateString === 'string') {
    try {
      const d = new Date(dateString);
      return isNaN(d.getTime()) ? dateString : d.toLocaleDateString();
    } catch {
      return dateString;
    }
  }
  if (dateString instanceof Date) {
    return isNaN(dateString.getTime()) ? '' : dateString.toLocaleDateString();
  }
  return String(dateString ?? '');
};
