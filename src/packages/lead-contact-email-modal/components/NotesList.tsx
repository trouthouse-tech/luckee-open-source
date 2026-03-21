'use client';

import { StickyNote } from 'lucide-react';
import { useAppSelector } from '@/src/store/hooks';

/** Modal left column: show contact notes blob (no notes API). */
export const NotesList = () => {
  const notes = useAppSelector((s) => s.currentLeadContact.notes);
  if (!notes?.trim()) {
    return (
      <div className={styles.empty}>
        <StickyNote className={styles.icon} />
        <p className={styles.text}>No notes on this contact.</p>
      </div>
    );
  }
  return (
    <div className={styles.box}>
      <h3 className={styles.h}>Notes</h3>
      <p className={styles.body}>{notes}</p>
    </div>
  );
};

const styles = {
  empty: `mt-4 flex flex-col items-center text-center py-6 text-gray-400`,
  icon: `h-8 w-8 mb-2 opacity-50`,
  text: `text-sm`,
  box: `mt-4`,
  h: `text-xs font-semibold text-gray-500 uppercase mb-2`,
  body: `text-sm text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto`,
};
