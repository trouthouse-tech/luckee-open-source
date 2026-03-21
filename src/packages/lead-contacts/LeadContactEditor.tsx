'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {
  createLeadContactThunk,
  updateLeadContactThunk,
} from '@/src/store/thunks/lead-contacts';
import { CurrentLeadContactActions } from '@/src/store/current';

type LeadContactEditorProps = {
  leadId: string;
  onCancel: () => void;
  onSaveComplete: () => void;
};

export const LeadContactEditor = ({
  leadId,
  onCancel,
  onSaveComplete,
}: LeadContactEditorProps) => {
  const dispatch = useAppDispatch();
  const currentLeadContact = useAppSelector((state) => state.currentLeadContact);
  const [isSaving, setIsSaving] = useState(false);

  const name = currentLeadContact.name ?? '';
  const email = currentLeadContact.email ?? '';
  const phone = currentLeadContact.phone ?? '';
  const role = currentLeadContact.role ?? '';
  const notes = currentLeadContact.notes ?? '';

  const handleSave = async () => {
    if (!name?.trim() && !email?.trim() && !phone?.trim()) {
      alert('Please enter at least one field (name, email, or phone)');
      return;
    }

    setIsSaving(true);

    if (currentLeadContact.id && currentLeadContact.id !== '') {
      const result = await dispatch(
        updateLeadContactThunk(currentLeadContact.id, {
          name: name.trim() || '',
          email: email.trim() || null,
          phone: phone.trim() || null,
          role: role.trim() || null,
          notes: notes.trim() || null,
        })
      );
      if (result === 200) {
        onSaveComplete();
      }
    } else {
      const result = await dispatch(
        createLeadContactThunk({
          lead_id: leadId,
          name: name.trim() || 'Unknown',
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          role: role.trim() || undefined,
          notes: notes.trim() || undefined,
        })
      );
      if (result === 200) {
        onSaveComplete();
      }
    }

    setIsSaving(false);
  };

  return (
    <div className={styles.section}>
      <div className={styles.editorHeader}>
        <h2 className={styles.title}>
          {currentLeadContact.id && currentLeadContact.id !== ''
            ? 'Edit Contact'
            : 'New Contact'}
        </h2>
        <div className={styles.editorActions}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={styles.saveButton}
          >
            {isSaving ? 'Saving…' : 'Save Contact'}
          </button>
        </div>
      </div>

      <div className={styles.editorLayout}>
        <div className={styles.leftColumn}>
          <label className={styles.fieldGroup}>
            <span className={styles.label}>Name *</span>
            <input
              type="text"
              value={name}
              onChange={(e) =>
                dispatch(
                  CurrentLeadContactActions.updateCurrentLeadContact({
                    name: e.target.value,
                  })
                )
              }
              className={styles.input}
              placeholder="Contact name"
            />
          </label>
          <label className={styles.fieldGroup}>
            <span className={styles.label}>Role</span>
            <input
              type="text"
              value={role}
              onChange={(e) =>
                dispatch(
                  CurrentLeadContactActions.updateCurrentLeadContact({
                    role: e.target.value,
                  })
                )
              }
              className={styles.input}
              placeholder="e.g. CEO, Manager"
            />
          </label>
          <label className={styles.fieldGroup}>
            <span className={styles.label}>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) =>
                dispatch(
                  CurrentLeadContactActions.updateCurrentLeadContact({
                    email: e.target.value,
                  })
                )
              }
              className={styles.input}
              placeholder="email@example.com"
            />
          </label>
          <label className={styles.fieldGroup}>
            <span className={styles.label}>Phone</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                dispatch(
                  CurrentLeadContactActions.updateCurrentLeadContact({
                    phone: e.target.value,
                  })
                )
              }
              className={styles.input}
              placeholder="Phone number"
            />
          </label>
        </div>
        <div className={styles.rightColumn}>
          <label className={styles.fieldGroup}>
            <span className={styles.label}>Notes</span>
            <textarea
              value={notes}
              onChange={(e) =>
                dispatch(
                  CurrentLeadContactActions.updateCurrentLeadContact({
                    notes: e.target.value,
                  })
                )
              }
              className={styles.textarea}
              placeholder="Notes about this contact"
              rows={4}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

const styles = {
  section: `bg-white border border-gray-300 rounded p-4`,
  editorHeader: `flex items-center justify-between mb-4`,
  editorActions: `flex items-center gap-2`,
  title: `text-base font-semibold text-gray-900`,
  cancelButton: `
    px-3 py-1.5 text-sm font-medium text-gray-700
    hover:bg-gray-100 rounded transition-colors cursor-pointer border-none
  `,
  saveButton: `
    px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded
    hover:bg-blue-700 transition-colors cursor-pointer border-none
    disabled:bg-gray-300 disabled:cursor-not-allowed
  `,
  editorLayout: `grid grid-cols-1 md:grid-cols-3 gap-6`,
  leftColumn: `md:col-span-1 space-y-4`,
  rightColumn: `md:col-span-2`,
  fieldGroup: `flex flex-col gap-1`,
  label: `text-xs font-medium text-gray-600`,
  input: `
    px-2.5 py-1.5 text-sm border border-gray-300 rounded
    focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none
  `,
  textarea: `
    px-2.5 py-1.5 text-sm border border-gray-300 rounded resize-y
    focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none
  `,
};
