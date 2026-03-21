'use client';

import type { Lead } from '@/src/model';

type LeadRowMenuProps = {
  lead: Lead;
  onClose: () => void;
  onView: () => void;
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
};

export const LeadRowMenu = (props: LeadRowMenuProps) => {
  const { lead, onClose, onView, onEdit, onArchive, onDelete } = props;
  const name = lead.business_name || lead.name || 'Lead';

  return (
    <div
      className={styles.menu}
      role="menu"
      aria-label={`Actions for ${name}`}
    >
      <button
        type="button"
        onClick={() => {
          onClose();
          onView();
        }}
        className={styles.menuItem}
        role="menuitem"
      >
        View
      </button>
      <button
        type="button"
        onClick={() => {
          onClose();
          onEdit();
        }}
        className={styles.menuItem}
        role="menuitem"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => {
          onClose();
          onArchive();
        }}
        className={styles.menuItem}
        role="menuitem"
      >
        Archive
      </button>
      <button
        type="button"
        onClick={() => {
          onClose();
          onDelete();
        }}
        className={styles.menuItemDanger}
        role="menuitem"
      >
        Delete
      </button>
    </div>
  );
};

const styles = {
  menu: `
    absolute right-0 top-full mt-1 z-50 min-w-40
    bg-white border border-gray-200 rounded shadow-lg py-1
  `,
  menuItem: `
    w-full text-left px-3 py-2 text-sm text-gray-700
    hover:bg-gray-100 transition-colors
    border-none bg-transparent cursor-pointer
  `,
  menuItemDanger: `
    w-full text-left px-3 py-2 text-sm text-red-600
    hover:bg-red-50 transition-colors
    border-none bg-transparent cursor-pointer
  `,
};
