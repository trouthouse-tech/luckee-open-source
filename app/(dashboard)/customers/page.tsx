'use client';

import { Customers } from '@/src/packages/customers';
import { AppLayout } from '@/src/components';

export default function CustomersPage() {
  return (
    <AppLayout>
      <Customers />
    </AppLayout>
  );
}
