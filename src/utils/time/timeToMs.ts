/**
 * Convert hours or minutes to milliseconds
 * @param value - numeric value
 * @param unit - 'hours' or 'minutes'
 */
export const timeToMs = (
  value: number,
  unit: 'hours' | 'minutes'
): number => {
  if (unit === 'hours') return value * 60 * 60 * 1000;
  return value * 60 * 1000;
};
