'use client';

import { msToTime } from '@/src/utils/time';

type SummaryValuesProps = {
  totalMs: number;
};

export const SummaryValues = (props: SummaryValuesProps) => {
  const { totalMs } = props;
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <span className={styles.label}>Total hours</span>
        <span className={styles.value}>{msToTime(totalMs)}</span>
      </div>
    </div>
  );
};

const styles = {
  wrapper: `
    flex gap-3 border-b border-gray-300 p-4
  `,
  card: `
    rounded border border-gray-300 bg-gray-50 px-4 py-2.5
  `,
  label: `
    block text-xs font-medium text-gray-500
  `,
  value: `
    block text-lg font-semibold text-gray-900
  `,
};
