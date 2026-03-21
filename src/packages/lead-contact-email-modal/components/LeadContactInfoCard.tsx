'use client';

import { Building2, User } from 'lucide-react';
import { useAppSelector } from '@/src/store/hooks';
import { formatPhoneNumber } from '@/src/utils/string';

export const LeadContactInfoCard = () => {
  const currentLead = useAppSelector((s) => s.currentLead);
  const currentLeadContact = useAppSelector((s) => s.currentLeadContact);

  return (
    <div className={styles.card}>
      <h3 className={styles.h}>Contact</h3>
      <div className={styles.rows}>
        <div className={styles.row}>
          <Building2 className={styles.ico} />
          <span className={styles.val}>
            {currentLead?.business_name ?? '—'}
          </span>
        </div>
        <div className={styles.row}>
          <User className={styles.ico} />
          <span className={styles.val}>
            {currentLeadContact.name || '—'}
          </span>
        </div>
        {currentLeadContact.email && (
          <a href={`mailto:${currentLeadContact.email}`} className={styles.link}>
            {currentLeadContact.email}
          </a>
        )}
        {currentLeadContact.phone && (
          <a href={`tel:${currentLeadContact.phone}`} className={styles.link}>
            {formatPhoneNumber(currentLeadContact.phone)}
          </a>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: `p-4 bg-white rounded-xl border border-gray-200 shadow-sm`,
  h: `text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3`,
  rows: `space-y-2`,
  row: `flex items-center gap-2 text-sm`,
  ico: `h-4 w-4 text-gray-400 shrink-0`,
  val: `text-gray-900`,
  link: `block text-sm text-blue-600 hover:underline`,
};
