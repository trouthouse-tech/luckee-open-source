'use client';

import { useRouter, useParams } from 'next/navigation';
import { useMemo, useEffect } from 'react';
import { TimeTracking } from '@/src/packages/time-tracking';
import { AppLayout } from '@/src/components';

const VALID_VIEWS = ['table', 'calendar'] as const;
type View = (typeof VALID_VIEWS)[number];

const isValidView = (v: string | undefined): v is View =>
  v !== undefined && VALID_VIEWS.includes(v as View);

export default function TimeTrackingViewPage() {
  const router = useRouter();
  const params = useParams();
  const view: View = isValidView(params?.view as string | undefined) ? (params.view as View) : 'table';

  useEffect(() => {
    if (!isValidView(params?.view as string | undefined)) {
      router.replace('/time-tracking/table');
    }
  }, [params?.view, router]);

  const breadcrumbs = useMemo(
    () => [
      {
        label: view === 'table' ? 'Table' : 'Calendar',
        menuItems: [
          {
            label: 'Table',
            onSelect: () => router.push('/time-tracking/table'),
            isActive: view === 'table',
          },
          {
            label: 'Calendar',
            onSelect: () => router.push('/time-tracking/calendar'),
            isActive: view === 'calendar',
          },
        ],
      },
    ],
    [view, router],
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <TimeTracking view={view} />
    </AppLayout>
  );
}
