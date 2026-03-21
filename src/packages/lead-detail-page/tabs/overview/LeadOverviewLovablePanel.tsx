'use client';

import { Globe, Calendar, Clock } from 'lucide-react';
import { useMemo } from 'react';
import { useAppSelector } from '@/src/store/hooks';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const websiteHref = (website: string | null | undefined): string | null => {
  if (!website?.trim()) return null;
  const w = website.trim();
  if (w.startsWith('http://') || w.startsWith('https://')) return w;
  return `https://${w}`;
};

export const LeadOverviewLovablePanel = () => {
  const activeTab = useAppSelector(
    (state) => state.leadBuilder.activeLeadDetailTab
  );
  const lead = useAppSelector((state) => state.currentLead);
  const leadContacts = useAppSelector((state) => state.leadContacts);

  const contactsCount = useMemo(() => {
    if (!lead?.id) return 0;
    return Object.values(leadContacts).filter((c) => c.lead_id === lead.id)
      .length;
  }, [lead?.id, leadContacts]);

  if (activeTab !== 'Overview' || !lead) return null;

  const categoryName =
    lead.category_name?.trim() || 'Uncategorized';
  const href = websiteHref(lead.website);
  const opportunities = lead.opportunities ?? [];
  const highlights = lead.summary?.highlights ?? [];

  return (
    <div className={styles.tabShell}>
      <div className={styles.wrapper}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <span className={styles.label}>Business name</span>
            <span className={styles.value}>{lead.business_name}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Website</span>
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className={styles.link}
              >
                <Globe className={styles.iconSm} />
                {lead.website}
              </a>
            ) : (
              <span className={styles.valueMuted}>—</span>
            )}
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Category</span>
            <span className={styles.value}>{categoryName}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Status</span>
            <span className={styles.badge}>
              {lead.status.replace(/_/g, ' ')}
            </span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Quality score</span>
            <span className={styles.value}>
              {lead.quality_score ?? '—'}
            </span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Contacts</span>
            <span className={styles.value}>{contactsCount}</span>
          </div>
        </div>

        {highlights.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Summary highlights</h3>
            <div className={styles.tagList}>
              {highlights.map((h, i) => (
                <span key={i} className={styles.tag}>
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}

        {opportunities.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Opportunities</h3>
            <div className={styles.tagList}>
              {opportunities.map((o) => (
                <span key={o} className={styles.tag}>
                  {o}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className={styles.metaSection}>
          <div className={styles.metaItem}>
            <Calendar className={styles.iconMuted} />
            <span className={styles.metaLabel}>Created:</span>
            <span className={styles.metaValue}>
              {formatDate(lead.created_at)}
            </span>
          </div>
          <div className={styles.metaItem}>
            <Clock className={styles.iconMuted} />
            <span className={styles.metaLabel}>Last updated:</span>
            <span className={styles.metaValue}>
              {formatDate(lead.updated_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  tabShell: `
    rounded-lg border border-gray-200 bg-white p-6
  `,
  wrapper: `space-y-6`,
  grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5`,
  field: `flex flex-col gap-1`,
  label: `text-xs font-medium text-gray-500 uppercase tracking-wider`,
  value: `text-sm text-gray-900`,
  valueMuted: `text-sm text-gray-400`,
  link: `inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline`,
  iconSm: `h-3.5 w-3.5 shrink-0`,
  badge: `
    inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
    bg-gray-100 text-gray-700 capitalize w-fit
  `,
  section: `space-y-2`,
  sectionTitle: `text-sm font-semibold text-gray-900`,
  tagList: `flex flex-wrap gap-2`,
  tag: `
    px-2.5 py-1 text-xs font-medium rounded-full
    bg-blue-50 text-blue-700
  `,
  metaSection: `flex flex-col gap-2 pt-4 border-t border-gray-200`,
  metaItem: `flex items-center gap-2 text-sm`,
  iconMuted: `h-3.5 w-3.5 text-gray-400 shrink-0`,
  metaLabel: `text-gray-500`,
  metaValue: `text-gray-900`,
};
