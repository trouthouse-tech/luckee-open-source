'use client';

import type { TimeEntry } from '@/src/model';
import type { Project } from '@/src/model';
import { msToTime } from '@/src/utils/time';
import { formatDateShort } from '@/src/utils/date-time';

type TableViewItemProps = {
  entry: TimeEntry;
  project: Project | undefined;
  customerName: string | null;
  onEdit: (entry: TimeEntry) => void;
  onDelete: (entry: TimeEntry) => void;
};

export const TableViewItem = (props: TableViewItemProps) => {
  const { entry, project, customerName, onEdit, onDelete } = props;
  const stripHtml = (html: string) =>
    html.replace(/<[^>]*>/g, '').trim() || '—';
  const desc = stripHtml(entry.description);

  return (
    <tr className={styles.row}>
      <td className={styles.cell}>{project?.name ?? '—'}</td>
      <td className={styles.cell}>{customerName ?? '—'}</td>
      <td className={styles.cellDesc}>{desc}</td>
      <td className={styles.cell}>{msToTime(entry.time)}</td>
      <td className={styles.cell}>{formatDateShort(entry.date)}</td>
      <td className={styles.cell}>{formatDateShort(entry.created_at)}</td>
      <td className={styles.cell}>
        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => onEdit(entry)}
            className={styles.actionButton}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(entry)}
            className={styles.actionButtonDanger}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

const styles = {
  row: `
    border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors
  `,
  cell: `
    px-3 py-2 text-xs text-gray-700
  `,
  cellDesc: `
    max-w-[200px] truncate px-3 py-2 text-xs text-gray-700
  `,
  actions: `
    flex gap-2
  `,
  actionButton: `
    text-xs font-medium text-blue-600 hover:text-blue-800 focus:outline-none
  `,
  actionButtonDanger: `
    text-xs font-medium text-red-600 hover:text-red-800 focus:outline-none
  `,
};
