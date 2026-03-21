'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/src/store/hooks';
import { authActions } from '@/src/store/config/auth';
import { supabase } from '@/src/config/supabase';

/**
 * Auth Callback Page
 * Handles OAuth callbacks from Supabase Auth (Google OAuth, email invites, password resets, etc.)
 * 
 * Flow:
 * 1. User clicks Google sign-in or invite link in email
 * 2. Supabase redirects to this page with auth token in URL
 * 3. We exchange the token for a session
 * 4. Set user in Redux state
 * 5. Redirect user to dashboard or appropriate page
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if we have a valid session after Supabase processes the callback
        // For Google OAuth, Supabase automatically exchanges the code for a session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('❌ Auth callback error:', error);
          setStatus('error');
          setMessage('Failed to authenticate. Please try again.');
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.replace('/log-in');
          }, 3000);
          return;
        }

        if (session?.user) {
          // Set user in Redux state
          dispatch(authActions.setUser({
            id: session.user.id,
            email: session.user.email || '',
          }));
          dispatch(authActions.setSession(session as unknown as Record<string, unknown>));
          dispatch(authActions.setInitialized(true));

          // Check if this is a new user from an invite
          // Supabase sends 'invited_at' in user metadata when user accepts invite
          const user = session.user;
          const invitedAt = user.user_metadata?.invited_at;
          const hasSetPassword = user.user_metadata?.password_set;
          
          // If user was invited and hasn't set their password yet, redirect to set-password page
          if (invitedAt && !hasSetPassword) {
            // First time login from invite - prompt for password
            setStatus('success');
            setMessage('Welcome! Please set your password...');
            
            setTimeout(() => {
              router.replace('/set-password');
            }, 1500);
          } else {
            // Google OAuth or regular login - redirect to dashboard
            setStatus('success');
            setMessage('Authentication successful! Redirecting...');
            
            setTimeout(() => {
              router.replace('/');
            }, 1500);
          }
        } else {
          // No session - might be password reset or other flow
          setStatus('error');
          setMessage('No active session found. Please try logging in.');
          
          setTimeout(() => {
            router.replace('/log-in');
          }, 3000);
        }
      } catch (error) {
        console.error('❌ Unexpected error in auth callback:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
        
        setTimeout(() => {
          router.replace('/log-in');
        }, 3000);
      }
    };

    handleAuthCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          {status === 'loading' && (
            <div className={styles.spinner} />
          )}
          {status === 'success' && (
            <svg className={styles.successIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {status === 'error' && (
            <svg className={styles.errorIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        
        <h1 className={styles.title}>
          {status === 'loading' && 'Authenticating...'}
          {status === 'success' && 'Success!'}
          {status === 'error' && 'Error'}
        </h1>
        
        <p className={styles.message}>{message}</p>
        
        {status === 'error' && (
          <button
            onClick={() => router.replace('/log-in')}
            className={styles.button}
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: `
    min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4
    sm:px-6 lg:px-8
  `,
  card: `
    max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center
  `,
  iconContainer: `
    flex justify-center mb-6
  `,
  spinner: `
    w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin
  `,
  successIcon: `
    w-16 h-16 text-green-600
  `,
  errorIcon: `
    w-16 h-16 text-red-600
  `,
  title: `
    text-2xl font-bold text-gray-900 mb-4
  `,
  message: `
    text-gray-600 mb-6
  `,
  button: `
    px-6 py-2 bg-blue-600 text-white rounded-lg font-medium
    hover:bg-blue-700 transition-colors
  `,
};
