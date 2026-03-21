'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { updateLeadContactThunk } from '@/src/store/thunks/lead-contacts';
import { formatDateMedium } from '@/src/utils/date-time';

type Props = { isActive?: boolean };

/**
 * Uses `lead_contacts.notes` (no separate notes API on this backend).
 */
export const LeadContactNotesSection = (props: Props) => {
  const { isActive = true } = props;
  const dispatch = useAppDispatch();
  const contact = useAppSelector((s) => s.currentLeadContact);
  const [draft, setDraft] = useState(contact.notes ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(contact.notes ?? '');
  }, [contact.id, contact.notes]);

  if (!isActive) return null;

  const save = async () => {
    setSaving(true);
    await dispatch(
      updateLeadContactThunk(
        contact.id,
        { notes: draft.trim() || null },
        { preserveCurrent: true }
      )
    );
    setSaving(false);
  };

  return (
    <div className={styles.shell}>
      <div className={styles.editor}>
        <label className={styles.label}>Notes</label>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className={styles.textarea}
          rows={5}
          placeholder="Research, call outcomes, context…"
        />
        <div className={styles.row}>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className={styles.save}
          >
            {saving ? 'Saving…' : 'Save notes'}
          </button>
          {contact.updated_at && (
            <span className={styles.hint}>
              Last updated {formatDateMedium(contact.updated_at)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  shell: `
    rounded-xl border border-gray-200 bg-white p-6 shadow-sm
  `,
  editor: `space-y-2`,
  label: `text-sm font-medium text-gray-700`,
  textarea: `
    w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-y min-h-[120px]
    focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none
  `,
  row: `flex flex-wrap items-center gap-3`,
  save: `
    px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg
    hover:bg-gray-900 border-none cursor-pointer disabled:opacity-50
  `,
  hint: `text-xs text-gray-500`,
};
