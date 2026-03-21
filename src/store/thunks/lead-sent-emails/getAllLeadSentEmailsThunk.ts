import type { AppThunk } from '@/src/store';
import { LeadSentEmailsActions } from '../../dumps/leadSentEmails';
import { getAllLeadSentEmails } from '@/src/api/lead-sent-emails';

type ResponseType = Promise<200 | 400 | 500>;

export const getAllLeadSentEmailsThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getAllLeadSentEmails();

      if (response.success && response.data) {
        dispatch(LeadSentEmailsActions.addLeadSentEmails(response.data));
        return 200;
      }

      if (
        response.error?.includes('not found') ||
        response.error?.includes('Invalid response')
      ) {
        dispatch(LeadSentEmailsActions.addLeadSentEmails([]));
        return 200;
      }

      return 400;
    } catch (error: unknown) {
      console.error('❌ getAllLeadSentEmailsThunk error:', error);
      return 500;
    }
  };
};
