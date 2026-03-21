'use client';

import { useAppSelector } from '@/src/store/hooks';
import { ContactMenu } from './ContactMenu';
import { StatusDropdown } from './StatusDropdown';
import { QueueStatusBadge } from './QueueStatusBadge';
import { ContactEditForm } from './ContactEditForm';
import { ContactInfoDisplay } from './ContactInfoDisplay';

export const LeadContactHeader = () => {
  const { isEditing } = useAppSelector((s) => s.leadContactBuilder);
  const currentLeadContact = useAppSelector((s) => s.currentLeadContact);

  return (
    <div className={styles.card}>
      <div className={styles.menuCorner}>
        <ContactMenu />
      </div>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>
          {currentLeadContact.name || 'Unnamed contact'}
        </h1>
        {currentLeadContact.role && (
          <span className={styles.role}>{currentLeadContact.role}</span>
        )}
        <QueueStatusBadge />
        <StatusDropdown />
      </div>
      {isEditing ? <ContactEditForm /> : <ContactInfoDisplay />}
    </div>
  );
};

const styles = {
  card: `
    relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-6
  `,
  menuCorner: `absolute top-4 right-4`,
  titleBlock: `flex flex-wrap items-center gap-3 mb-2 pr-10`,
  title: `text-2xl font-bold text-gray-900`,
  role: `
    px-2.5 py-0.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-full
  `,
};
