import type { AppThunk } from '../../store';
import { authActions } from '../../config/auth';
import { supabase } from '@/src/config/supabase';

type LogInCredentials = {
  email: string;
  password: string;
};

export const logInThunk = (credentials: LogInCredentials): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch): Promise<200 | 400 | 500> => {
    try {
      dispatch(authActions.setLoading(true));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        console.error('❌ Login error:', error);
        dispatch(authActions.setLoading(false));
        return 400;
      }

      if (data.user && data.session) {
        dispatch(authActions.setUser({
          id: data.user.id,
          email: data.user.email || '',
        }));
        dispatch(authActions.setSession(data.session as unknown as Record<string, unknown>));
        dispatch(authActions.setLoading(false));
        return 200;
      }

      dispatch(authActions.setLoading(false));
      return 500;
    } catch (error) {
      console.error('❌ Login error:', error);
      dispatch(authActions.setLoading(false));
      return 500;
    }
  };
};
