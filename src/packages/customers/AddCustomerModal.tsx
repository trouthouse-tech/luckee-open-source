'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { CustomerBuilderActions } from '@/src/store/builders/customerBuilder';
import { createCustomerThunk } from '@/src/store/thunks/customers';

/**
 * Simple Add Customer modal. Requires only name (user_id comes from auth).
 * Matches mentorai-mobile createCustomer(userId, name) and luckee-web API { user_id, name }.
 */
export const AddCustomerModal = () => {
  const dispatch = useAppDispatch();
  const customerBuilder = useAppSelector((state) => state.customerBuilder);
  const user = useAppSelector((state) => state.auth.user);
  const [name, setName] = useState('');

  const handleClose = () => {
    dispatch(CustomerBuilderActions.closeAddModal());
    setName('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || !user?.id) return;

    dispatch(
      createCustomerThunk({
        user_id: user.id,
        name: trimmed,
      })
    );
  };

  if (!customerBuilder.isAddModalOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add Customer</h2>
          <button
            type="button"
            onClick={handleClose}
            className={styles.closeButton}
            disabled={customerBuilder.isSaving}
          >
            ×
          </button>
        </div>

        {customerBuilder.errorMessage && (
          <div className={styles.error}>{customerBuilder.errorMessage}</div>
        )}

        <form onSubmit={handleSubmit} className={styles.content}>
          <label className={styles.label} htmlFor="customer-name">
            Name
          </label>
          <input
            id="customer-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Customer name"
            className={styles.input}
            disabled={customerBuilder.isSaving}
            autoFocus
          />
          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
              disabled={customerBuilder.isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!name.trim() || customerBuilder.isSaving}
            >
              {customerBuilder.isSaving ? 'Saving…' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: `
    fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50
  `,
  modal: `
    bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden
    text-gray-900 border border-gray-300
  `,
  header: `
    flex items-center justify-between px-6 py-4 border-b border-gray-300
  `,
  title: `
    text-xl font-semibold text-gray-900
  `,
  closeButton: `
    text-2xl text-gray-400 hover:text-gray-600 transition-colors
    disabled:opacity-50 disabled:cursor-not-allowed
    bg-transparent border-none cursor-pointer
  `,
  error: `
    mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded text-sm text-red-700
  `,
  content: `
    px-6 py-4
  `,
  label: `
    block text-sm font-medium text-gray-700 mb-1
  `,
  input: `
    w-full px-3 py-2 border border-gray-300 rounded text-gray-900
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed mb-4
  `,
  actions: `
    flex justify-end gap-2
  `,
  cancelButton: `
    px-4 py-2 rounded border border-gray-300 text-gray-700
    hover:bg-gray-50 transition-colors disabled:opacity-50
  `,
  submitButton: `
    px-4 py-2 rounded bg-blue-600 text-white font-medium
    hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
  `,
};
