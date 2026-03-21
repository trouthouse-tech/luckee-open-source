import type { AppThunk } from '../../store';
import { authActions } from '../../config/auth';
import { supabase } from '@/src/config/supabase';

export const logOutThunk = (): AppThunk<Promise<200 | 500>> => {
  return async (dispatch): Promise<200 | 500> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Logout error:', error);
        return 500;
      }

      dispatch(authActions.signOut());
      return 200;
    } catch (error) {
      console.error('❌ Logout error:', error);
      return 500;
    }
  };
};
