'use client';

import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { getAllCustomersThunk } from '@/src/store/thunks/customers';
import { getAllProjectsThunk } from '@/src/store/thunks/projects';

/**
 * Load customers first, then projects for the current user when on time-tracking.
 */
export const useProjectsInitialization = () => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const loaded = useRef(false);

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      await dispatch(getAllCustomersThunk(userId));
      dispatch(getAllProjectsThunk(userId));
    };
    load();
    loaded.current = true;
  }, [userId, dispatch]);
};
