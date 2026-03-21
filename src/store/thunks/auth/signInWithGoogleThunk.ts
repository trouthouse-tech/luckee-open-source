import type { AppThunk } from '../../store';
import { supabase } from '@/src/config/supabase';

export const signInWithGoogleThunk = (): AppThunk<Promise<200 | 500>> => {
  return async (): Promise<200 | 500> => {
    try {
      const redirectBaseUrl = process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL || window.location.origin;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${redirectBaseUrl}/auth/callback`,
        },
      });

      if (error) {
        console.error('❌ Google sign-in error:', error);
        return 500;
      }

      // Note: Redirect happens immediately, so this just means "redirect initiated"
      return 200;
    } catch (error) {
      console.error('❌ Google sign-in error:', error);
      return 500;
    }
  };
};
