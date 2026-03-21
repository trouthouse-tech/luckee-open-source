import type { AppThunk } from '../../store';
import { createCustomer } from '@/src/api/customers';
import { CustomersActions } from '../../dumps/customers';
import { CustomerBuilderActions } from '../../builders/customerBuilder';

type ResponseType = Promise<200 | 400 | 500>;

export const createCustomerThunk = (payload: {
  user_id: string;
  name: string;
}): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      dispatch(CustomerBuilderActions.setIsSaving(true));
      dispatch(CustomerBuilderActions.setErrorMessage(null));

      const response = await createCustomer(payload);

      if (response.success && response.data) {
        dispatch(CustomersActions.addCustomer(response.data));
        dispatch(CustomerBuilderActions.setIsSaving(false));
        dispatch(CustomerBuilderActions.closeAddModal());
        return 200;
      }

      dispatch(
        CustomerBuilderActions.setErrorMessage(
          response.error || 'Failed to create customer'
        )
      );
      dispatch(CustomerBuilderActions.setIsSaving(false));
      return 400;
    } catch (error: unknown) {
      console.error('❌ createCustomerThunk error:', error);
      dispatch(
        CustomerBuilderActions.setErrorMessage(
          error instanceof Error ? error.message : 'Failed to create customer'
        )
      );
      dispatch(CustomerBuilderActions.setIsSaving(false));
      return 500;
    }
  };
};
