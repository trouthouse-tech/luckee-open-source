'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { CustomerBuilderActions } from '@/src/store/builders/customerBuilder';
import { ProjectBuilderActions } from '@/src/store/builders/projectBuilder';
import { CurrentProjectActions } from '@/src/store/current/currentProject';
import { createProjectThunk } from '@/src/store/thunks/projects';

const DEFAULT_COLORS = [
  '#2563eb',
  '#dc2626',
  '#16a34a',
  '#ca8a04',
  '#db2777',
  '#0284c7',
];

export const CreateProjectModal = () => {
  const dispatch = useAppDispatch();
  const projectBuilder = useAppSelector((state) => state.projectBuilder);
  const currentProject = useAppSelector((state) => state.currentProject);
  const authUser = useAppSelector((state) => state.auth.user);
  const customers = useAppSelector((state) => state.customers);
  const customerList = Object.values(customers).filter(
    (c) => c.status === 'active' || c.status === 'pending_review'
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleClose = () => {
    dispatch(ProjectBuilderActions.closeCreateModal());
    dispatch(CustomerBuilderActions.closeAddProjectModal());
    dispatch(CurrentProjectActions.reset());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser?.id) return;
    const name = (currentProject?.name ?? '').trim();
    if (!name) {
      dispatch(ProjectBuilderActions.setErrorMessage('Project name is required'));
      return;
    }
    const customerId = currentProject?.customer_id ?? null;
    if (!customerId) {
      dispatch(
        ProjectBuilderActions.setErrorMessage('Please select a customer')
      );
      return;
    }
    dispatch(
      createProjectThunk({
        user_id: authUser.id,
        customer_id: customerId,
        name,
        color: currentProject?.color ?? DEFAULT_COLORS[0],
        is_active: true,
      })
    );
  };

  if (!projectBuilder.isCreateModalOpen || !mounted) {
    return null;
  }

  const modalContent = (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>New Project</h2>
          <button
            type="button"
            onClick={handleClose}
            className={styles.closeButton}
            disabled={projectBuilder.isSaving}
          >
            ×
          </button>
        </div>

        {projectBuilder.errorMessage && (
          <div className={styles.error}>{projectBuilder.errorMessage}</div>
        )}

        <form onSubmit={handleSubmit} className={styles.content}>
          <div className={styles.field}>
            <label className={styles.label}>Customer *</label>
            <select
              value={currentProject?.customer_id ?? ''}
              onChange={(e) =>
                dispatch(
                  CurrentProjectActions.updateField({
                    customer_id: e.target.value || null,
                  })
                )
              }
              className={styles.input}
            >
              <option value="">Select customer...</option>
              {customerList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Name *</label>
            <input
              type="text"
              value={currentProject?.name ?? ''}
              onChange={(e) =>
                dispatch(
                  CurrentProjectActions.updateField({ name: e.target.value })
                )
              }
              className={styles.input}
              placeholder="Project name"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Color</label>
            <div className={styles.colorRow}>
              {DEFAULT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() =>
                    dispatch(CurrentProjectActions.updateField({ color: c }))
                  }
                  className={styles.colorButton}
                  style={{
                    backgroundColor: c,
                    borderWidth:
                      (currentProject?.color ?? DEFAULT_COLORS[0]) === c
                        ? 3
                        : 1,
                    borderColor:
                      (currentProject?.color ?? DEFAULT_COLORS[0]) === c
                        ? '#1f2937'
                        : '#e5e7eb',
                  }}
                />
              ))}
            </div>
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
              disabled={projectBuilder.isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={projectBuilder.isSaving}
            >
              {projectBuilder.isSaving ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
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
    w-full max-w-md rounded border border-gray-300 bg-white shadow-xl
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
    hover:text-gray-600 hover:bg-gray-100 disabled:opacity-50
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
  input: `
    w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  `,
  colorRow: `
    flex flex-wrap gap-2
  `,
  colorButton: `
    h-8 w-8 cursor-pointer rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
  `,
  actions: `
    flex justify-end gap-2 border-t border-gray-300 pt-4
  `,
  cancelButton: `
    rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700
    bg-white hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500
  `,
  saveButton: `
    rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white
    hover:bg-blue-700 disabled:opacity-50
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
  `,
};
