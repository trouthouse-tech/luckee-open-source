'use client';

import { useAppSelector } from '@/src/store/hooks';
import { ProjectTicketsTable } from './ProjectTicketsTable';

export const ProjectTickets = () => {
  const activeTab = useAppSelector((state) => state.currentProjectDetail.activeTab);

  if (activeTab !== 'tickets') {
    return null;
  }

  return <ProjectTicketsTable />;
};
