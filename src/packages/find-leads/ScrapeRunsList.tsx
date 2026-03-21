'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { GoogleMapsScrapeRunsActions } from '@/src/store/dumps/googleMapsScrapeRuns';
import { getAllGoogleMapsScrapeRuns } from '@/src/api/google-maps-scrape-runs';
import type { GoogleMapsScrapeRun } from '@/src/model';

export const ScrapeRunsList = () => {
  const dispatch = useAppDispatch();
  const scrapeRunsObj = useAppSelector((s) => s.googleMapsScrapeRuns);
  const scrapeRuns = Object.values(scrapeRunsObj);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getAllGoogleMapsScrapeRuns();
        if (response.success && response.data?.length) {
          dispatch(GoogleMapsScrapeRunsActions.setGoogleMapsScrapeRuns(response.data));
        }
      } catch (e) {
        console.error('Error loading scrape runs:', e);
      }
    };
    load();
  }, [dispatch]);

  const sortedRuns = [...scrapeRuns].sort((a, b) => {
    const tA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
    const tB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
    return tB - tA;
  });

  const badge = (status: GoogleMapsScrapeRun['status']) => {
    const map = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    } as const;
    const labels = {
      pending: 'Pending',
      in_progress: 'In progress',
      completed: 'Completed',
      failed: 'Failed',
    } as const;
    return (
      <span className={`${styles.badge} ${map[status]}`}>{labels[status]}</span>
    );
  };

  const formatDate = (date: Date | string) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date instanceof Date ? date : new Date(date));

  if (sortedRuns.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>No scrapes yet</p>
        <p className={styles.emptyDescription}>
          Run a search above to find local businesses and create leads.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thNarrow}>#</th>
            <th className={styles.th}>Search name</th>
            <th className={styles.th}>Query</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>Results</th>
            <th className={styles.th}>Created</th>
          </tr>
        </thead>
        <tbody>
          {sortedRuns.map((run, index) => (
            <tr key={run.id} className={styles.tr}>
              <td className={styles.tdMuted}>{index + 1}</td>
              <td className={styles.td}>
                <div className={styles.semibold}>{run.name}</div>
              </td>
              <td className={styles.td}>{run.searchQuery}</td>
              <td className={styles.td}>{badge(run.status)}</td>
              <td className={styles.td}>
                <div>Found: {run.resultsCount}</div>
                <div className={styles.sub}>Imported: {run.businessesImported}</div>
              </td>
              <td className={styles.td}>{formatDate(run.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  tableContainer: `bg-white rounded border border-gray-300 overflow-x-auto`,
  table: `w-full border-collapse text-sm`,
  thNarrow: `px-2 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-100 border-b border-gray-300 w-8`,
  th: `px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-100 border-b border-gray-300`,
  tr: `hover:bg-gray-50 border-b border-gray-200 last:border-b-0`,
  td: `px-3 py-2 text-sm text-gray-700`,
  tdMuted: `px-2 py-2 text-sm text-gray-500 font-mono`,
  semibold: `font-semibold text-gray-900`,
  sub: `text-xs text-gray-500`,
  badge: `px-2 py-0.5 rounded-full text-xs font-medium inline-block`,
  emptyState: `p-8 text-center text-gray-500 bg-white rounded border border-gray-300`,
  emptyTitle: `text-sm font-semibold text-gray-800`,
  emptyDescription: `text-xs text-gray-500 mt-1`,
};
