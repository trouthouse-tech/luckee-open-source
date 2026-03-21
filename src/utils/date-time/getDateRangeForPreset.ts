/**
 * Preset period keys for the date selector (reference date + preset).
 */
export type DateRangePreset =
  | 'yesterday'
  | 'last_3_days'
  | 'week_to_date'
  | 'this_week'
  | 'last_week'
  | 'month_to_date'
  | 'last_month';

/**
 * Get start and end date (YYYY-MM-DD) for a reference date and preset.
 * Week = Monday–Sunday (local time).
 *
 * @param referenceDateStr - Reference date in YYYY-MM-DD
 * @param preset - Preset key
 * @returns { start, end } in YYYY-MM-DD
 */
const toYmd = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const getDateRangeForPreset = (
  referenceDateStr: string,
  preset: DateRangePreset
): { start: string; end: string } => {
  const ref = new Date(referenceDateStr + 'T12:00:00');

  const dayOfWeek = ref.getDay();
  const daysToMonday = (dayOfWeek + 6) % 7;
  const monday = new Date(ref);
  monday.setDate(ref.getDate() - daysToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  switch (preset) {
    case 'yesterday': {
      const y = new Date(ref);
      y.setDate(ref.getDate() - 1);
      return { start: toYmd(y), end: toYmd(y) };
    }
    case 'last_3_days': {
      const end = new Date(ref);
      end.setDate(ref.getDate() - 1);
      const start = new Date(end);
      start.setDate(end.getDate() - 2);
      return { start: toYmd(start), end: toYmd(end) };
    }
    case 'week_to_date':
      return { start: toYmd(monday), end: toYmd(ref) };
    case 'this_week':
      return { start: toYmd(monday), end: toYmd(sunday) };
    case 'last_week': {
      const lastMon = new Date(monday);
      lastMon.setDate(monday.getDate() - 7);
      const lastSun = new Date(lastMon);
      lastSun.setDate(lastMon.getDate() + 6);
      return { start: toYmd(lastMon), end: toYmd(lastSun) };
    }
    case 'month_to_date': {
      const first = new Date(ref.getFullYear(), ref.getMonth(), 1);
      return { start: toYmd(first), end: toYmd(ref) };
    }
    case 'last_month': {
      const first = new Date(ref.getFullYear(), ref.getMonth() - 1, 1);
      const last = new Date(ref.getFullYear(), ref.getMonth(), 0);
      return { start: toYmd(first), end: toYmd(last) };
    }
    default:
      return { start: toYmd(ref), end: toYmd(ref) };
  }
};
