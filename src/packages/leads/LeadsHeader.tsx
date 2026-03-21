'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/src/store/hooks';

export const LeadsHeader = () => {
  const leadsRecord = useAppSelector((state) => state.leads);
  const leadsList = useMemo(() => Object.values(leadsRecord), [leadsRecord]);
  const leadCountLabel = `${leadsList.length} lead${leadsList.length !== 1 ? 's' : ''}`;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeaderRow}>
        <div className={styles.sectionSummary}>
          <span className={styles.sectionTitle}>{leadCountLabel}</span>
          <span className={styles.sectionDivider}>•</span>
          <span className={styles.sectionMeta}>
            Track potential customers before conversion
          </span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  section: `mb-3`,
  sectionHeaderRow: `flex justify-between items-center mb-3`,
  sectionSummary: `flex items-center gap-1.5`,
  sectionTitle: `text-base font-semibold text-gray-900`,
  sectionDivider: `text-gray-300 text-sm`,
  sectionMeta: `text-xs text-gray-500`,
};
