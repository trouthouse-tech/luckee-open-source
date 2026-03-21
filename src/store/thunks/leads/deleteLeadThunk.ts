import type { AppThunk } from '../../store';
import { deleteLead } from '@/src/api/leads';
import { LeadsActions } from '../../dumps/leads';

type ResponseType = Promise<200 | 400 | 500>;

export const deleteLeadThunk = (leadId: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await deleteLead(leadId);

      if (response.success) {
        dispatch(LeadsActions.deleteLead(leadId));
        return 200;
      }

      return 400;
    } catch (error: unknown) {
      console.error('❌ deleteLeadThunk error:', error);
      return 500;
    }
  };
};
