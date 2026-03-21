'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { LeadBuilderActions } from '@/src/store/builders';
import {
  LEAD_STATUSES,
  QUALITY_FILTER_OPTIONS,
} from '@/src/utils/leads/constants';

export const LeadsFilters = () => {
  const dispatch = useAppDispatch();
  const leadCategories = useAppSelector((state) => state.leadCategories);
  const selectedStatus = useAppSelector(
    (state) => state.leadBuilder.selectedStatus
  );
  const selectedCategoryIds = useAppSelector(
    (state) => state.leadBuilder.selectedCategoryIds
  );
  const searchFilter = useAppSelector(
    (state) => state.leadBuilder.searchFilter
  );
  const qualityFilter = useAppSelector(
    (state) => state.leadBuilder.qualityFilter
  );
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const [localSearch, setLocalSearch] = useState(searchFilter);

  const sortedCategories = useMemo(
    () => [...leadCategories].sort((a, b) => a.name.localeCompare(b.name)),
    [leadCategories]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(LeadBuilderActions.setSearchFilter(localSearch));
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, dispatch]);

  useEffect(() => {
    setLocalSearch(searchFilter);
  }, [searchFilter]);

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(LeadBuilderActions.setSelectedStatus(e.target.value || null));
    },
    [dispatch]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalSearch(e.target.value);
    },
    []
  );

  const handleQualityChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(
        LeadBuilderActions.setQualityFilter(
          e.target.value as typeof qualityFilter
        )
      );
    },
    [dispatch, qualityFilter]
  );

  const handleToggleCategory = useCallback(
    (categoryId: string) => {
      dispatch(LeadBuilderActions.toggleCategorySelection(categoryId));
    },
    [dispatch]
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(e.target as Node)
      ) {
        setCategoryDropdownOpen(false);
      }
    };
    if (categoryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [categoryDropdownOpen]);

  const handleClearFilters = useCallback(() => {
    setLocalSearch('');
    dispatch(LeadBuilderActions.clearFilters());
  }, [dispatch]);

  const hasActiveFilters =
    selectedStatus ||
    selectedCategoryIds.length > 0 ||
    searchFilter ||
    qualityFilter !== 'all';

  return (
    <div className={styles.container}>
      <div className={styles.filtersRow}>
        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            value={localSearch}
            onChange={handleSearchChange}
            placeholder="Search business name or website..."
            className={styles.searchInput}
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => setLocalSearch('')}
              className={styles.clearSearchButton}
            >
              ✕
            </button>
          )}
        </div>

        <select
          value={selectedStatus ?? ''}
          onChange={handleStatusChange}
          className={styles.filterSelect}
        >
          <option value="">All Statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <select
          value={qualityFilter}
          onChange={handleQualityChange}
          className={styles.filterSelect}
        >
          {QUALITY_FILTER_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <div className={styles.categoryDropdownWrap} ref={categoryDropdownRef}>
          <button
            type="button"
            onClick={() => setCategoryDropdownOpen((v) => !v)}
            className={styles.categoryDropdownButton}
          >
            Category
            {selectedCategoryIds.length > 0
              ? ` (${selectedCategoryIds.length})`
              : ''}
            <span className={styles.categoryCaret}>▼</span>
          </button>
          {categoryDropdownOpen && (
            <div className={styles.categoryDropdownPanel}>
              <label className={styles.categoryOption}>
                <input
                  type="checkbox"
                  checked={selectedCategoryIds.includes('uncategorized')}
                  onChange={() =>
                    handleToggleCategory('uncategorized')
                  }
                />
                <span>Uncategorized</span>
              </label>
              {sortedCategories.map((cat) => (
                <label key={cat.id} className={styles.categoryOption}>
                  <input
                    type="checkbox"
                    checked={selectedCategoryIds.includes(cat.id)}
                    onChange={() => handleToggleCategory(cat.id)}
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className={styles.clearButton}
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: `mb-3`,
  filtersRow: `flex flex-wrap items-center gap-2`,
  searchContainer: `relative flex items-center border border-gray-300 rounded px-2 py-1.5 bg-white`,
  searchIcon: `text-gray-400 mr-1 text-sm`,
  searchInput: `w-48 text-sm border-none outline-none bg-transparent`,
  clearSearchButton: `text-gray-400 hover:text-gray-600 text-xs cursor-pointer border-none bg-transparent p-0.5`,
  filterSelect: `text-sm border border-gray-300 rounded px-2 py-1.5 bg-white`,
  categoryDropdownWrap: `relative`,
  categoryDropdownButton: `text-sm border border-gray-300 rounded px-2 py-1.5 bg-white cursor-pointer flex items-center gap-1`,
  categoryCaret: `text-xs text-gray-500`,
  categoryDropdownPanel: `absolute top-full left-0 mt-1 py-2 bg-white border border-gray-200 rounded shadow-lg z-10 max-h-60 overflow-y-auto min-w-[180px]`,
  categoryOption: `flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-gray-50 text-sm`,
  clearButton: `text-sm text-gray-600 hover:text-gray-900 cursor-pointer border-none bg-transparent`,
};
