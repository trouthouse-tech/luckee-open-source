'use client';

import { LeadsHeader } from './LeadsHeader';
import { LeadsFilters } from './LeadsFilters';
import { LeadsList } from './LeadsList';

export { LeadRow } from './LeadRow';
export { CategoryGroup } from './CategoryGroup';
export { LeadsHeader } from './LeadsHeader';
export { LeadsFilters } from './LeadsFilters';
export { LeadsList } from './LeadsList';

export const Leads = () => {
  return (
    <div className={styles.pageContainer}>
      <LeadsHeader />
      <LeadsFilters />
      <LeadsList />
    </div>
  );
};

const styles = {
  pageContainer: `w-full`,
};
