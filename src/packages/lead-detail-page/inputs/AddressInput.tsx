'use client';

import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { CurrentLeadActions } from '@/src/store/current';

export const AddressInput = () => {
  const dispatch = useAppDispatch();
  const currentLead = useAppSelector((state) => state.currentLead);

  return (
    <label className={styles.fieldGroupFull}>
      <span className={styles.label}>Address</span>
      <input
        type="text"
        value={currentLead?.address ?? ''}
        onChange={(e) =>
          dispatch(
            CurrentLeadActions.updateCurrentLead({
              address: e.target.value || null,
            })
          )
        }
        className={styles.input}
        placeholder="Address"
      />
    </label>
  );
};

const styles = {
  fieldGroupFull: `flex flex-col gap-1`,
  label: `text-xs font-medium text-gray-600`,
  input: `
    px-2.5 py-1.5 text-sm border border-gray-300 rounded
    focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none
  `,
};
