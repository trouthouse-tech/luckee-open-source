'use client';

import { useAppSelector } from '@/src/store/hooks';
import { Mail } from 'lucide-react';

export const QueueStatusBadge = () => {
  const { queueStatus } = useAppSelector((s) => s.leadContactBuilder);
  if (!queueStatus) return null;
  const label =
    queueStatus.status === 'queued'
      ? 'Queued'
      : queueStatus.status === 'sending'
        ? 'Sending…'
        : queueStatus.status === 'sent'
          ? 'Sent'
          : 'Failed';
  return (
    <span className={styles.badge}>
      <Mail className={styles.icon} aria-hidden />
      {label}
    </span>
  );
};

const styles = {
  badge: `
    inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium
    rounded-full bg-sky-50 text-sky-800 border border-sky-200
  `,
  icon: `h-3.5 w-3.5 shrink-0`,
};
