'use client';

type LeadDeleteConfirmModalProps = {
  show: boolean;
  leadDisplayName: string;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
};

export const LeadDeleteConfirmModal = (props: LeadDeleteConfirmModalProps) => {
  const {
    show,
    leadDisplayName,
    onCancel,
    onConfirm,
    isDeleting,
  } = props;

  if (!show) return null;

  return (
    <div className={styles.confirmOverlay}>
      <div className={styles.confirmModal}>
        <h3 className={styles.confirmTitle}>Delete Lead</h3>
        <p className={styles.confirmMessage}>
          Are you sure you want to delete <strong>{leadDisplayName}</strong>?
          This action cannot be undone.
        </p>
        <div className={styles.confirmButtons}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.confirmCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={styles.confirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  confirmOverlay: `
    fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4
  `,
  confirmModal: `bg-white rounded-lg shadow-xl max-w-md w-full p-6`,
  confirmTitle: `text-lg font-semibold text-gray-900 mb-2`,
  confirmMessage: `text-sm text-gray-700 mb-4`,
  confirmButtons: `flex justify-end gap-2`,
  confirmCancel: `
    px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded
    hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
  `,
  confirmDelete: `
    px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700
    transition-colors focus:outline-none focus:ring-2 focus:ring-red-500
    disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer
  `,
};
