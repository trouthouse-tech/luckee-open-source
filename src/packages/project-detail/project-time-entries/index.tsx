'use client';

import { useAppSelector } from '@/src/store/hooks';
import { ProjectTimeEntriesTable } from './ProjectTimeEntriesTable';

export const ProjectTimeEntries = () => {
  const activeTab = useAppSelector((state) => state.currentProjectDetail.activeTab);

  if (activeTab !== 'time_entries') {
    return null;
  }

  return <ProjectTimeEntriesTable />;
};
