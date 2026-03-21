'use client';

import { useAppSelector } from '@/src/store/hooks';
import { CustomersList } from './CustomersList';
import { AddCustomerModal } from './AddCustomerModal';
import { AddCustomerButton } from './AddCustomerButton';

/**
 * Customers package: action bar (Add Customer on the right) and list. Matches tickets layout pattern.
 */
export const Customers = () => {
  const customerBuilder = useAppSelector((state) => state.customerBuilder);

  return (
    <>
      <div className={styles.container}>
        <CustomersList />

        <div className={styles.bottomRow}>
          <AddCustomerButton />
        </div>
      </div>

      {customerBuilder.isAddModalOpen && <AddCustomerModal />}
    </>
  );
};

const styles = {
  container: `
    space-y-3
  `,
  bottomRow: `
    flex items-center
  `,
};
