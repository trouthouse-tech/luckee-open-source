'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { initializeAuthThunk } from '@/src/store/thunks/auth';
import { Dashboard } from '@/src/packages/dashboard';

export default function RootPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, hasInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuthThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!hasInitialized) return;

    if (!isAuthenticated) {
      router.replace('/log-in');
    }
  }, [hasInitialized, isAuthenticated, router]);

  if (!hasInitialized) {
    return (
      <div className={styles.container}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Dashboard />;
}

const styles = {
  container: `
    min-h-screen bg-gray-50 flex items-center justify-center
  `,
  spinner: `
    w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin
  `,
};
