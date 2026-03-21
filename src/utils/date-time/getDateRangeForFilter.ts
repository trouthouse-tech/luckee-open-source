export type DateRangeFilter =
  | 'today'
  | 'yesterday'
  | 'this_week'
  | 'last_week'
  | 'l30'
  | null;

export type DateRange = {
  start: number;
  end: number;
};

const getStartOfDay = (date: Date): number => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const getEndOfDay = (date: Date): number => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
};

const getMondayOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

export const getTodayRange = (): DateRange => {
  const today = new Date();
  return { start: getStartOfDay(today), end: getEndOfDay(today) };
};

export const getYesterdayRange = (): DateRange => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return { start: getStartOfDay(yesterday), end: getEndOfDay(yesterday) };
};

export const getThisWeekRange = (): DateRange => {
  const today = new Date();
  const monday = getMondayOfWeek(today);
  return { start: getStartOfDay(monday), end: getEndOfDay(today) };
};

export const getLastWeekRange = (): DateRange => {
  const today = new Date();
  const lastMonday = getMondayOfWeek(today);
  lastMonday.setDate(lastMonday.getDate() - 7);
  const lastSunday = new Date(lastMonday);
  lastSunday.setDate(lastSunday.getDate() + 6);
  return {
    start: getStartOfDay(lastMonday),
    end: getEndOfDay(lastSunday),
  };
};

export const getLast30DaysRange = (): DateRange => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return { start: getStartOfDay(thirtyDaysAgo), end: getEndOfDay(today) };
};

/**
 * Get date range for a given filter type (milliseconds).
 */
export const getDateRangeForFilter = (
  filter: DateRangeFilter
): DateRange | null => {
  if (!filter) return null;
  switch (filter) {
    case 'today':
      return getTodayRange();
    case 'yesterday':
      return getYesterdayRange();
    case 'this_week':
      return getThisWeekRange();
    case 'last_week':
      return getLastWeekRange();
    case 'l30':
      return getLast30DaysRange();
    default:
      return null;
  }
};
