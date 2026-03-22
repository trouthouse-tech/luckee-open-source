'use client';

import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { AppLayoutHeader, type AppLayoutBreadcrumb } from './app-layout-header';
import { getNavigationLinks, type NavigationLink, type NavigationRoute } from './navigation';

const isNavigationRoute = (link: NavigationLink): link is NavigationRoute =>
  'href' in link;
import { Sidebar } from './sidebar';

const SIDEBAR_VISIBLE_KEY = 'luckee-sidebar-visible';

const getStoredSidebarVisible = (): boolean => {
  if (typeof window === 'undefined') return true;
  try {
    const stored = localStorage.getItem(SIDEBAR_VISIBLE_KEY);
    if (stored === null) return true;
    return stored === 'true';
  } catch {
    return true;
  }
};

type AppLayoutProps = {
  children: React.ReactNode;
  fullWidth?: boolean;
  breadcrumbs?: AppLayoutBreadcrumb[];
  onBaseBreadcrumbClick?: () => void;
  baseBreadcrumbOverride?: AppLayoutBreadcrumb;
};

export const AppLayout = (props: AppLayoutProps) => {
  const { children, fullWidth = false, breadcrumbs = [], onBaseBreadcrumbClick, baseBreadcrumbOverride } = props;
  
  const [isSidebarVisible, setIsSidebarVisible] = useState(getStoredSidebarVisible);
  const pathname = usePathname();
  const navigationLinks = useMemo(() => getNavigationLinks(), []);
  
  const activeNavigationLink = useMemo(() => {
    for (const link of navigationLinks) {
      if (isNavigationRoute(link)) {
        if (link.href === '/dashboard') {
          if (pathname === '/dashboard') return link;
          continue;
        }
        if (pathname === link.href || pathname.startsWith(`${link.href}/`)) {
          return link;
        }
      }
      if (link.children) {
        const childMatch = link.children.some(
          (child) =>
            pathname === child.href || pathname.startsWith(`${child.href}/`)
        );
        if (childMatch) return link;
      }
    }
    return undefined;
  }, [navigationLinks, pathname]);

  const breadcrumbItems = useMemo(() => {
    const baseBreadcrumb = (() => {
      if (baseBreadcrumbOverride) {
        if (onBaseBreadcrumbClick && !baseBreadcrumbOverride.onSelect && !baseBreadcrumbOverride.href) {
          return {
            ...baseBreadcrumbOverride,
            onSelect: onBaseBreadcrumbClick,
          };
        }
        return { ...baseBreadcrumbOverride };
      }

      if (!activeNavigationLink) {
        return null;
      }

      const defaultBreadcrumb: AppLayoutBreadcrumb = {
        label: activeNavigationLink.name,
      };

      if (onBaseBreadcrumbClick) {
        defaultBreadcrumb.onSelect = onBaseBreadcrumbClick;
      } else if (isNavigationRoute(activeNavigationLink)) {
        defaultBreadcrumb.href = activeNavigationLink.href;
      }

      return defaultBreadcrumb;
    })();

    if (!baseBreadcrumb) {
      return breadcrumbs;
    }

    return [baseBreadcrumb, ...breadcrumbs];
  }, [activeNavigationLink, baseBreadcrumbOverride, breadcrumbs, onBaseBreadcrumbClick]);

  const handleToggleSidebar = () => {
    setIsSidebarVisible((previous) => {
      const next = !previous;
      try {
        localStorage.setItem(SIDEBAR_VISIBLE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <div className={styles.appShell}>
      {isSidebarVisible && <Sidebar />}
      <div className={styles.mainColumn}>
        <AppLayoutHeader 
          isSidebarVisible={isSidebarVisible}
          onToggleSidebar={handleToggleSidebar}
          breadcrumbItems={breadcrumbItems} 
        />
        <div className={fullWidth ? styles.contentFullWidth : styles.contentStandard}>
          <div className={fullWidth ? styles.innerFullWidth : styles.innerStandard}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  appShell: `flex h-screen overflow-hidden bg-gray-50`,
  mainColumn: `flex flex-1 flex-col overflow-y-auto`,
  contentStandard: `flex-1 p-3`,
  contentFullWidth: `flex-1 p-3`,
  innerStandard: `w-full`,
  innerFullWidth: `w-full`,
};
