import type { AppThunk } from '../../store';
import { authActions } from '../../config/auth';
import { supabase } from '@/src/config/supabase';

export const initializeAuthThunk = (): AppThunk<Promise<void>> => {
  return async (dispatch): Promise<void> => {
    try {
      dispatch(authActions.setLoading(true));
      
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('❌ Auth initialization error:', error);
        dispatch(authActions.setUser(null));
        dispatch(authActions.setSession(null));
        dispatch(authActions.setInitialized(true));
        dispatch(authActions.setLoading(false));
        return;
      }

      if (session?.user) {
        dispatch(authActions.setUser({
          id: session.user.id,
          email: session.user.email || '',
        }));
        dispatch(authActions.setSession(session as unknown as Record<string, unknown>));
      } else {
        dispatch(authActions.setUser(null));
        dispatch(authActions.setSession(null));
      }

      dispatch(authActions.setInitialized(true));
      dispatch(authActions.setLoading(false));
    } catch (error) {
      console.error('❌ Auth initialization error:', error);
      dispatch(authActions.setUser(null));
      dispatch(authActions.setSession(null));
      dispatch(authActions.setInitialized(true));
      dispatch(authActions.setLoading(false));
    }
  };
};
