import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { getAllTicketsThunk } from '@/src/store/thunks/tickets';

/**
 * Hook to initialize tickets data on mount
 * Loads all tickets if authenticated and not already loaded
 * Matches other *Initialization hooks (load once, ref guard).
 */
export const useTicketsInitialization = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const userId = useAppSelector((state) => state.auth.user?.id);
  const tickets = useAppSelector((state) => state.tickets);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      return;
    }

    // Check if already loaded (any tickets exist)
    const hasLoaded = Object.keys(tickets).length > 0;
    if (hasLoaded) {
      return;
    }

    // Load all tickets
    dispatch(getAllTicketsThunk(userId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, userId]);
};
