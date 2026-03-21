'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {
  getWebsiteScrapeRunsByLeadIdThunk,
  triggerWebsiteScrapeThunk,
} from '@/src/store/thunks/website-scrape-runs';
import type { WebsiteScrapeRun } from '@/src/model/website-scrape-run';

const websiteHref = (website: string | null | undefined): string | null => {
  if (!website?.trim()) return null;
  const w = website.trim();
  if (w.startsWith('http://') || w.startsWith('https://')) return w;
  return `https://${w}`;
};

const normalizeWebsiteForScrape = (website: string): string => {
  const href = websiteHref(website);
  return href ?? website.trim();
};

export const LeadWebsiteScrapesLovablePanel = () => {
  const dispatch = useAppDispatch();
  const isActive = useAppSelector(
    (state) => state.leadBuilder.activeLeadDetailTab === 'Website Scrapes'
  );
  const leadId = useAppSelector((state) => state.currentLead?.id ?? '');
  const website = useAppSelector((state) => state.currentLead?.website);
  const scrapeRuns = useAppSelector((state) => state.websiteScrapeRuns);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isScraping, setIsScraping] = useState(false);

  const leadScrapeRuns = useMemo(() => {
    return scrapeRuns
      .filter((run) => run.lead_id === leadId)
      .sort((a, b) => {
        const dateA =
          typeof a.started_at === 'string'
            ? new Date(a.started_at)
            : new Date(String(a.started_at));
        const dateB =
          typeof b.started_at === 'string'
            ? new Date(b.started_at)
            : new Date(String(b.started_at));
        return dateB.getTime() - dateA.getTime();
      });
  }, [scrapeRuns, leadId]);

  useEffect(() => {
    if (isActive && leadId) {
      dispatch(getWebsiteScrapeRunsByLeadIdThunk(leadId));
    }
  }, [dispatch, leadId, isActive]);

  const handleRefresh = useCallback(async () => {
    if (!leadId) return;
    setIsRefreshing(true);
    await dispatch(getWebsiteScrapeRunsByLeadIdThunk(leadId));
    setIsRefreshing(false);
  }, [dispatch, leadId]);

  const handleStartScrape = useCallback(async () => {
    if (!website?.trim() || !leadId) {
      window.alert('No website URL available for this lead');
      return;
    }
    const urlToScrape = normalizeWebsiteForScrape(website);
    setIsScraping(true);
    const result = await dispatch(
      triggerWebsiteScrapeThunk(leadId, urlToScrape)
    );
    setIsScraping(false);
    if (result.success) {
      await dispatch(getWebsiteScrapeRunsByLeadIdThunk(leadId));
    } else {
      window.alert(`Error: ${result.error ?? 'Scrape failed'}`);
    }
  }, [dispatch, leadId, website]);

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return '—';
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(d);
  };

  const getStatusBadge = (status: WebsiteScrapeRun['status']) => {
    const statusStyles: Record<
      WebsiteScrapeRun['status'],
      { bg: string; text: string; label: string }
    > = {
      pending: { bg: styles.badgePendingBg, text: styles.badgePendingText, label: 'Pending' },
      active: { bg: styles.badgeActiveBg, text: styles.badgeActiveText, label: 'Active' },
      completed: {
        bg: styles.badgeCompletedBg,
        text: styles.badgeCompletedText,
        label: 'Completed',
      },
      failed: { bg: styles.badgeFailedBg, text: styles.badgeFailedText, label: 'Failed' },
      timeout: { bg: styles.badgeTimeoutBg, text: styles.badgeTimeoutText, label: 'Timeout' },
    };
    const style = statusStyles[status];
    return (
      <span className={`${styles.badge} ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  const showScrapedPreview = (run: WebsiteScrapeRun) => {
    if (!run.scraped_data) return;
    const text = JSON.stringify(run.scraped_data, null, 2);
    window.alert(text.slice(0, 8000) + (text.length > 8000 ? '\n…' : ''));
  };

  if (!isActive) return null;

  const visitHref = websiteHref(website);

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>Website scrapes</h2>
        </div>
        <div className={styles.headerRight}>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing || !leadId}
            className={styles.refreshButton}
          >
            {isRefreshing ? 'Refreshing…' : 'Refresh'}
          </button>
          <button
            type="button"
            onClick={handleStartScrape}
            disabled={isScraping || !website?.trim() || !leadId}
            className={styles.scrapeButton}
          >
            {isScraping ? 'Scraping…' : '+ Scrape website'}
          </button>
        </div>
      </div>

      {visitHref && website && (
        <a
          href={visitHref}
          target="_blank"
          rel="noreferrer"
          className={styles.visitLink}
        >
          <ExternalLink className={styles.visitIcon} /> Visit {website}
        </a>
      )}

      {leadScrapeRuns.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>No website scrapes yet</p>
          <p className={styles.emptyDescription}>
            Click &quot;Scrape website&quot; to fetch content from this lead&apos;s
            site (runs through n8n; may take up to ~3 minutes).
          </p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thNum}>#</th>
                <th className={styles.th}>Website</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Started</th>
                <th className={styles.th}>Completed</th>
                <th className={styles.th} />
              </tr>
            </thead>
            <tbody>
              {leadScrapeRuns.map((run, index) => (
                <tr key={run.id} className={styles.tr}>
                  <td className={styles.tdNum}>{index + 1}</td>
                  <td className={styles.td}>
                    <a
                      href={websiteHref(run.website) ?? '#'}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.websiteLink}
                    >
                      {run.website}
                    </a>
                  </td>
                  <td className={styles.td}>{getStatusBadge(run.status)}</td>
                  <td className={styles.tdMuted}>{formatDate(run.started_at)}</td>
                  <td className={styles.tdMuted}>
                    {formatDate(run.completed_at ?? null)}
                    {run.error ? (
                      <span className={styles.errorHint} title={run.error}>
                        {' '}
                        ⚠️
                      </span>
                    ) : null}
                  </td>
                  <td className={styles.tdAction}>
                    {run.status === 'completed' && run.scraped_data ? (
                      <button
                        type="button"
                        className={styles.previewBtn}
                        onClick={() => showScrapedPreview(run)}
                      >
                        View data
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  section: `
    rounded-lg border border-gray-200 bg-white p-4
  `,
  header: `
    flex flex-wrap items-center justify-between gap-2 mb-4
  `,
  headerLeft: `flex-1 min-w-0`,
  headerRight: `flex items-center gap-2 shrink-0`,
  title: `text-base font-semibold text-gray-900`,
  refreshButton: `
    px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded
    hover:bg-gray-200 transition-colors
    focus:outline-none focus:ring-1 focus:ring-gray-400
    disabled:opacity-50
  `,
  scrapeButton: `
    px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded
    hover:bg-blue-700 transition-colors
    focus:outline-none focus:ring-1 focus:ring-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  visitLink: `
    inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-4
  `,
  visitIcon: `h-3.5 w-3.5 shrink-0`,
  emptyState: `
    text-center py-8 bg-gray-50 rounded-lg
  `,
  emptyTitle: `font-medium text-gray-700 mb-1 text-sm`,
  emptyDescription: `text-xs text-gray-500 max-w-md mx-auto px-2`,
  tableWrap: `overflow-x-auto rounded border border-gray-200`,
  table: `w-full border-collapse text-xs`,
  thNum: `
    px-2 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase
    bg-gray-100 border-b border-gray-200 w-8
  `,
  th: `
    px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase
    bg-gray-100 border-b border-gray-200
  `,
  tr: `border-b border-gray-100 hover:bg-gray-50/80 last:border-b-0`,
  tdNum: `px-2 py-2 text-xs text-gray-500 font-mono`,
  td: `px-3 py-2 text-xs text-gray-800`,
  tdMuted: `px-3 py-2 text-xs text-gray-600`,
  tdAction: `px-2 py-2 text-right`,
  websiteLink: `
    text-blue-600 hover:text-blue-800 hover:underline truncate max-w-[200px]
    inline-block align-bottom
  `,
  badge: `px-2 py-0.5 rounded-full text-[10px] font-semibold inline-block`,
  badgePendingBg: `bg-yellow-100`,
  badgePendingText: `text-yellow-800`,
  badgeActiveBg: `bg-blue-100`,
  badgeActiveText: `text-blue-800`,
  badgeCompletedBg: `bg-green-100`,
  badgeCompletedText: `text-green-800`,
  badgeFailedBg: `bg-red-100`,
  badgeFailedText: `text-red-800`,
  badgeTimeoutBg: `bg-orange-100`,
  badgeTimeoutText: `text-orange-800`,
  errorHint: `cursor-help`,
  previewBtn: `
    text-[10px] font-medium text-blue-600 hover:underline
  `,
};
