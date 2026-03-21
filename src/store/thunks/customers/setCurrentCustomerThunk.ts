import type { AppThunk } from '../../store';
import { CurrentCustomerActions } from '../../current/currentCustomer';

/**
 * Set current customer for detail view.
 * Detail page reads the full customer from state.customers by this id.
 */
export const setCurrentCustomerThunk = (customerId: string): AppThunk<void> => {
  return (dispatch): void => {
    dispatch(CurrentCustomerActions.setCurrentCustomer(customerId));
  };
};
