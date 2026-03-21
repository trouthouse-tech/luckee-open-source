'use client';

import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { CurrentLeadActions } from '@/src/store/current';

export const PhoneInput = () => {
  const dispatch = useAppDispatch();
  const currentLead = useAppSelector((state) => state.currentLead);
  const value =
    currentLead?.phone ?? currentLead?.business_phone ?? '';

  return (
    <label className={styles.fieldGroup}>
      <span className={styles.label}>Phone</span>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const v = e.target.value || null;
          dispatch(
            CurrentLeadActions.updateCurrentLead({
              phone: v,
              business_phone: v,
            })
          );
        }}
        className={styles.input}
        placeholder="Phone"
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
