'use client';

import { useMemo } from 'react';
import { TimeTrackingCalendar } from './calendar';
import { TimeEntriesTable } from './time-entries-table';
import { TimeEntryModal } from './time-entry-modal';
import { CreateProjectModal } from './create-project-modal';
import { useTimeEntriesInitialization } from '@/src/hooks/useTimeEntriesInitialization';

type TimeTrackingView = 'calendar' | 'table';

type TimeTrackingProps = {
  view: TimeTrackingView;
};

export const TimeTracking = (props: TimeTrackingProps) => {
  const { view } = props;

  const { startDate, endDate } = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    return {
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
    };
  }, []);

  useTimeEntriesInitialization(startDate, endDate);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {view === 'calendar' && <TimeTrackingCalendar />}
        {view === 'table' && <TimeEntriesTable />}
      </div>

      <TimeEntryModal />
      <CreateProjectModal />
    </div>
  );
};

const styles = {
  container: `
    flex flex-col gap-4
  `,
  content: `
    flex-1 min-h-0
  `,
};
