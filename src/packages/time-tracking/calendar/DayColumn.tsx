'use client';

import type { TimeEntry } from '@/src/model';
import type { Project } from '@/src/model';
import { TimeEntryCard } from './TimeEntryCard';
import { msToTime } from '@/src/utils/time';

type DayColumnProps = {
  dateStr: string;
  entries: TimeEntry[];
  projects: Record<string, Project>;
  onEntryClick: (entry: TimeEntry) => void;
};

export const DayColumn = (props: DayColumnProps) => {
  const { dateStr, entries, projects, onEntryClick } = props;
  const date = new Date(dateStr);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  const dayNum = date.getDate();
  const totalMs = entries.reduce((sum, e) => sum + e.time, 0);

  return (
    <div className={styles.column}>
      <div className={styles.header}>
        <span className={styles.dayName}>{dayName}</span>
        <span className={styles.dayNum}>{dayNum}</span>
      </div>
      <div className={styles.entries}>
        {entries.map((entry) => (
          <TimeEntryCard
            key={entry.id}
            entry={entry}
            project={projects[entry.project_id]}
            onClick={() => onEntryClick(entry)}
          />
        ))}
      </div>
      <div className={styles.footer}>
        {msToTime(totalMs)}
      </div>
    </div>
  );
};

const styles = {
  column: `
    flex min-w-0 flex-1 flex-col border-r border-gray-300 last:border-r-0
  `,
  header: `
    px-3 py-2 text-[10px] font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300 text-center
  `,
  dayName: `
    block text-[10px] font-semibold text-gray-600 uppercase tracking-wide
  `,
  dayNum: `
    block text-xs font-semibold text-gray-900 mt-0.5
  `,
  entries: `
    flex min-h-[100px] flex-col gap-2 p-2
  `,
  footer: `
    border-t border-gray-300 px-2 py-2 text-xs font-medium text-gray-600
  `,
};
