'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useAppSelector } from '@/src/store/hooks';
import { formatDateMedium } from '@/src/utils/date-time';
import type { CustomerTabType } from './CustomerTabs';
import { CustomerTabs } from './CustomerTabs';
import { CustomerProjects } from './customer-projects';

/**
 * Customer detail view. Reads currentCustomer from Redux and displays customer info.
 * No back button or page header; breadcrumbs (Customers / name with dropdown) live in AppLayout.
 * Tabs: Projects (from Redux, filtered by current customer id).
 * Add project action and rightContent run through customerBuilder in CustomerTabs.
 */
export const CustomerDetail = () => {
  const [activeTab, setActiveTab] = useState<CustomerTabType>('projects');
  const currentCustomerId = useAppSelector((state) => state.currentCustomer.customerId);
  const customers = useAppSelector((state) => state.customers);

  const customer = useMemo(() => {
    if (!currentCustomerId) return null;
    return customers[currentCustomerId] ?? null;
  }, [currentCustomerId, customers]);

  if (!currentCustomerId || !customer) {
    return (
      <div className={styles.emptyContainer}>
        <p className={styles.emptyText}>No customer selected</p>
        <Link href="/customers" className={styles.emptyLink}>
          Go to Customers
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.topCard}>
        <div className={styles.cardRow}>
          <div className={styles.cardCell}>
            <span className={styles.cardLabel}>Name</span>
            <span className={styles.cardValue}>{customer.name}</span>
          </div>
          <div className={styles.cardCell}>
            <span className={styles.cardLabel}>Status</span>
            <span className={`${styles.badge} ${styles.statusBadge}`}>
              {customer.status.replace('_', ' ')}
            </span>
          </div>
          <div className={styles.cardCell}>
            <span className={styles.cardLabel}>Created</span>
            <span className={styles.cardValue}>{formatDateMedium(customer.created_at)}</span>
          </div>
          <div className={styles.cardCell}>
            <span className={styles.cardLabel}>Updated</span>
            <span className={styles.cardValue}>{formatDateMedium(customer.updated_at)}</span>
          </div>
        </div>
      </div>

      <CustomerTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <CustomerProjects activeTab={activeTab} customerId={currentCustomerId} />
    </div>
  );
};

const styles = {
  pageWrapper: `
    w-full max-w-[1400px] mx-auto flex flex-col gap-4
  `,
  topCard: `
    bg-white border border-gray-200 rounded p-4
  `,
  cardRow: `
    flex flex-wrap items-center gap-x-8 gap-y-3
  `,
  cardCell: `
    flex items-center gap-2
  `,
  cardLabel: `
    text-xs font-medium text-gray-500
  `,
  cardValue: `
    text-sm font-medium text-gray-900
  `,
  badge: `
    inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium
  `,
  statusBadge: `
    bg-gray-100 text-gray-800
  `,
  emptyContainer: `
    flex flex-col items-center justify-center h-full space-y-4
  `,
  emptyText: `
    text-gray-600 text-lg
  `,
  emptyLink: `
    text-sm text-blue-600 hover:text-blue-700 hover:underline
  `,
};
