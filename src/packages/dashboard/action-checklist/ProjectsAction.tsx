'use client';

import { useRouter } from 'next/navigation';

/**
 * Action item for viewing projects.
 */
export const ProjectsAction = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/projects');
  };

  return (
    <button type="button" onClick={handleClick} className={styles.container}>
      <div className={styles.left}>
        <div className={styles.iconWrapper}>
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 11v6" strokeLinecap="round"/>
            <path d="M9 14h6" strokeLinecap="round"/>
          </svg>
        </div>
        <div className={styles.textGroup}>
          <span className={styles.label}>View projects</span>
          <span className={styles.sublabel}>Browse and manage projects</span>
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
    w-10 h-10 rounded-lg bg-violet-50
    flex items-center justify-center
    group-hover:bg-violet-100 transition-colors
  `,
  icon: `
    w-5 h-5 text-violet-600
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
