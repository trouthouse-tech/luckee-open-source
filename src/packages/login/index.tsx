'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { logInThunk, initializeAuthThunk, signInWithGoogleThunk } from '@/src/store/thunks/auth';
import { DASHBOARD_PATH } from '@/src/config/routes';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, hasInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuthThunk());
  }, [dispatch]);

  useEffect(() => {
    if (hasInitialized && isAuthenticated) {
      router.replace(DASHBOARD_PATH);
    }
  }, [hasInitialized, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await dispatch(logInThunk({ email, password }));

      if (result === 200) {
        router.replace(DASHBOARD_PATH);
      } else {
        setError('Invalid email or password');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await dispatch(signInWithGoogleThunk());

      if (result === 500) {
        setError('Failed to sign in with Google. Please try again.');
        setIsLoading(false);
      }
      // Note: On success (200), redirect happens automatically via OAuth flow
    } catch {
      setError('Google sign-in failed. Please try again.');
      setIsLoading(false);
    }
  };

  if (!hasInitialized) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Sign In</h1>
        <p className={styles.subtitle}>Enter your credentials to access Luckee</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              disabled={isLoading}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.divider}>
          <span className={styles.dividerText}>or</span>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className={styles.googleButton}
        >
          <svg className={styles.googleIcon} viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className={styles.googleButtonText}>
            Continue with Google
          </span>
        </button>
      </div>
    </div>
  );
};

const styles = {
  loadingContainer: `
    min-h-screen bg-gray-50 flex items-center justify-center
  `,
  spinner: `
    w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin
  `,
  container: `
    min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8
  `,
  loginCard: `
    max-w-md w-full bg-white rounded-lg shadow-md p-8
  `,
  title: `
    text-2xl font-bold text-gray-900 text-center mb-2
  `,
  subtitle: `
    text-gray-600 text-center mb-8
  `,
  form: `
    space-y-6
  `,
  field: `
    space-y-2
  `,
  label: `
    block text-sm font-medium text-gray-700
  `,
  input: `
    block w-full px-3 py-2 border border-gray-300 rounded-md
    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-100 disabled:cursor-not-allowed
  `,
  submitButton: `
    w-full flex justify-center py-2 px-4 border border-transparent rounded-md
    text-sm font-medium text-white bg-blue-600 hover:bg-blue-700
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  error: `
    bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm
  `,
  divider: `
    relative my-6 flex items-center
    before:flex-1 before:border-t before:border-gray-300
    after:flex-1 after:border-t after:border-gray-300
  `,
  dividerText: `
    text-sm text-gray-500 px-4 bg-white
  `,
  googleButton: `
    w-full flex items-center justify-center gap-3 py-2 px-4
    border border-gray-300 rounded-md bg-white
    text-sm font-medium text-gray-700
    hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed
    shadow-sm
  `,
  googleIcon: `
    w-5 h-5
  `,
  googleButtonText: `
    text-gray-700
  `,
};
