/**
 * Get 7 dates starting from weekStart (inclusive)
 * @param weekStart - ISO date string or Date for the first day of the week
 */
export const getWeekDates = (weekStart: string | Date): string[] => {
  const start = typeof weekStart === 'string' ? new Date(weekStart) : weekStart;
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
};
