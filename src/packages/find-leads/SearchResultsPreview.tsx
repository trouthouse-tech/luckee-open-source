'use client';

import Link from 'next/link';
import { useAppSelector } from '@/src/store/hooks';
import type { GoogleMapsScrapeRun } from '@/src/model';

export const SearchResultsPreview = () => {
  const isScraping = useAppSelector((s) => s.googleMapsScraperBuilder.isScraping);
  const currentScrapeRun = useAppSelector(
    (s) => s.currentGoogleMapsScrapeRun
  ) as GoogleMapsScrapeRun | null;

  if (isScraping) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Scraping Google Maps and creating leads…</p>
        </div>
      </div>
    );
  }

  if (!currentScrapeRun || currentScrapeRun.status !== 'completed') {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.successCard}>
        <div className={styles.successTitle}>Scrape complete</div>
        <p className={styles.successText}>
          Scraped {currentScrapeRun.resultsCount} businesses and created{' '}
          {currentScrapeRun.businessesImported} leads.
        </p>
        <Link href="/leads" className={styles.link}>
          View leads →
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: `w-full mb-4`,
  loading: `flex flex-col items-center justify-center py-12`,
  spinner: `w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4`,
  loadingText: `text-gray-600 font-medium text-sm`,
  successCard: `bg-green-50 border border-green-200 rounded-lg p-6`,
  successTitle: `text-lg font-bold text-green-900 mb-2`,
  successText: `text-green-800 text-sm mb-3`,
  link: `text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline`,
};
