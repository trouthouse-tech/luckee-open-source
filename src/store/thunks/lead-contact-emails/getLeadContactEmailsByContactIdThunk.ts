import type { AppThunk } from '@/src/store';
import { LeadContactEmailsActions } from '../../dumps/leadContactEmails';
import { getLeadContactEmailsByContactId } from '@/src/api/lead-contact-emails';

type ResponseType = Promise<200 | 400 | 500>;

export const getLeadContactEmailsByContactIdThunk = (
  contactId: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getLeadContactEmailsByContactId(contactId);
      if (!response.success || !response.data) {
        return 400;
      }
      dispatch(LeadContactEmailsActions.addLeadContactEmails(response.data));
      return 200;
    } catch (error) {
      console.error('getLeadContactEmailsByContactIdThunk:', error);
      return 500;
    }
  };
};
