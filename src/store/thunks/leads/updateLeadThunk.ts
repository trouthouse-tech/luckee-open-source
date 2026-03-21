import type { AppThunk } from '../../store';
import { updateLead } from '@/src/api/leads';
import { LeadsActions } from '../../dumps/leads';
import { CurrentLeadActions } from '../../current';
import type { Lead } from '@/src/model';

type ResponseType = Promise<200 | 400 | 500>;

export const updateLeadThunk = (
  leadId: string,
  payload: Partial<Lead>
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await updateLead(leadId, payload);

      if (response.success && response.data) {
        dispatch(LeadsActions.updateLead(response.data));
        dispatch(CurrentLeadActions.setCurrentLead(response.data));
        return 200;
      }

      return 400;
    } catch (error: unknown) {
      console.error('❌ updateLeadThunk error:', error);
      return 500;
    }
  };
};
