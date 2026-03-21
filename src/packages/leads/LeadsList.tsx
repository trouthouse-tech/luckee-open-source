'use client';

import { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { LeadBuilderActions } from '@/src/store/builders';
import type { Lead } from '@/src/model';
import { CategoryGroup } from './CategoryGroup';

type SortColumn = 'business_name' | 'updated_at' | 'quality_score';
type SortDirection = 'asc' | 'desc';

const getTime = (date: string | undefined): number =>
  date ? new Date(date).getTime() : 0;

export const LeadsList = () => {
  const dispatch = useAppDispatch();
  const leadsRecord = useAppSelector((state) => state.leads);
  const leadCategories = useAppSelector((state) => state.leadCategories);
  const selectedCategoryIds = useAppSelector(
    (state) => state.leadBuilder.selectedCategoryIds
  );
  const selectedStatus = useAppSelector(
    (state) => state.leadBuilder.selectedStatus
  );
  const searchFilter = useAppSelector(
    (state) => state.leadBuilder.searchFilter
  );
  const qualityFilter = useAppSelector(
    (state) => state.leadBuilder.qualityFilter
  );
  const selectedLeadIds = useAppSelector(
    (state) => state.leadBuilder.selectedLeadIds
  );

  const [sortColumn, setSortColumn] = useState<SortColumn>('quality_score');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortDirection(
        column === 'updated_at' || column === 'quality_score' ? 'desc' : 'asc'
      );
      setSortColumn(column);
    }
  };

  const leadsList = useMemo(() => Object.values(leadsRecord), [leadsRecord]);

  const filteredLeads = useMemo(() => {
    let filtered = leadsList;

    if (selectedStatus) {
      filtered = filtered.filter((lead) => lead.status === selectedStatus);
    }

    if (selectedCategoryIds.length > 0) {
      filtered = filtered.filter((lead) => {
        if (
          selectedCategoryIds.includes('uncategorized') &&
          !lead.category_id &&
          !lead.category_name
        ) {
          return true;
        }
        if (
          lead.category_id &&
          selectedCategoryIds.includes(lead.category_id)
        ) {
          return true;
        }
        if (!lead.category_id && lead.category_name) {
          const match = leadCategories.find(
            (cat) =>
              selectedCategoryIds.includes(cat.id) &&
              lead.category_name?.toLowerCase() === cat.name.toLowerCase()
          );
          if (match) return true;
        }
        return false;
      });
    }

    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      filtered = filtered.filter(
        (lead) =>
          lead.business_name?.toLowerCase().includes(q) ||
          lead.website?.toLowerCase().includes(q) ||
          lead.name?.toLowerCase().includes(q)
      );
    }

    if (qualityFilter === 'unscored') {
      filtered = filtered.filter(
        (lead) =>
          lead.quality_score === undefined || lead.quality_score === null
      );
    } else if (qualityFilter === '<30') {
      filtered = filtered.filter(
        (lead) => lead.quality_score != null && lead.quality_score < 30
      );
    } else if (qualityFilter === '30-50') {
      filtered = filtered.filter(
        (lead) =>
          lead.quality_score != null &&
          lead.quality_score >= 30 &&
          lead.quality_score <= 50
      );
    } else if (qualityFilter === '51-70') {
      filtered = filtered.filter(
        (lead) =>
          lead.quality_score != null &&
          lead.quality_score >= 51 &&
          lead.quality_score <= 70
      );
    } else if (qualityFilter === '71+') {
      filtered = filtered.filter(
        (lead) => lead.quality_score != null && lead.quality_score >= 71
      );
    }

    return filtered;
  }, [
    leadsList,
    selectedStatus,
    selectedCategoryIds,
    searchFilter,
    qualityFilter,
    leadCategories,
  ]);

  const sortedLeads = useMemo(() => {
    return [...filteredLeads].sort((a, b) => {
      let comparison = 0;
      if (sortColumn === 'business_name') {
        comparison = (a.business_name || '')
          .toLowerCase()
          .localeCompare((b.business_name || '').toLowerCase());
      } else if (sortColumn === 'quality_score') {
        comparison = (a.quality_score ?? -1) - (b.quality_score ?? -1);
      } else {
        comparison = getTime(a.updated_at) - getTime(b.updated_at);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredLeads, sortColumn, sortDirection]);

  const leadsByCategory = useMemo(() => {
    const map = new Map<string | null, Lead[]>();
    sortedLeads.forEach((lead) => {
      const categoryId = lead.category_id ?? null;
      if (!map.has(categoryId)) map.set(categoryId, []);
      map.get(categoryId)!.push(lead);
    });
    return map;
  }, [sortedLeads]);

  const categoryIds = useMemo(() => {
    return Array.from(leadsByCategory.keys()).sort((a, b) => {
      if (a === null) return 1;
      if (b === null) return -1;
      const catA = leadCategories.find((c) => c.id === a);
      const catB = leadCategories.find((c) => c.id === b);
      return (catA?.name ?? '').localeCompare(catB?.name ?? '');
    });
  }, [leadsByCategory, leadCategories]);

  const allSelected = useMemo(
    () =>
      sortedLeads.length > 0 &&
      sortedLeads.every((lead) => selectedLeadIds.includes(lead.id)),
    [sortedLeads, selectedLeadIds]
  );

  const handleSelectAll = () => {
    if (allSelected) {
      dispatch(LeadBuilderActions.clearLeadSelection());
    } else {
      dispatch(
        LeadBuilderActions.selectAllLeads(sortedLeads.map((lead) => lead.id))
      );
    }
  };

  const hasFilters =
    selectedCategoryIds.length > 0 ||
    !!selectedStatus ||
    !!searchFilter ||
    qualityFilter !== 'all';

  if (sortedLeads.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>
          {hasFilters
            ? 'No leads match your filters'
            : 'No leads found'}
        </p>
        <p className={styles.emptyDescription}>
          {hasFilters
            ? 'Try adjusting your filters or clear them to see all leads.'
            : 'Create your first lead to start tracking potential customers.'}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.checkboxHeader}>
              <input
                type="checkbox"
                checked={allSelected}
                ref={(input) => {
                  if (input) {
                    input.indeterminate =
                      selectedLeadIds.length > 0 && !allSelected;
                  }
                }}
                onChange={handleSelectAll}
                className={styles.checkbox}
                title={allSelected ? 'Deselect all' : 'Select all'}
              />
            </th>
            <th className={styles.rowNumberHeader}>#</th>
            <th
              className={styles.sortableHeader}
              onClick={() => handleSort('business_name')}
            >
              <span>Business Name</span>
              <span className={styles.sortIcon}>
                {sortColumn === 'business_name'
                  ? sortDirection === 'asc'
                    ? ' ↑'
                    : ' ↓'
                  : ' ↕'}
              </span>
            </th>
            <th className={styles.tableHeader}>Category</th>
            <th className={styles.tableHeader}>Campaigns</th>
            <th className={styles.tableHeader}>Opportunities</th>
            <th
              className={styles.sortableHeaderCenter}
              onClick={() => handleSort('quality_score')}
            >
              <span>Quality</span>
              <span className={styles.sortIcon}>
                {sortColumn === 'quality_score'
                  ? sortDirection === 'asc'
                    ? ' ↑'
                    : ' ↓'
                  : ' ↕'}
              </span>
            </th>
            <th className={styles.tableHeader}>Contacts</th>
            <th
              className={styles.sortableHeader}
              onClick={() => handleSort('updated_at')}
            >
              <span>Last Updated</span>
              <span className={styles.sortIcon}>
                {sortColumn === 'updated_at'
                  ? sortDirection === 'asc'
                    ? ' ↑'
                    : ' ↓'
                  : ' ↕'}
              </span>
            </th>
            <th className={styles.tableHeader} aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {categoryIds.map((categoryId) => (
            <CategoryGroup
              key={categoryId ?? 'uncategorized'}
              categoryId={categoryId}
              leads={leadsByCategory.get(categoryId) ?? []}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  tableContainer: `
    bg-white rounded border border-gray-300 overflow-x-auto overflow-y-visible
  `,
  table: `w-full border-collapse text-sm relative`,
  checkboxHeader: `
    px-2 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300 w-12
  `,
  checkbox: `cursor-pointer`,
  rowNumberHeader: `
    px-2 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300 w-8
  `,
  tableHeader: `
    px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300
  `,
  sortableHeader: `
    px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300 cursor-pointer hover:bg-gray-200 transition-colors select-none
  `,
  sortableHeaderCenter: `
    px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300 cursor-pointer hover:bg-gray-200 transition-colors select-none
  `,
  sortIcon: `ml-1 text-gray-400 text-[10px]`,
  emptyState: `bg-white rounded border border-gray-300 p-8 text-center`,
  emptyTitle: `text-lg font-semibold text-gray-900 mb-2`,
  emptyDescription: `text-sm text-gray-600`,
};
