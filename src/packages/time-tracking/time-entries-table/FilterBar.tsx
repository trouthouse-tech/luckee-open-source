'use client';

import { useMemo } from 'react';
import {
  getDateRangeForPreset,
  type DateRangePreset,
} from '@/src/utils/date-time';

const PRESET_OPTIONS: { value: DateRangePreset; label: string }[] = [
  { value: 'yesterday', label: 'Prior day' },
  { value: 'last_3_days', label: 'Last 3 days' },
  { value: 'week_to_date', label: 'Week to date' },
  { value: 'this_week', label: 'This week' },
  { value: 'last_week', label: 'Last week' },
  { value: 'month_to_date', label: 'Month to date' },
  { value: 'last_month', label: 'Last month' },
];

type FilterBarProps = {
  referenceDate: string;
  onReferenceDateChange: (d: string) => void;
  preset: DateRangePreset;
  onPresetChange: (p: DateRangePreset) => void;
  selectedProjectIds: string[];
  onProjectIdsChange: (ids: string[]) => void;
  projectOptions: { id: string; name: string }[];
  selectedCustomerId: string | null;
  onCustomerIdChange: (id: string | null) => void;
  customerOptions: { id: string; name: string }[];
  rightContent?: React.ReactNode;
  showDateRange?: boolean;
};

const formatRangeDate = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const FilterBar = (props: FilterBarProps) => {
  const {
    referenceDate,
    onReferenceDateChange,
    preset,
    onPresetChange,
    selectedProjectIds,
    onProjectIdsChange,
    projectOptions,
    selectedCustomerId,
    onCustomerIdChange,
    customerOptions,
    rightContent,
    showDateRange = true,
  } = props;

  const range = useMemo(
    () => getDateRangeForPreset(referenceDate, preset),
    [referenceDate, preset]
  );
  const dateRangeText =
    range.start === range.end
      ? formatRangeDate(range.start)
      : `${formatRangeDate(range.start)} – ${formatRangeDate(range.end)}`;

  return (
    <div className={styles.bar}>
      <select
        value={selectedCustomerId ?? ''}
        onChange={(e) => {
          const v = e.target.value;
          onCustomerIdChange(v || null);
        }}
        className={styles.select}
      >
        <option value="">All customers</option>
        {customerOptions.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <div className={styles.dropdownWrapper}>
        <details className={styles.dropdown}>
          <summary className={styles.dropdownSummary}>
            Projects {selectedProjectIds.length > 0 && `(${selectedProjectIds.length})`}
          </summary>
          <div className={styles.dropdownContent}>
            {projectOptions.map((p) => (
              <label key={p.id} className={styles.dropdownItem}>
                <input
                  type="checkbox"
                  checked={selectedProjectIds.includes(p.id)}
                  onChange={() => {
                    const next = selectedProjectIds.includes(p.id)
                      ? selectedProjectIds.filter((id) => id !== p.id)
                      : [...selectedProjectIds, p.id];
                    onProjectIdsChange(next);
                  }}
                  className={styles.checkbox}
                />
                <span>{p.name}</span>
              </label>
            ))}
          </div>
        </details>
      </div>
      <div className={styles.dateSelector}>
        <input
          type="date"
          value={referenceDate}
          onChange={(e) => onReferenceDateChange(e.target.value)}
          max={new Date().toISOString().slice(0, 10)}
          className={styles.dateInput}
          aria-label="Reference date"
        />
        <select
          value={preset}
          onChange={(e) => onPresetChange(e.target.value as DateRangePreset)}
          className={styles.presetSelect}
          aria-label="Time period"
        >
          {PRESET_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {showDateRange && (
        <div className={styles.dateRange}>
          <span className={styles.rangeLabel}>Range</span>
          <span className={styles.rangeValue}>{dateRangeText}</span>
        </div>
      )}
      {rightContent != null ? <div className={styles.rightContent}>{rightContent}</div> : null}
    </div>
  );
};

const styles = {
  bar: `
    flex flex-wrap items-center gap-3 border-b border-gray-300 bg-gray-50 p-3
  `,
  select: `
    min-w-[140px] rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  `,
  dropdownWrapper: `
    relative
  `,
  dropdown: `
    relative
  `,
  dropdownSummary: `
    min-w-[140px] h-9 px-3 py-2 text-sm border border-gray-300 rounded bg-white
    cursor-pointer hover:bg-gray-50 transition-colors list-none flex items-center
  `,
  dropdownContent: `
    absolute top-full left-0 mt-1 w-64 max-h-60 overflow-y-auto
    bg-white border border-gray-300 rounded shadow-lg z-10 py-1
  `,
  dropdownItem: `
    flex items-start gap-2 px-2 py-1.5
    hover:bg-gray-50 cursor-pointer text-sm
  `,
  checkbox: `
    cursor-pointer mt-0.5 flex-shrink-0
  `,
  dateSelector: `
    flex items-center gap-2
  `,
  dateInput: `
    h-8 px-2 py-1.5 rounded border border-gray-300 bg-white text-sm text-gray-900
    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent
  `,
  presetSelect: `
    h-8 min-w-[120px] px-2 py-1.5 rounded border border-gray-300 bg-white text-sm text-gray-900
    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent
  `,
  dateRange: `
    flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap
  `,
  rangeLabel: `
    font-medium text-gray-700
  `,
  rangeValue: `
    text-gray-600
  `,
  rightContent: `
    flex items-center ml-auto
  `,
};
