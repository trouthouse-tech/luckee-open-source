'use client';

import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { CurrentLeadActions } from '@/src/store/current';

export const BusinessNameInput = () => {
  const dispatch = useAppDispatch();
  const currentLead = useAppSelector((state) => state.currentLead);

  return (
    <label className={styles.fieldGroup}>
      <span className={styles.label}>Business name</span>
      <input
        type="text"
        value={currentLead?.business_name ?? ''}
        onChange={(e) =>
          dispatch(
            CurrentLeadActions.updateCurrentLead({
              business_name: e.target.value,
            })
          )
        }
        className={styles.input}
        placeholder="Enter business name"
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
