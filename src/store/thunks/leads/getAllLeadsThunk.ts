import type { AppThunk } from '../../store';
import { getAllLeads } from '@/src/api/leads';
import { LeadsActions } from '../../dumps/leads';

type ResponseType = Promise<200 | 400 | 500>;

export const getAllLeadsThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getAllLeads();

      if (response.success && response.data) {
        dispatch(LeadsActions.setLeads(response.data));
        return 200;
      }

      if (
        response.error?.includes('not available yet') ||
        response.error?.includes('not found')
      ) {
        dispatch(LeadsActions.setLeads([]));
        return 200;
      }

      return 400;
    } catch (error: unknown) {
      console.error('❌ getAllLeadsThunk error:', error);
      return 500;
    }
  };
};
