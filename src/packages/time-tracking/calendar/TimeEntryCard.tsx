'use client';

import type { TimeEntry } from '@/src/model';
import type { Project } from '@/src/model';
import { msToTime } from '@/src/utils/time';

type TimeEntryCardProps = {
  entry: TimeEntry;
  project: Project | undefined;
  onClick: () => void;
};

export const TimeEntryCard = (props: TimeEntryCardProps) => {
  const { entry, project, onClick } = props;
  const color = project?.color ?? '#6366f1';
  const title = entry.title || 'No title';
  const timeStr = msToTime(entry.time);

  return (
    <button
      type="button"
      onClick={onClick}
      className={styles.card}
      style={{ borderLeftColor: color }}
    >
      <span className={styles.title}>{title}</span>
      <span className={styles.time}>{timeStr}</span>
    </button>
  );
};

const styles = {
  card: `
    w-full rounded border border-gray-300 border-l-4 bg-gray-50
    px-2.5 py-2 text-left
    hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50
  `,
  title: `
    block truncate text-xs font-medium text-gray-900
  `,
  time: `
    block mt-0.5 text-[10px] text-gray-500
  `,
};
