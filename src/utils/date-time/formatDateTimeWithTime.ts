/**
 * Format date and time for list display (e.g. "Jan 27, 2026, 2:36 PM").
 *
 * @param date - ISO date string, Date, or undefined
 * @returns Formatted string or "—" if invalid
 */
export const formatDateTimeWithTime = (
  date: Date | string | undefined
): string => {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};
