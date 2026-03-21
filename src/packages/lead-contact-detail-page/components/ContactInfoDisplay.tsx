'use client';

import { Mail, Phone, Building2, Globe } from 'lucide-react';
import { useAppSelector } from '@/src/store/hooks';
import { formatDateMedium } from '@/src/utils/date-time';
import { formatPhoneNumber } from '@/src/utils/string';

export const ContactInfoDisplay = () => {
  const currentLeadContact = useAppSelector((s) => s.currentLeadContact);
  const currentLead = useAppSelector((s) => s.currentLead);
  const biz = currentLead?.business_name ?? '—';
  const website = currentLead?.website;

  return (
    <div className={styles.grid}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Contact</h3>
        <div className={styles.list}>
          {currentLeadContact.email && (
            <div className={styles.row}>
              <Mail className={styles.rowIcon} />
              <a
                href={`mailto:${currentLeadContact.email}`}
                className={styles.link}
              >
                {currentLeadContact.email}
              </a>
            </div>
          )}
          {currentLeadContact.phone && (
            <div className={styles.row}>
              <Phone className={styles.rowIcon} />
              <a
                href={`tel:${currentLeadContact.phone}`}
                className={styles.link}
              >
                {formatPhoneNumber(currentLeadContact.phone)}
              </a>
            </div>
          )}
          <div className={styles.rowMuted}>
            Added {formatDateMedium(currentLeadContact.created_at)}
          </div>
          {!currentLeadContact.email && !currentLeadContact.phone && (
            <p className={styles.empty}>No email or phone on file</p>
          )}
        </div>
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Business</h3>
        <div className={styles.list}>
          <div className={styles.row}>
            <Building2 className={styles.rowIcon} />
            <span className={styles.value}>{biz}</span>
          </div>
          {website && (
            <div className={styles.row}>
              <Globe className={styles.rowIcon} />
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {website}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  grid: `grid grid-cols-1 md:grid-cols-2 gap-8 mt-2`,
  section: ``,
  sectionTitle: `text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3`,
  list: `space-y-3`,
  row: `flex items-center gap-2 text-sm`,
  rowIcon: `h-4 w-4 text-gray-400 shrink-0`,
  rowMuted: `text-xs text-gray-500`,
  link: `text-blue-600 hover:underline truncate`,
  value: `text-gray-900`,
  empty: `text-sm text-gray-400 italic`,
};
