'use client';

import { useAppSelector } from '@/src/store/hooks';
import { formatDateMedium } from '@/src/utils/date-time';
import { getCustomerName } from '@/src/utils/customer';
import { msToTime } from '@/src/utils/time';
import type { TimeEntry } from '@/src/model/time-entry/TimeEntry';

type TimeEntryRowProps = {
  entry: TimeEntry;
};

export const TimeEntryRow = (props: TimeEntryRowProps) => {
  const { entry } = props;
  const customers = useAppSelector((state) => state.customers);

  return (
    <tr className={styles.row}>
      <td className={styles.cell}>{formatDateMedium(entry.date)}</td>
      <td className={styles.cell}>{msToTime(entry.time)}</td>
      <td className={styles.cell}>
        <span className={styles.nameText}>{entry.title}</span>
      </td>
      <td className={styles.cell}>{getCustomerName(customers, entry.customer_id)}</td>
      <td className={styles.cell}>{formatDateMedium(entry.created_at)}</td>
    </tr>
  );
};

const styles = {
  row: `
    hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0
  `,
  cell: `
    px-3 py-2 text-xs text-gray-700
  `,
  nameText: `
    font-medium text-gray-900
  `,
};
