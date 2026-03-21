'use client';

import { CreateProjectModal } from '@/src/packages/time-tracking/create-project-modal';
import { CustomerProjectsTable } from './CustomerProjectsTable';

type CustomerProjectsProps = {
  activeTab: 'projects';
  customerId: string;
};

/**
 * Manager for customer projects tab. Owns table and modals.
 * Tab-specific action buttons (e.g. Add project) live in CustomerTabs.
 */
export const CustomerProjects = (props: CustomerProjectsProps) => {
  const { activeTab, customerId } = props;

  if (activeTab !== 'projects') {
    return null;
  }

  return (
    <div className={styles.manager}>
      <CustomerProjectsTable customerId={customerId} />
      <CreateProjectModal />
    </div>
  );
};

const styles = {
  manager: `
    flex flex-col gap-3
  `,
};
