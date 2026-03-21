import type { AppThunk } from '../../store';
import { deleteLeadContact } from '@/src/api/lead-contacts';
import { LeadContactsActions } from '../../dumps/leadContacts';

type ResponseType = Promise<200 | 400 | 500>;

export const deleteLeadContactThunk = (
  contactId: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await deleteLeadContact(contactId);

      if (response.success) {
        dispatch(LeadContactsActions.removeLeadContact(contactId));
        return 200;
      }

      return 400;
    } catch (error: unknown) {
      console.error('❌ deleteLeadContactThunk error:', error);
      return 500;
    }
  };
};
