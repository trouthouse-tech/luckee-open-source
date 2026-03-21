'use client';

import { LeadContactInfoCard } from './components/LeadContactInfoCard';
import { NotesList } from './components/NotesList';

export const LeadContactInfoPanel = () => {
  return (
    <div className={styles.panel}>
      <LeadContactInfoCard />
      <NotesList />
    </div>
  );
};

const styles = {
  panel: `
    border-r border-gray-100 p-4 overflow-y-auto bg-slate-50/80 min-h-[320px] lg:min-h-0
  `,
};
