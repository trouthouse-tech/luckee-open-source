'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { getAllTimeEntriesThunk } from '@/src/store/thunks/time-entries';
import { TimeEntryBuilderActions } from '@/src/store/builders/timeEntryBuilder';
import { CurrentTimeEntryActions } from '@/src/store/current/currentTimeEntry';
import { DayColumn } from './DayColumn';
import { getWeekDates } from '@/src/utils/date-time';
import { msToTime } from '@/src/utils/time';
import type { TimeEntry } from '@/src/model';

export const TimeTrackingCalendar = () => {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const timeEntries = useAppSelector((state) => state.timeEntries);
  const projects = useAppSelector((state) => state.projects);
  const selectedProjectIds = useAppSelector(
    (state) => state.timeEntryBuilder.selectedProjectIds
  );

  const [weekStart, setWeekStart] = useState<Date>(() => {
    const d = new Date();
    const day = d.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const monday = new Date(d);
    monday.setDate(d.getDate() + mondayOffset);
    return monday;
  });

  const weekDates = useMemo(
    () => getWeekDates(weekStart).map((d) => d.slice(0, 10)),
    [weekStart]
  );

  const startDate = weekDates[0];
  const endDate = weekDates[6];

  useEffect(() => {
    if (!authUser?.id || !startDate || !endDate) return;
    dispatch(getAllTimeEntriesThunk(authUser.id, startDate, endDate));
  }, [authUser?.id, startDate, endDate, dispatch]);

  const entriesList = useMemo(() => {
    const list = Object.values(timeEntries);
    if (selectedProjectIds.length === 0) return list;
    return list.filter((e) => selectedProjectIds.includes(e.project_id));
  }, [timeEntries, selectedProjectIds]);

  const entriesByDate = useMemo(() => {
    const map: Record<string, TimeEntry[]> = {};
    weekDates.forEach((d) => {
      map[d] = entriesList.filter((e) => e.date.startsWith(d));
    });
    return map;
  }, [weekDates, entriesList]);

  const totalMs = useMemo(
    () => entriesList.reduce((sum, e) => sum + e.time, 0),
    [entriesList]
  );

  const handleEntryClick = (entry: TimeEntry) => {
    dispatch(CurrentTimeEntryActions.setCurrentTimeEntry(entry));
    dispatch(TimeEntryBuilderActions.openEditModal());
  };

  const projectList = Object.values(projects).filter((p) => p.is_active);

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.weekPicker}>
          <label className={styles.label}>Week of</label>
          <input
            type="date"
            value={weekStart.toISOString().slice(0, 10)}
            onChange={(e) => {
              const v = e.target.value;
              if (v) {
                const d = new Date(v);
                const day = d.getDay();
                const mondayOffset = day === 0 ? -6 : 1 - day;
                d.setDate(d.getDate() + mondayOffset);
                setWeekStart(d);
              }
            }}
            className={styles.dateInput}
          />
        </div>
        <div className={styles.projectFilter}>
          <label className={styles.label}>Projects</label>
          <select
            multiple
            value={selectedProjectIds}
            onChange={(e) => {
              const opts = Array.from(e.target.selectedOptions, (o) => o.value);
              dispatch(TimeEntryBuilderActions.setSelectedProjectIds(opts));
            }}
            className={styles.multiSelect}
          >
            {projectList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.grid}>
        {weekDates.map((dateStr) => (
          <DayColumn
            key={dateStr}
            dateStr={dateStr}
            entries={entriesByDate[dateStr] ?? []}
            projects={projects}
            onEntryClick={handleEntryClick}
          />
        ))}
      </div>

      <div className={styles.footer}>
        Total: {msToTime(totalMs)}
      </div>
    </div>
  );
};

const styles = {
  container: `
    flex flex-col overflow-hidden rounded border border-gray-300 bg-white
  `,
  toolbar: `
    flex flex-wrap items-end gap-4 border-b border-gray-300 bg-gray-50 p-4
  `,
  weekPicker: `
    flex flex-col gap-1.5
  `,
  projectFilter: `
    flex flex-col gap-1.5
  `,
  label: `
    text-xs font-medium text-gray-600
  `,
  dateInput: `
    min-w-[140px] rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  `,
  multiSelect: `
    min-w-[160px] rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  `,
  grid: `
    flex flex-1 overflow-x-auto
  `,
  footer: `
    border-t border-gray-300 bg-gray-50 px-4 py-2.5 text-xs font-medium text-gray-700
  `,
};
