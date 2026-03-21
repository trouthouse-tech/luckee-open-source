import type { AppThunk } from '@/src/store';
import { LeadSentEmailsActions } from '../../dumps/leadSentEmails';
import { deleteLeadSentEmail } from '@/src/api/lead-sent-emails';

type ResponseType = Promise<200 | 400 | 500>;

export const deleteLeadSentEmailThunk = (id: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      await deleteLeadSentEmail(id);
      dispatch(LeadSentEmailsActions.removeLeadSentEmail(id));
      return 200;
    } catch (error: unknown) {
      console.error('❌ deleteLeadSentEmailThunk error:', error);
      return 500;
    }
  };
};
