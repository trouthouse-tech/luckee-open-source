'use client';

import { useAppSelector } from '@/src/store/hooks';

export const LeadSentEmailsHeader = () => {
  const leadSentEmailsRecord = useAppSelector((state) => state.leadSentEmails);
  const emailCount = Object.keys(leadSentEmailsRecord).length;

  return (
    <div className={styles.header}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>Lead Sent Emails</h1>
        <span className={styles.count}>({emailCount})</span>
      </div>
    </div>
  );
};

const styles = {
  header: `
    flex items-center justify-between mb-4
  `,
  titleSection: `
    flex items-center gap-2
  `,
  title: `
    text-xl font-semibold text-gray-900
  `,
  count: `
    text-sm text-gray-500
  `,
};
