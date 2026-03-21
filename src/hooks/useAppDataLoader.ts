'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {
  getAllCustomersThunk,
  getAllLeadCategoriesThunk,
  getAllLeadContactEmailQueueThunk,
  getAllLeadContactsThunk,
  getAllLeadSentEmailsThunk,
  getAllLeadsThunk,
  getAllProjectsThunk,
  getAllTicketsThunk,
} from '@/src/store/thunks';

/**
 * Centralized data loader for Luckee app.
 * Loads all global data once when user is authenticated.
 * Should be called at the root level (Providers/layout).
 *
 * Replicates useAdminDataLoader pattern from tht-backend-panel:
 * load once, Promise.all, isLoading, hasLoaded ref.
 * Time entries are loaded separately via useTimeEntriesInitialization (date range).
 */
export const useAppDataLoader = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const userId = useAppSelector((state) => state.auth.user?.id);
  const hasLoaded = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      hasLoaded.current = false;
      setIsLoading(false);
      return;
    }

    if (hasLoaded.current) {
      setIsLoading(false);
      return;
    }

    hasLoaded.current = true;
    console.log('🚀 Starting app data load...');

    Promise.all([
      dispatch(getAllCustomersThunk(userId)),
      dispatch(getAllLeadCategoriesThunk()),
      dispatch(getAllLeadContactEmailQueueThunk()),
      dispatch(getAllLeadContactsThunk()),
      dispatch(getAllLeadSentEmailsThunk()),
      dispatch(getAllLeadsThunk()),
      dispatch(getAllProjectsThunk(userId)),
      dispatch(getAllTicketsThunk(userId)),
    ])
      .then((results) => {
        console.log('✅ App data load complete:', results);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('❌ Error loading app data:', error);
        setIsLoading(false);
      });
  }, [dispatch, isAuthenticated, userId]);

  return { isLoading, isAuthenticated };
};
