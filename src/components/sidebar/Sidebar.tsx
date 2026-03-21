'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { getNavigationLinks } from '../navigation';
import type { NavigationLink, NavigationRoute } from '../navigation';

const isNavigationRoute = (link: NavigationLink): link is NavigationRoute =>
  'href' in link;

export const Sidebar = () => {
  const pathname = usePathname();
  const navigationLinks = useMemo(() => getNavigationLinks(), []);

  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    return new Set(
      navigationLinks
        .filter((link) => link.children && link.children.length > 0)
        .map((link) => link.name)
    );
  });

  const isLinkActive = useCallback(
    (href: string): boolean => {
      if (href === '/') {
        return pathname === '/';
      }
      return pathname.startsWith(href);
    },
    [pathname]
  );

  const isParentActive = useCallback(
    (link: NavigationLink): boolean => {
      if (!link.children?.length) return false;
      return link.children.some((child) => isLinkActive(child.href));
    },
    [isLinkActive]
  );

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.logoMark}>L</div>
          <span className={styles.logoText}>Luckee</span>
        </div>

        <nav className={styles.navigation}>
          <ul className={styles.menuList}>
            {navigationLinks.map((link) => {
              const hasChildren = Boolean(link.children?.length);
              const isExpanded = expandedItems.has(link.name);
              const parentActive = isParentActive(link);
              const routeLink = isNavigationRoute(link) ? link : null;
              const isActive =
                routeLink !== null ? isLinkActive(routeLink.href) : false;

              if (hasChildren) {
                const sectionOnly = routeLink === null;
                return (
                  <li key={link.name} className={styles.menuItem}>
                    <div className={styles.parentRow}>
                      {sectionOnly ? (
                        <button
                          type="button"
                          onClick={() => toggleExpanded(link.name)}
                          className={`${styles.menuButton} ${styles.parentLabelButton} ${
                            parentActive
                              ? styles.menuButtonActive
                              : styles.menuButtonInactive
                          }`}
                          aria-expanded={isExpanded}
                        >
                          <span>{link.name}</span>
                        </button>
                      ) : (
                        <Link
                          href={routeLink.href}
                          className={`${styles.menuButton} ${
                            isActive || parentActive
                              ? styles.menuButtonActive
                              : styles.menuButtonInactive
                          }`}
                        >
                          <span>{link.name}</span>
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => toggleExpanded(link.name)}
                        className={styles.expandButton}
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        <ChevronRight
                          className={`${styles.chevron} ${
                            isExpanded ? styles.chevronExpanded : ''
                          }`}
                        />
                      </button>
                    </div>
                    {isExpanded && link.children && (
                      <ul className={styles.childList}>
                        {link.children.map((child) => {
                          const childActive = isLinkActive(child.href);
                          return (
                            <li key={child.href} className={styles.childItem}>
                              <Link
                                href={child.href}
                                className={`${styles.childButton} ${
                                  childActive
                                    ? styles.menuButtonActive
                                    : styles.menuButtonInactive
                                }`}
                              >
                                <span>{child.name}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }

              if (!routeLink) return null;

              return (
                <li key={routeLink.href} className={styles.menuItem}>
                  <Link
                    href={routeLink.href}
                    className={`${styles.menuButton} ${
                      isActive ? styles.menuButtonActive : styles.menuButtonInactive
                    }`}
                  >
                    <span>{routeLink.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: `relative flex h-screen w-[229px] flex-col border-r border-gray-200 bg-white overflow-y-auto`,
  inner: `flex h-full flex-1 flex-col gap-3 p-3`,
  header: `flex items-center gap-2 rounded-md bg-gray-50 px-2 py-3`,
  logoMark: `flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-[#FF7C1E] text-white font-bold text-sm`,
  logoText: `font-display text-sm font-semibold text-gray-800`,
  navigation: `flex-1 overflow-y-auto`,
  menuList: `flex flex-col gap-0.5`,
  menuItem: `group relative`,
  menuButton: `flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900`,
  parentLabelButton: `w-full text-left border-0 bg-transparent cursor-pointer`,
  menuButtonActive: `bg-blue-50 text-blue-700`,
  menuButtonInactive: `bg-transparent`,
  parentRow: `flex items-center gap-0`,
  expandButton: `flex items-center justify-center w-6 h-6 rounded hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer p-0`,
  chevron: `w-3 h-3 text-gray-500 transition-transform duration-200`,
  chevronExpanded: `rotate-90`,
  childList: `ml-3 mt-0.5 flex flex-col gap-0.5 border-l border-gray-200 pl-2`,
  childItem: `group relative`,
  childButton: `flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900`,
};
