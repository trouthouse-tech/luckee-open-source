import type { AppThunk } from '../../store';
import { getAllCustomers } from '@/src/api/customers';
import { CustomersActions } from '../../dumps/customers';

type ResponseType = Promise<200 | 400 | 500>;

export const getAllCustomersThunk = (userId: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getAllCustomers(userId);

      if (response.success && response.data) {
        dispatch(CustomersActions.setCustomers(response.data));
        return 200;
      }

      if (
        response.error?.includes('not available yet') ||
        response.error?.includes('not found')
      ) {
        dispatch(CustomersActions.setCustomers([]));
        return 200;
      }

      return 400;
    } catch (error: unknown) {
      console.error('❌ getAllCustomersThunk error:', error);
      return 500;
    }
  };
};
