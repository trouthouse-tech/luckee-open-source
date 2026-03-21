'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { AppLayout } from '@/src/components';
import { CustomerDetail } from '@/src/packages/customer-detail';
import { setCurrentCustomerThunk } from '@/src/store/thunks/customers/setCurrentCustomerThunk';

/**
 * Customer Detail Page Route
 * Breadcrumbs: Customers / [customer name] with dropdown to switch customers.
 */
export default function CustomerDetailPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentCustomerId = useAppSelector((state) => state.currentCustomer.customerId);
  const customers = useAppSelector((state) => state.customers);

  const customer = useMemo(() => {
    if (!currentCustomerId) return null;
    return customers[currentCustomerId] ?? null;
  }, [currentCustomerId, customers]);

  const customerList = useMemo(
    () => Object.values(customers).sort((a, b) => a.name.localeCompare(b.name)),
    [customers],
  );

  const breadcrumbs = useMemo(
    () =>
      customer
        ? [
            {
              label: customer.name,
              menuItems: customerList.map((c) => ({
                label: c.name,
                onSelect: () => dispatch(setCurrentCustomerThunk(c.id)),
                isActive: c.id === currentCustomerId,
              })),
            },
          ]
        : [],
    [customer, customerList, currentCustomerId, dispatch],
  );

  const baseBreadcrumbOverride = useMemo(
    () => ({ label: 'Customers', href: '/customers' }),
    [],
  );

  useEffect(() => {
    if (!currentCustomerId) {
      router.replace('/customers');
    }
  }, [currentCustomerId, router]);

  return (
    <AppLayout
      baseBreadcrumbOverride={baseBreadcrumbOverride}
      breadcrumbs={breadcrumbs}
    >
      <CustomerDetail />
    </AppLayout>
  );
}
