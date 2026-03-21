/**
 * Format date for display (e.g. "Jan 15, 2025")
 */
export const formatDateMedium = (date: string | Date): string => {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return String(date);
    return d.toLocaleDateString(undefined, { dateStyle: 'medium' });
  } catch {
    return String(date);
  }
};
