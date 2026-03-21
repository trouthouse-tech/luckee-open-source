import type { AppThunk } from '@/src/store';
import { LeadSentEmailsActions } from '../../dumps/leadSentEmails';
import {
  updateLeadSentEmail,
  type UpdateLeadSentEmailInput,
} from '@/src/api/lead-sent-emails';

type ResponseType = Promise<200 | 400 | 500>;

export const updateLeadSentEmailThunk = (
  sentEmailId: string,
  updates: UpdateLeadSentEmailInput
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await updateLeadSentEmail(sentEmailId, updates);

      if (response.success && response.data) {
        dispatch(LeadSentEmailsActions.updateLeadSentEmail(response.data));
        return 200;
      }

      return 400;
    } catch (error: unknown) {
      console.error('❌ updateLeadSentEmailThunk error:', error);
      return 500;
    }
  };
};
