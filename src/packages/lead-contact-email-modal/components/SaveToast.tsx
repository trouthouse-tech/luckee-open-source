'use client';

import { Check } from 'lucide-react';
import { useAppSelector } from '@/src/store/hooks';

export const SaveToast = () => {
  const visible = useAppSelector(
    (s) => s.leadContactEmailBuilder.saveToastVisible
  );
  const message = useAppSelector(
    (s) => s.leadContactEmailBuilder.saveToastMessage
  );
  if (!visible) return null;
  return (
    <div className={styles.toast}>
      <Check className={styles.icon} />
      <span className={styles.msg}>{message}</span>
    </div>
  );
};

const styles = {
  toast: `
    fixed bottom-6 right-6 z-[60] flex items-center gap-2
    bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg
  `,
  icon: `h-5 w-5 shrink-0`,
  msg: `text-sm font-medium`,
};
