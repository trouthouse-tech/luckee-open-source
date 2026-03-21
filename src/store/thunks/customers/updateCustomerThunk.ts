import type { AppThunk } from '../../store';
import { updateCustomer } from '@/src/api/customers';
import { CustomersActions } from '../../dumps/customers';

type ResponseType = Promise<200 | 400 | 500>;

export const updateCustomerThunk = (
  customerId: string,
  payload: { name: string }
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await updateCustomer(customerId, payload);

      if (response.success && response.data) {
        dispatch(CustomersActions.updateCustomer(response.data));
        return 200;
      }

      return 400;
    } catch (error: unknown) {
      console.error('❌ updateCustomerThunk error:', error);
      return 500;
    }
  };
};
