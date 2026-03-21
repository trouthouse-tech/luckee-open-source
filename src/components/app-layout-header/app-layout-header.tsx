'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { AppLayoutBreadcrumb } from './app-layout-breadcrumb';

type AppLayoutHeaderProps = {
  isSidebarVisible: boolean;
  onToggleSidebar: () => void;
  breadcrumbItems: AppLayoutBreadcrumb[];
};

export const AppLayoutHeader = (props: AppLayoutHeaderProps) => {
  const { isSidebarVisible, onToggleSidebar, breadcrumbItems } = props;
  
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const breadcrumbRefs = useRef<Array<HTMLLIElement | null>>([]);

  const hasBreadcrumbItems = breadcrumbItems.length > 0;

  const toggleButtonLabel = useMemo(
    () => (isSidebarVisible ? 'Hide sidebar' : 'Show sidebar'),
    [isSidebarVisible],
  );

  useEffect(() => {
    const pendingIndex = breadcrumbItems.findIndex((item) => item.isPendingSelection);
    setOpenMenuIndex((current) => {
      if (pendingIndex !== -1) {
        return pendingIndex;
      }

      if (current !== null && breadcrumbItems[current]?.isPendingSelection) {
        return null;
      }

      if (current !== null && current >= breadcrumbItems.length) {
        return null;
      }

      return current;
    });
  }, [breadcrumbItems]);

  useEffect(() => {
    if (openMenuIndex === null) {
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const currentMenuElement = breadcrumbRefs.current[openMenuIndex];
      if (currentMenuElement && !currentMenuElement.contains(event.target as Node)) {
        setOpenMenuIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuIndex]);

  const handleToggleSidebar = () => {
    setOpenMenuIndex(null);
    onToggleSidebar();
  };

  const handleMenuToggle = (index: number) => {
    setOpenMenuIndex((current) => (current === index ? null : index));
  };

  const handleMenuItemSelect = (onSelect: () => void) => {
    onSelect();
    setOpenMenuIndex(null);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
        <ol className={styles.breadcrumbList}>
          <li className={styles.breadcrumbToggleItem}>
            <button
              type="button"
              onClick={handleToggleSidebar}
              className={styles.toggleButton}
              aria-pressed={isSidebarVisible}
              aria-label={toggleButtonLabel}
            >
              <span className={styles.toggleIcon} aria-hidden="true">
                <span className={styles.toggleIconBar}></span>
                <span className={styles.toggleIconBar}></span>
                <span className={styles.toggleIconBar}></span>
              </span>
            </button>
            {hasBreadcrumbItems && (
              <span className={styles.breadcrumbSeparator} aria-hidden="true">
                /
              </span>
            )}
          </li>
          {breadcrumbItems.map((item, index) => {
            const breadcrumbIndex = index;
            const isMenu = Boolean(item.menuItems && item.menuItems.length > 0);
            const isMenuOpen = openMenuIndex === breadcrumbIndex;
            const separator = index > 0;

            return (
              <li
                key={`${item.label}-${index}`}
                className={styles.breadcrumbItem}
                ref={(element) => {
                  breadcrumbRefs.current[breadcrumbIndex] = element;
                }}
              >
                {separator && (
                  <span className={styles.breadcrumbSeparator} aria-hidden="true">
                    /
                  </span>
                )}
                {isMenu ? (
                  <div className={styles.dropdownWrapper}>
                    <button
                      type="button"
                      className={`${styles.breadcrumbButton} ${
                        item.isPendingSelection ? styles.breadcrumbButtonPending : ''
                      }`}
                      onClick={() => handleMenuToggle(breadcrumbIndex)}
                      aria-expanded={isMenuOpen}
                    >
                      <span>{item.label}</span>
                      <svg
                        className={`${styles.breadcrumbChevron} ${isMenuOpen ? styles.breadcrumbChevronOpen : ''}`}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {isMenuOpen && item.menuItems && (
                      <div className={styles.dropdownMenu} role="menu">
                        {item.menuItems.map((menuItem) => (
                          <button
                            key={menuItem.label}
                            type="button"
                            className={`${styles.dropdownMenuItem} ${
                              menuItem.isActive ? styles.dropdownMenuItemActive : ''
                            }`}
                            onClick={() => handleMenuItemSelect(menuItem.onSelect)}
                            role="menuitem"
                            disabled={menuItem.isDisabled}
                          >
                            {menuItem.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : item.onSelect ? (
                  <button type="button" className={styles.breadcrumbAction} onClick={item.onSelect}>
                    {item.label}
                  </button>
                ) : item.href ? (
                  <Link href={item.href} className={styles.breadcrumbLink}>
                    {item.label}
                  </Link>
                ) : (
                  <span className={styles.breadcrumbCurrent}>{item.label}</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </header>
  );
};

const styles = {
  header: `
    flex items-center justify-between gap-3 border-b border-gray-200/60 bg-transparent px-4 py-2.5
  `,
  breadcrumbNav: `
    flex flex-1 items-center overflow-visible
  `,
  breadcrumbList: `
    flex min-w-0 items-center gap-2
  `,
  breadcrumbToggleItem: `
    flex items-center gap-2 text-xs text-gray-500
  `,
  toggleButton: `
    flex h-6 w-6 items-center justify-center rounded-md bg-transparent text-gray-700
    transition-colors hover:bg-gray-100 focus:outline-none cursor-pointer
  `,
  toggleIcon: `
    flex h-3 w-4 flex-col items-center justify-between
  `,
  toggleIconBar: `
    h-0.5 w-full rounded-full bg-gray-700 transition-colors
  `,
  breadcrumbSeparator: `
    text-xs font-normal text-gray-400
  `,
  breadcrumbItem: `
    relative flex min-w-0 items-center gap-2 text-xs font-medium text-gray-600
  `,
  dropdownWrapper: `
    relative flex items-center
  `,
  breadcrumbButton: `
    flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-700
    transition-colors hover:text-gray-900 hover:bg-gray-100/80 focus:outline-none
  `,
  breadcrumbButtonPending: `
    text-gray-500 italic
  `,
  breadcrumbChevron: `
    h-3.5 w-3.5 text-gray-500 transition-transform duration-150 ease-linear
  `,
  breadcrumbChevronOpen: `
    rotate-180
  `,
  dropdownMenu: `
    absolute left-0 top-full z-50 mt-1.5 min-w-[16rem] overflow-visible rounded-lg border border-gray-200 bg-white shadow-lg
  `,
  dropdownMenuItem: `
    flex w-full items-center justify-between px-3 py-2 text-left text-xs text-gray-700 transition-colors
    hover:bg-blue-50 hover:text-blue-600
  `,
  dropdownMenuItemActive: `
    bg-blue-100 text-blue-700 font-semibold
  `,
  breadcrumbAction: `
    truncate text-xs font-medium text-gray-600 transition-colors cursor-pointer
    hover:text-gray-900 focus:outline-none
  `,
  breadcrumbLink: `
    truncate text-xs font-medium text-gray-600 transition-colors hover:text-gray-900 focus:outline-none
  `,
  breadcrumbCurrent: `
    truncate text-xs font-medium text-gray-900
  `,
};
