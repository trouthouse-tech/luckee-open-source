'use client';

import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { getAllTimeEntriesThunk } from '@/src/store/thunks/time-entries';

/**
 * Load time entries for the current user when on time-tracking.
 * Call with a date range (e.g. start of month to end of month or next month).
 */
export const useTimeEntriesInitialization = (
  startDate: string,
  endDate: string
) => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const loaded = useRef(false);

  useEffect(() => {
    if (!userId || !startDate || !endDate) return;
    dispatch(getAllTimeEntriesThunk(userId, startDate, endDate));
    loaded.current = true;
  }, [userId, startDate, endDate, dispatch]);
};
