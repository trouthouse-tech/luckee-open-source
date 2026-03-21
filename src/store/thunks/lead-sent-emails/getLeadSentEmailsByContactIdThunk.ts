import type { AppThunk } from '@/src/store';
import { LeadSentEmailsActions } from '../../dumps/leadSentEmails';
import { getLeadSentEmailsByContactId } from '@/src/api/lead-sent-emails';

type ResponseType = Promise<200 | 400 | 500>;

export const getLeadSentEmailsByContactIdThunk = (
  contactId: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getLeadSentEmailsByContactId(contactId);
      if (!response.success || !response.data) return 400;
      dispatch(LeadSentEmailsActions.addLeadSentEmails(response.data));
      return 200;
    } catch (error) {
      console.error('getLeadSentEmailsByContactIdThunk:', error);
      return 500;
    }
  };
};
