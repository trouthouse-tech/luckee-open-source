'use client';

import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { TicketFiltersBuilderActions } from '@/src/store/builders/ticketFiltersBuilder';

export const TicketFilterCustomerDropdown = () => {
  const dispatch = useAppDispatch();
  const customers = useAppSelector((state) => state.customers);
  const selectedCustomers = useAppSelector((state) => state.ticketFiltersBuilder.selectedCustomers);

  const customerOptions = useMemo(() => {
    return Object.values(customers).sort((a, b) => a.name.localeCompare(b.name));
  }, [customers]);

  if (customerOptions.length === 0) return null;

  return (
    <div className={styles.dropdownWrapper}>
      <details className={styles.dropdown}>
        <summary className={styles.dropdownSummary}>
          Customers {selectedCustomers.length > 0 && `(${selectedCustomers.length})`}
        </summary>
        <div className={styles.dropdownContent}>
          {customerOptions.map((customer) => (
            <label key={customer.id} className={styles.dropdownItem}>
              <input
                type="checkbox"
                checked={selectedCustomers.includes(customer.id)}
                onChange={() => dispatch(TicketFiltersBuilderActions.toggleCustomer(customer.id))}
                className={styles.checkbox}
              />
              <span>{customer.name}</span>
            </label>
          ))}
        </div>
      </details>
    </div>
  );
};

const styles = {
  dropdownWrapper: `
    relative
  `,
  dropdown: `
    relative
  `,
  dropdownSummary: `
    h-7 px-2 py-1 text-xs border border-gray-300 rounded bg-white
    cursor-pointer hover:bg-gray-50 transition-colors list-none flex items-center
  `,
  dropdownContent: `
    absolute top-full left-0 mt-1 w-64 max-h-60 overflow-y-auto
    bg-white border border-gray-300 rounded shadow-lg z-10 py-1
  `,
  dropdownItem: `
    flex items-start gap-2 px-2 py-1.5
    hover:bg-gray-50 cursor-pointer text-xs
  `,
  checkbox: `
    cursor-pointer mt-0.5 flex-shrink-0
  `,
};
