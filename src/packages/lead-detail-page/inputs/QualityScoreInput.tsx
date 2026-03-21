'use client';

import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { CurrentLeadActions } from '@/src/store/current';

export const QualityScoreInput = () => {
  const dispatch = useAppDispatch();
  const currentLead = useAppSelector((state) => state.currentLead);

  return (
    <label className={styles.fieldGroup}>
      <span className={styles.label}>Quality score</span>
      <input
        type="number"
        min={0}
        max={100}
        value={currentLead?.quality_score ?? ''}
        onChange={(e) => {
          const v = e.target.value;
          dispatch(
            CurrentLeadActions.updateCurrentLead({
              quality_score: v === '' ? null : Number(v),
            })
          );
        }}
        className={styles.input}
        placeholder="0–100"
      />
    </label>
  );
};

const styles = {
  fieldGroup: `flex flex-col gap-1`,
  label: `text-xs font-medium text-gray-600`,
  input: `
    px-2.5 py-1.5 text-sm border border-gray-300 rounded
    focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none
  `,
};
