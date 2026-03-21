'use client';

import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { CurrentLeadContactEmailActions } from '@/src/store/current';

export const EmailSubjectInput = () => {
  const dispatch = useAppDispatch();
  const subject = useAppSelector((s) => s.currentLeadContactEmail.subject);
  return (
    <label className={styles.wrap}>
      <span className={styles.label}>Subject</span>
      <input
        type="text"
        value={subject}
        onChange={(e) =>
          dispatch(CurrentLeadContactEmailActions.setSubject(e.target.value))
        }
        className={styles.input}
        placeholder="Email subject"
      />
    </label>
  );
};

const styles = {
  wrap: `flex flex-col gap-1`,
  label: `text-xs font-medium text-gray-600`,
  input: `
    w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
    focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 outline-none
  `,
};
