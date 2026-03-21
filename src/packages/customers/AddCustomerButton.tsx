'use client';

import { useAppDispatch } from '@/src/store/hooks';
import { CustomerBuilderActions } from '@/src/store/builders/customerBuilder';

export const AddCustomerButton = () => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(CustomerBuilderActions.openAddModal());
  };

  return (
    <div className={styles.wrapper}>
      <button onClick={handleClick} className={styles.addButton} type="button">
        Add Customer
      </button>
    </div>
  );
};

const styles = {
  wrapper: `
    flex items-center ml-auto
  `,
  addButton: `
    h-7 px-3 py-1 text-xs bg-blue-600 text-white rounded font-medium
    hover:bg-blue-700 transition-colors
  `,
};
