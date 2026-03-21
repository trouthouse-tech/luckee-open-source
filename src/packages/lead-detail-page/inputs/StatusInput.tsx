'use client';

import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { CurrentLeadActions } from '@/src/store/current';
import type { Lead } from '@/src/model';

const STATUS_OPTIONS: { value: Lead['status']; label: string }[] = [
  { value: 'not_contacted', label: 'Not contacted' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'not_answered', label: 'Not answered' },
  { value: 'lost', label: 'Lost' },
  { value: 'archived', label: 'Archived' },
];

export const StatusInput = (props: { fallbackStatus: Lead['status'] }) => {
  const { fallbackStatus } = props;
  const dispatch = useAppDispatch();
  const currentLead = useAppSelector((state) => state.currentLead);

  return (
    <label className={styles.fieldGroup}>
      <span className={styles.label}>Status</span>
      <select
        value={currentLead?.status ?? fallbackStatus}
        onChange={(e) =>
          dispatch(
            CurrentLeadActions.updateCurrentLead({
              status: e.target.value as Lead['status'],
            })
          )
        }
        className={styles.select}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
};

const styles = {
  fieldGroup: `flex flex-col gap-1`,
  label: `text-xs font-medium text-gray-600`,
  select: `
    px-2.5 py-1.5 text-sm border border-gray-300 rounded bg-white
    focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none
  `,
};
