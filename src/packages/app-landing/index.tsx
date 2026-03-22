'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { initializeAuthThunk } from '@/src/store/thunks/auth';
import { DASHBOARD_PATH } from '@/src/config/routes';

/**
 * Public landing for the OSS app: short pitch + log in. Full marketing/docs stay on luckee-marketing.
 * Signed-in users are sent to the dashboard.
 */
export const AppLandingPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, hasInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuthThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!hasInitialized || !isAuthenticated) return;
    router.replace(DASHBOARD_PATH);
  }, [hasInitialized, isAuthenticated, router]);

  if (!hasInitialized) {
    return (
      <div className={styles.centered}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.logoMark}>L</div>
        <h1 className={styles.title}>Luckee</h1>
        <p className={styles.subtitle}>
          Founder workspace for pipeline and delivery — leads, outbound, customers, projects, and
          more. Self-host this app and sign in to continue.
        </p>
        <Link href="/log-in" className={styles.cta}>
          Log in
        </Link>
      </main>
    </div>
  );
};

const styles = {
  page: `min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6`,
  main: `max-w-md w-full flex flex-col items-center text-center`,
  centered: `min-h-screen bg-gray-50 flex items-center justify-center`,
  spinner: `
    w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin
  `,
  logoMark: `
    flex h-14 w-14 items-center justify-center rounded-xl bg-[#FF7C1E] text-white text-xl font-bold
    shadow-sm
  `,
  title: `mt-6 text-3xl font-bold tracking-tight text-gray-900`,
  subtitle: `mt-3 text-sm text-gray-600 leading-relaxed`,
  cta: `
    mt-8 inline-flex items-center justify-center rounded-md bg-[#FF7C1E] px-6 py-2.5 text-sm
    font-semibold text-white transition-opacity hover:opacity-90
  `,
};
