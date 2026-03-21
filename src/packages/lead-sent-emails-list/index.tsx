'use client';

import { LeadSentEmailsHeader } from './LeadSentEmailsHeader';
import { LeadSentEmailsStats } from './stats';
import { LeadSentEmailsFilters } from './LeadSentEmailsFilters';
import { LeadSentEmailsList } from './LeadSentEmailsList';

export { LeadSentEmailRow } from './LeadSentEmailRow';

export const LeadSentEmailsListPage = () => {
  return (
    <div className={styles.pageContainer}>
      <LeadSentEmailsHeader />
      <LeadSentEmailsStats />
      <LeadSentEmailsFilters />
      <LeadSentEmailsList />
    </div>
  );
};

const styles = {
  pageContainer: `
    w-full
  `,
};
