'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TimeTrackingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/time-tracking/table');
  }, [router]);

  return null;
}
