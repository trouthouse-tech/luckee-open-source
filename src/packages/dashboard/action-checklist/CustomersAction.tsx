'use client';

import { useRouter } from 'next/navigation';

/**
 * Action item for viewing customers.
 */
export const CustomersAction = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/customers');
  };

  return (
    <button type="button" onClick={handleClick} className={styles.container}>
      <div className={styles.left}>
        <div className={styles.iconWrapper}>
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className={styles.textGroup}>
          <span className={styles.label}>View customers</span>
          <span className={styles.sublabel}>Manage your customers</span>
        </div>
      </div>
      <div className={styles.right}>
        <span className={styles.chevron}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </button>
  );
};

const styles = {
  container: `
    w-full flex items-center justify-between px-5 py-4
    hover:bg-slate-50 transition-colors
    group text-left cursor-pointer border-0 bg-transparent
  `,
  left: `
    flex items-center gap-4
  `,
  iconWrapper: `
    w-10 h-10 rounded-lg bg-emerald-50
    flex items-center justify-center
    group-hover:bg-emerald-100 transition-colors
  `,
  icon: `
    w-5 h-5 text-emerald-600
  `,
  textGroup: `
    flex flex-col
  `,
  label: `
    text-sm font-medium text-slate-900
  `,
  sublabel: `
    text-xs text-slate-500
  `,
  right: `
    flex items-center
  `,
  chevron: `
    w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors
  `,
};
