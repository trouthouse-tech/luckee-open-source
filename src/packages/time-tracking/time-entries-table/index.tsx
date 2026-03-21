'use client';

import { useMemo, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import {
  getDateRangeForPreset,
  type DateRangePreset,
} from '@/src/utils/date-time';
import { TimeEntryBuilderActions } from '@/src/store/builders/timeEntryBuilder';
import { CurrentTimeEntryActions } from '@/src/store/current/currentTimeEntry';
import { deleteTimeEntryThunk } from '@/src/store/thunks/time-entries';
import { FilterBar } from './FilterBar';
import { SummaryValues } from './SummaryValues';
import { TableViewItem } from './TableViewItem';
import type { TimeEntry } from '@/src/model';

type SortField = 'project_id' | 'description' | 'time' | 'date' | 'created_at';
type SortDir = 'asc' | 'desc';

export const TimeEntriesTable = () => {
  const dispatch = useAppDispatch();
  const timeEntries = useAppSelector((state) => state.timeEntries);
  const projects = useAppSelector((state) => state.projects);
  const customers = useAppSelector((state) => state.customers);
  const selectedProjectIds = useAppSelector(
    (state) => state.timeEntryBuilder.selectedProjectIds
  );
  const selectedCustomerId = useAppSelector(
    (state) => state.timeEntryBuilder.selectedCustomerId
  );

  const [referenceDate, setReferenceDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [preset, setPreset] = useState<DateRangePreset>('this_week');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const { start: startStr, end: endStr } = useMemo(
    () => getDateRangeForPreset(referenceDate, preset),
    [referenceDate, preset]
  );
  const startDate = useMemo(() => new Date(startStr + 'T00:00:00'), [startStr]);
  const endDate = useMemo(() => new Date(endStr + 'T00:00:00'), [endStr]);

  const entriesList = useMemo(() => {
    let list = Object.values(timeEntries);
    list = list.filter((e) => new Date(e.date) >= startDate);
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    list = list.filter((e) => new Date(e.date) <= endOfDay);
    if (selectedCustomerId != null && selectedCustomerId !== '') {
      const projectIdsForCustomer = Object.values(projects)
        .filter((p) => p.is_active && p.customer_id === selectedCustomerId)
        .map((p) => p.id);
      list = list.filter((e) => projectIdsForCustomer.includes(e.project_id));
    }
    if (selectedProjectIds.length > 0) {
      list = list.filter((e) => selectedProjectIds.includes(e.project_id));
    }
    list = [...list].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return 0;
    });
    return list;
  }, [
    timeEntries,
    projects,
    startDate,
    endDate,
    selectedCustomerId,
    selectedProjectIds,
    sortField,
    sortDir,
  ]);

  const totalMs = useMemo(
    () => entriesList.reduce((sum, e) => sum + e.time, 0),
    [entriesList]
  );

  const projectListAll = Object.values(projects).filter((p) => p.is_active);
  const projectListFiltered =
    selectedCustomerId != null && selectedCustomerId !== ''
      ? projectListAll.filter((p) => p.customer_id === selectedCustomerId)
      : projectListAll;
  const projectList = projectListFiltered.map((p) => {
    const customerName = p.customer_id
      ? customers[p.customer_id]?.name ?? null
      : null;
    return {
      id: p.id,
      name: customerName ? `${p.name} (${customerName})` : p.name,
    };
  });
  const customerList = Object.values(customers)
    .filter((c) => c.status === 'active' || c.status === 'pending_review')
    .map((c) => ({ id: c.id, name: c.name }));

  const handleEdit = (entry: TimeEntry) => {
    dispatch(CurrentTimeEntryActions.setCurrentTimeEntry(entry));
    dispatch(TimeEntryBuilderActions.openEditModal());
  };

  const handleDelete = (entry: TimeEntry) => {
    if (window.confirm('Delete this time entry?')) {
      dispatch(deleteTimeEntryThunk(entry.id));
    }
  };

  const handleNewEntry = () => {
    dispatch(CurrentTimeEntryActions.reset());
    dispatch(
      CurrentTimeEntryActions.updateField({
        date: new Date().toISOString(),
      })
    );
    dispatch(TimeEntryBuilderActions.openCreateModal());
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  return (
    <div className={styles.container}>
      <FilterBar
        referenceDate={referenceDate}
        onReferenceDateChange={setReferenceDate}
        preset={preset}
        onPresetChange={setPreset}
        selectedProjectIds={selectedProjectIds}
        onProjectIdsChange={(ids) =>
          dispatch(TimeEntryBuilderActions.setSelectedProjectIds(ids))
        }
        projectOptions={projectList}
        selectedCustomerId={selectedCustomerId}
        onCustomerIdChange={(id) =>
          dispatch(TimeEntryBuilderActions.setSelectedCustomerId(id))
        }
        customerOptions={customerList}
        showDateRange={true}
        rightContent={
          <button
            type="button"
            onClick={handleNewEntry}
            className={styles.newButton}
          >
            New entry
          </button>
        }
      />

      <SummaryValues totalMs={totalMs} />

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              <th
                className={styles.th}
                onClick={() => toggleSort('project_id')}
              >
                Project {sortField === 'project_id' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th className={styles.th}>Customer</th>
              <th
                className={styles.th}
                onClick={() => toggleSort('description')}
              >
                Description {sortField === 'description' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th className={styles.th} onClick={() => toggleSort('time')}>
                Time {sortField === 'time' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th className={styles.th} onClick={() => toggleSort('date')}>
                Date {sortField === 'date' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className={styles.th}
                onClick={() => toggleSort('created_at')}
              >
                Created {sortField === 'created_at' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entriesList.map((entry) => {
              const project = projects[entry.project_id];
              const customerName = project?.customer_id
                ? customers[project.customer_id]?.name ?? null
                : null;
              return (
                <TableViewItem
                  key={entry.id}
                  entry={entry}
                  project={project}
                  customerName={customerName}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {entriesList.length === 0 && (
        <div className={styles.empty}>No time entries match your filters.</div>
      )}
    </div>
  );
};

const styles = {
  container: `
    flex flex-col overflow-hidden rounded border border-gray-300 bg-white
  `,
  newButton: `
    h-7 px-3 py-1 text-xs bg-blue-600 text-white rounded font-medium
    hover:bg-blue-700 transition-colors
  `,
  tableWrap: `
    overflow-x-auto
  `,
  table: `
    w-full text-left border-collapse text-xs
  `,
  headerRow: `
    border-b border-gray-300 bg-gray-100
  `,
  th: `
    cursor-pointer px-3 py-2 text-left text-[10px] font-semibold text-gray-600
    uppercase tracking-wide bg-gray-100 border-b border-gray-300
    hover:bg-gray-200 transition-colors focus:outline-none
  `,
  empty: `
    px-4 py-10 text-center text-xs text-gray-500
  `,
};
