'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/src/store/hooks';
import { getDateRangeForFilter, toTimestamp } from '@/src/utils/date-time';
import type { LeadSentEmail } from '@/src/model/lead-sent-email';

export const UniqueSendsStatCard = () => {
  const leadSentEmailsRecord = useAppSelector((state) => state.leadSentEmails);
  const dateRangeFilter = useAppSelector(
    (state) => state.leadSentEmailsBuilder.dateRangeFilter
  );

  const count = useMemo(() => {
    const allEmails = Object.values(leadSentEmailsRecord) as LeadSentEmail[];
    let filteredEmails = allEmails;
    if (dateRangeFilter) {
      const range = getDateRangeForFilter(dateRangeFilter);
      if (range) {
        filteredEmails = allEmails.filter((email) => {
          const sentTime = toTimestamp(email.sent_at);
          return sentTime >= range.start && sentTime <= range.end;
        });
      }
    }
    return new Set(filteredEmails.map((e) => e.lead_contact_id)).size;
  }, [leadSentEmailsRecord, dateRangeFilter]);

  return (
    <div className={styles.metricCard}>
      <span className={styles.metricLabel}>Unique Sends</span>
      <span className={styles.metricValue}>{count.toLocaleString()}</span>
    </div>
  );
};

const styles = {
  metricCard: `
    bg-white border border-gray-300 rounded p-3 text-center
  `,
  metricLabel: `
    text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1
  `,
  metricValue: `
    text-lg font-bold text-gray-900
  `,
};
