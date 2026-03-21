'use client';

import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { CurrentLeadActions } from '@/src/store/current';

export const NotesInput = () => {
  const dispatch = useAppDispatch();
  const currentLead = useAppSelector((state) => state.currentLead);

  return (
    <label className={styles.fieldGroupFull}>
      <span className={styles.label}>Notes</span>
      <textarea
        value={currentLead?.notes ?? ''}
        onChange={(e) =>
          dispatch(
            CurrentLeadActions.updateCurrentLead({
              notes: e.target.value || null,
            })
          )
        }
        className={styles.textarea}
        rows={3}
        placeholder="Notes"
      />
    </label>
  );
};

const styles = {
  fieldGroupFull: `flex flex-col gap-1`,
  label: `text-xs font-medium text-gray-600`,
  textarea: `
    px-2.5 py-1.5 text-sm border border-gray-300 rounded resize-y
    focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none
  `,
};
