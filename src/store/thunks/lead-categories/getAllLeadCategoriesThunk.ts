import type { AppThunk } from '../../store';
import { getAllLeadCategories } from '@/src/api/lead-categories';
import { LeadCategoriesActions } from '../../dumps/leadCategories';

type ResponseType = Promise<200 | 400 | 500>;

export const getAllLeadCategoriesThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getAllLeadCategories();

      if (response.success && response.data) {
        dispatch(LeadCategoriesActions.setLeadCategories(response.data));
        return 200;
      }

      if (
        response.error?.includes('not available yet') ||
        response.error?.includes('not found')
      ) {
        dispatch(LeadCategoriesActions.setLeadCategories([]));
        return 200;
      }

      return 400;
    } catch (error: unknown) {
      console.error('❌ getAllLeadCategoriesThunk error:', error);
      return 500;
    }
  };
};
