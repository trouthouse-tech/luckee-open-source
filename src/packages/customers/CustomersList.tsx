'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { setCurrentCustomerThunk } from '@/src/store/thunks/customers';
import type { Customer } from '@/src/model';

/**
 * Table-only presentation of customers. Used by the Customers package index.
 * Row click sets current customer and navigates to detail page.
 */
export const CustomersList = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const customers = useAppSelector((state) => state.customers);
  const customersArray = useMemo(() => Object.values(customers), [customers]);

  const handleRowClick = (customer: Customer) => {
    dispatch(setCurrentCustomerThunk(customer.id));
    router.push('/customers/detail');
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className={styles.tableWrapper}>
      {customersArray.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No customers yet.</p>
        </div>
      ) : (
        <div className={styles.tableScrollContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Name</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Created</th>
              </tr>
            </thead>
            <tbody>
              {customersArray.map((customer) => (
                <tr
                  key={customer.id}
                  className={styles.row}
                  onClick={() => handleRowClick(customer)}
                >
                  <td className={styles.cell}>
                    <span className={styles.nameText}>{customer.name}</span>
                  </td>
                  <td className={styles.cell}>
                    <span className={`${styles.badge} ${styles.statusBadge}`}>
                      {customer.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className={styles.cell}>{formatDate(customer.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  tableWrapper: `
    bg-white rounded border border-gray-300 overflow-hidden
  `,
  tableScrollContainer: `
    overflow-x-auto
  `,
  emptyState: `
    text-center py-12
  `,
  emptyText: `
    text-gray-500 text-sm
  `,
  table: `
    w-full border-collapse text-xs
  `,
  th: `
    px-3 py-2 text-left text-[10px] font-semibold text-gray-600
    uppercase tracking-wide bg-gray-100 border-b border-gray-300
  `,
  row: `
    hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0 cursor-pointer
  `,
  cell: `
    px-3 py-2 text-xs text-gray-700
  `,
  nameText: `
    font-medium text-gray-900
  `,
  badge: `
    inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium
  `,
  statusBadge: `
    bg-gray-100 text-gray-800
  `,
};
