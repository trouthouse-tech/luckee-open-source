/**
 * Converts a date to a timestamp in milliseconds.
 *
 * @param date - Date object, ISO string, or undefined
 * @returns Timestamp in milliseconds, or 0 if date is undefined or invalid
 */
export const toTimestamp = (date: Date | string | undefined): number => {
  if (!date) return 0;
  if (typeof date === 'string') return new Date(date).getTime();
  return date.getTime();
};
