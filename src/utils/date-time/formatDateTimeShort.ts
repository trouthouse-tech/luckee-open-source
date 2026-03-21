/**
 * Format date and time for card/list display (e.g. "Jan 15, 2026 · 2:30 PM").
 *
 * @param dateString - ISO date string or Date
 * @returns Formatted string or empty if invalid
 * @example
 * formatDateTimeShort('2026-02-16T14:30:00Z') // "Feb 16, 2026 · 2:30 PM"
 */
export const formatDateTimeShort = (dateString: string | Date): string => {
  const d = typeof dateString === 'string' ? new Date(dateString) : dateString;
  if (isNaN(d.getTime())) return '';
  const date = d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const time = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${date} · ${time}`;
};
