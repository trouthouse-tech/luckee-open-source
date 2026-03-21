'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { TimeEntryBuilderActions } from '@/src/store/builders/timeEntryBuilder';
import { CurrentTimeEntryActions } from '@/src/store/current/currentTimeEntry';
import { saveTimeEntryThunk } from '@/src/store/thunks/time-entries';
import { TipTapEditor } from '../tip-tap';
import { timeToMs } from '@/src/utils/time';

export const TimeEntryModal = () => {
  const dispatch = useAppDispatch();
  const timeEntryBuilder = useAppSelector((state) => state.timeEntryBuilder);
  const currentTimeEntry = useAppSelector((state) => state.currentTimeEntry);
  const projects = useAppSelector((state) => state.projects);
  const customers = useAppSelector((state) => state.customers);
  const [mounted, setMounted] = useState(false);
  const [useMinutes, setUseMinutes] = useState(false);
  const [timeInputValue, setTimeInputValue] = useState<string>('');

  const isOpen =
    timeEntryBuilder.isCreateModalOpen || timeEntryBuilder.isEditModalOpen;
  const isEdit = !!currentTimeEntry?.id;

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen && currentTimeEntry?.time != null) {
      if (useMinutes) {
        setTimeInputValue(String(Math.round(currentTimeEntry.time / 60000)));
      } else {
        setTimeInputValue(
          (currentTimeEntry.time / (1000 * 60 * 60)).toFixed(2)
        );
      }
    } else if (isOpen) {
      setTimeInputValue('');
    }
  }, [isOpen, currentTimeEntry?.time, useMinutes]);

  const handleClose = () => {
    dispatch(TimeEntryBuilderActions.closeCreateModal());
    dispatch(TimeEntryBuilderActions.closeEditModal());
    dispatch(CurrentTimeEntryActions.reset());
  };

  const handleSave = () => {
    const num = parseFloat(timeInputValue);
    if (isNaN(num) || num <= 0) {
      dispatch(
        TimeEntryBuilderActions.setErrorMessage(
          'Please enter a valid time (greater than 0)'
        )
      );
      return;
    }
    const timeMs = timeToMs(num, useMinutes ? 'minutes' : 'hours');
    dispatch(CurrentTimeEntryActions.updateField({ time: timeMs }));
    dispatch(saveTimeEntryThunk());
  };

  const projectList = Object.values(projects)
    .filter((p) => p.is_active)
    .map((p) => {
      const customerName = p.customer_id
        ? customers[p.customer_id]?.name ?? null
        : null;
      return {
        ...p,
        displayName: customerName ? `${p.name} (${customerName})` : p.name,
      };
    });
  const selectedDate = currentTimeEntry?.date
    ? new Date(currentTimeEntry.date)
    : new Date();

  if (!isOpen || !mounted) {
    return null;
  }

  const modalContent = (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {isEdit ? 'Edit Time Entry' : 'New Time Entry'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className={styles.closeButton}
            disabled={timeEntryBuilder.isSaving}
          >
            ×
          </button>
        </div>

        {timeEntryBuilder.errorMessage && (
          <div className={styles.error}>{timeEntryBuilder.errorMessage}</div>
        )}

        <div className={styles.content}>
          <div className={styles.field}>
            <label className={styles.label}>Project *</label>
            <select
              value={currentTimeEntry?.project_id ?? ''}
              onChange={(e) =>
                dispatch(
                  CurrentTimeEntryActions.updateField({
                    project_id: e.target.value,
                  })
                )
              }
              className={styles.select}
            >
              <option value="">Select project...</option>
              {projectList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.displayName}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Date Worked *</label>
            <input
              type="date"
              value={selectedDate.toISOString().slice(0, 10)}
              onChange={(e) => {
                const v = e.target.value;
                if (v) {
                  dispatch(
                    CurrentTimeEntryActions.updateField({
                      date: new Date(v).toISOString(),
                    })
                  );
                }
              }}
              className={styles.dateInput}
            />
          </div>

          <div className={styles.field}>
            <div className={styles.timeLabelRow}>
              <label className={styles.label}>
                {useMinutes ? 'Minutes' : 'Hours'} *
              </label>
              <button
                type="button"
                onClick={() => setUseMinutes((v) => !v)}
                className={styles.toggleButton}
              >
                {useMinutes ? 'Switch to Hours' : 'Switch to Minutes'}
              </button>
            </div>
            <input
              type="number"
              min="0"
              step={useMinutes ? 1 : 0.25}
              value={timeInputValue}
              onChange={(e) => setTimeInputValue(e.target.value)}
              className={styles.input}
              placeholder={useMinutes ? '30' : '1.5'}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Title</label>
            <input
              type="text"
              value={currentTimeEntry?.title ?? ''}
              onChange={(e) =>
                dispatch(
                  CurrentTimeEntryActions.updateField({ title: e.target.value })
                )
              }
              className={styles.input}
              placeholder="Brief title"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description * (min 10 characters)</label>
            <TipTapEditor
              content={currentTimeEntry?.description ?? ''}
              onChange={(html) =>
                dispatch(
                  CurrentTimeEntryActions.updateField({ description: html })
                )
              }
              placeholder="What did you work on?"
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
              disabled={timeEntryBuilder.isSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={styles.saveButton}
              disabled={timeEntryBuilder.isSaving}
            >
              {timeEntryBuilder.isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

const styles = {
  overlay: `
    fixed inset-0 z-50 flex items-center justify-center bg-black/50
  `,
  modal: `
    w-full max-w-2xl max-h-[90vh] overflow-y-auto
    rounded border border-gray-300 bg-white shadow-xl
  `,
  header: `
    flex items-center justify-between border-b border-gray-300 px-6 py-4
  `,
  title: `
    text-xl font-semibold text-gray-900
  `,
  closeButton: `
    rounded p-1 text-2xl text-gray-400
    bg-transparent border-none cursor-pointer
    hover:text-gray-600 hover:bg-gray-100
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-blue-500
  `,
  error: `
    mx-6 mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700
  `,
  content: `
    space-y-4 px-6 py-4
  `,
  field: `
    flex flex-col gap-1.5
  `,
  label: `
    text-sm font-medium text-gray-700
  `,
  timeLabelRow: `
    flex items-center justify-between
  `,
  toggleButton: `
    text-xs font-medium text-blue-600 hover:text-blue-800 focus:outline-none
  `,
  select: `
    w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  `,
  input: `
    w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  `,
  dateInput: `
    w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  `,
  actions: `
    flex justify-end gap-2 border-t border-gray-300 pt-4
  `,
  cancelButton: `
    rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700
    bg-white hover:bg-gray-50
    disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500
  `,
  saveButton: `
    rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white
    hover:bg-blue-700
    disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
  `,
};
