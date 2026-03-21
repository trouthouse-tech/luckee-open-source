'use client';

import { useMemo, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { LeadSentEmailsBuilderActions } from '@/src/store/builders';
import { getDateRangeForFilter, toTimestamp } from '@/src/utils/date-time';
import type { LeadSentEmail } from '@/src/model/lead-sent-email';

export const NotOpenedStatCard = () => {
  const dispatch = useAppDispatch();
  const leadSentEmailsRecord = useAppSelector((state) => state.leadSentEmails);
  const dateRangeFilter = useAppSelector(
    (state) => state.leadSentEmailsBuilder.dateRangeFilter
  );
  const statCardFilter = useAppSelector(
    (state) => state.leadSentEmailsBuilder.statCardFilter
  );

  const isActive = statCardFilter === 'not_opened';

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
    return filteredEmails.filter(
      (e) => e.delivery_status !== 'opened'
    ).length;
  }, [leadSentEmailsRecord, dateRangeFilter]);

  const handleClick = useCallback(() => {
    if (isActive) {
      dispatch(LeadSentEmailsBuilderActions.clearStatCardFilter());
    } else {
      dispatch(LeadSentEmailsBuilderActions.setStatCardFilter('not_opened'));
    }
  }, [dispatch, isActive]);

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      className={`${styles.metricCard} ${isActive ? styles.active : ''}`}
    >
      <span className={styles.metricLabel}>Not Opened</span>
      <span className={styles.metricValue}>{count.toLocaleString()}</span>
    </div>
  );
};

const styles = {
  metricCard: `
    bg-white border border-gray-300 rounded p-3 text-center
    cursor-pointer hover:bg-gray-50 transition-colors
  `,
  active: `
    border-blue-500 border-2 bg-blue-50
  `,
  metricLabel: `
    text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1
  `,
  metricValue: `
    text-lg font-bold text-gray-900
  `,
};
