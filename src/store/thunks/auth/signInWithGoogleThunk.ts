import type { AppThunk } from '../../store';
import { supabase } from '@/src/config/supabase';

export const signInWithGoogleThunk = (): AppThunk<Promise<200 | 500>> => {
  return async (): Promise<200 | 500> => {
    try {
      const origin = window.location.origin;
      const configuredBaseUrl = process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL?.trim();
      const isCurrentOriginLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
      const isConfiguredUrlLocalhost = configuredBaseUrl
        ? /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(configuredBaseUrl)
        : false;

      // Prevent production OAuth from being redirected to localhost when env vars are stale.
      const redirectBaseUrl =
        configuredBaseUrl && !(isConfiguredUrlLocalhost && !isCurrentOriginLocalhost)
          ? configuredBaseUrl
          : origin;
      const normalizedRedirectBaseUrl = redirectBaseUrl.replace(/\/$/, '');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${normalizedRedirectBaseUrl}/auth/callback`,
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
