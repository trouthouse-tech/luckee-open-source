'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/src/store/hooks';
import { TicketBuilderActions } from '@/src/store/builders/ticketBuilder';
import { updateTicketThunk, setCurrentTicketThunk } from '@/src/store/thunks';
import { formatDateMedium } from '@/src/utils/date-time';
import type { Ticket, TicketStatus } from '@/src/model/ticket/Ticket';

type TicketRowProps = {
  ticket: Ticket;
};

const STATUS_OPTIONS: { value: TicketStatus; label: string; color: string }[] = [
  { value: 'todo', label: 'To Do', color: 'bg-gray-100 text-gray-800' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'done', label: 'Done', color: 'bg-green-100 text-green-800' },
];

const PRIORITY_CONFIG = {
  low: { label: 'Low', color: 'bg-blue-100 text-blue-800' },
  medium: { label: 'Medium', color: 'bg-orange-100 text-orange-800' },
  high: { label: 'High', color: 'bg-red-100 text-red-800' },
};

export const TicketRow = (props: TicketRowProps) => {
  const { ticket } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const handlePress = () => {
    void dispatch(setCurrentTicketThunk(ticket.id));
    router.push('/tickets/detail');
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    void dispatch(setCurrentTicketThunk(ticket.id));
    router.push('/tickets/detail');
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    void dispatch(setCurrentTicketThunk(ticket.id));
    dispatch(TicketBuilderActions.openDeleteModal());
  };

  const handleStatusChange = async (newStatus: TicketStatus) => {
    setIsStatusDropdownOpen(false);
    await dispatch(updateTicketThunk(ticket.id, { status: newStatus }));
  };

  const currentStatusConfig = STATUS_OPTIONS.find((opt) => opt.value === ticket.status) || STATUS_OPTIONS[0];
  const priorityConfig = PRIORITY_CONFIG[ticket.priority];

  return (
    <tr className={styles.row} role="button" tabIndex={0}>
      <td className={styles.cell} onClick={handlePress}>
        <span className={styles.titleText}>{ticket.title}</span>
      </td>
      <td className={styles.cell} onClick={(e) => e.stopPropagation()}>
        <div className={styles.dropdownContainer}>
          <button
            type="button"
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            className={`${styles.badge} ${currentStatusConfig.color} ${styles.dropdownButton}`}
          >
            {currentStatusConfig.label}
            <span className={styles.dropdownArrow}>▼</span>
          </button>
          {isStatusDropdownOpen && (
            <>
              <div
                className={styles.dropdownOverlay}
                onClick={() => setIsStatusDropdownOpen(false)}
              />
              <div className={styles.dropdownMenu}>
                {STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleStatusChange(option.value)}
                    className={`${styles.dropdownItem} ${
                      option.value === ticket.status ? styles.dropdownItemActive : ''
                    }`}
                  >
                    <span className={`${styles.badge} ${option.color}`}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </td>
      <td className={styles.cell} onClick={handlePress}>
        <span className={`${styles.badge} ${priorityConfig.color}`}>
          {priorityConfig.label}
        </span>
      </td>
      <td className={styles.cell} onClick={handlePress}>
        {formatDateMedium(ticket.created_at)}
      </td>
      <td className={`${styles.cell} ${styles.actionsCell}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.actions}>
          <button
            onClick={handleEditClick}
            className={styles.actionButton}
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={handleDeleteClick}
            className={styles.actionButton}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </td>
    </tr>
  );
};

const styles = {
  row: `
    hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0
  `,
  cell: `
    px-3 py-2 text-xs text-gray-700 cursor-pointer
  `,
  actionsCell: `
    cursor-default
  `,
  titleText: `
    font-medium text-gray-900
  `,
  badge: `
    inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium
  `,
  dropdownContainer: `
    relative inline-block
  `,
  dropdownButton: `
    cursor-pointer hover:opacity-80 transition-opacity
    flex items-center gap-1
  `,
  dropdownArrow: `
    text-[8px] ml-0.5
  `,
  dropdownOverlay: `
    fixed inset-0 z-10
  `,
  dropdownMenu: `
    absolute left-0 mt-1 w-32 bg-white border border-gray-200 
    rounded-md shadow-lg z-20 py-1
  `,
  dropdownItem: `
    w-full text-left px-3 py-2 text-xs hover:bg-gray-50 
    transition-colors flex items-center
  `,
  dropdownItemActive: `
    bg-gray-50
  `,
  actions: `
    flex items-center gap-2
  `,
  actionButton: `
    p-1 hover:bg-gray-200 rounded transition-colors
  `,
};
