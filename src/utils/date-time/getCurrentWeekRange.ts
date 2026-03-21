/**
 * Get the current week range (Monday 00:00 through Sunday 00:00).
 * Uses local time. End date is Sunday start-of-day; callers typically use end-of-day for inclusive filtering.
 */
export const getCurrentWeekRange = (): { start: Date; end: Date } => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysToMonday = (dayOfWeek + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - daysToMonday);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(0, 0, 0, 0);
  return { start: monday, end: sunday };
};
