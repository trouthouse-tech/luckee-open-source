'use client';

import { SentStatCard } from './SentStatCard';
import { UniqueSendsStatCard } from './UniqueSendsStatCard';
import { BouncedStatCard } from './BouncedStatCard';
import { UniqueOpensStatCard } from './UniqueOpensStatCard';
import { TotalOpensStatCard } from './TotalOpensStatCard';
import { NotOpenedStatCard } from './NotOpenedStatCard';

export const LeadSentEmailsStats = () => {
  return (
    <div className={styles.metricsGrid}>
      <SentStatCard />
      <UniqueSendsStatCard />
      <BouncedStatCard />
      <UniqueOpensStatCard />
      <TotalOpensStatCard />
      <NotOpenedStatCard />
    </div>
  );
};

const styles = {
  metricsGrid: `
    grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4
  `,
};
