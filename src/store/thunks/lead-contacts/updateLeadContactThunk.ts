import type { AppThunk } from '../../store';
import { updateLeadContact } from '@/src/api/lead-contacts';
import { LeadContactsActions } from '../../dumps/leadContacts';
import { CurrentLeadContactActions } from '../../current';
import type { LeadContact } from '@/src/model/lead-contact';

type ResponseType = Promise<200 | 400 | 500>;

export const updateLeadContactThunk = (
  contactId: string,
  payload: Partial<Omit<LeadContact, 'id' | 'lead_id' | 'created_at'>>,
  options?: { preserveCurrent?: boolean }
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await updateLeadContact(contactId, payload);

      if (response.success && response.data) {
        dispatch(LeadContactsActions.updateLeadContact(response.data));
        if (options?.preserveCurrent) {
          dispatch(CurrentLeadContactActions.setLeadContact(response.data));
        } else {
          dispatch(CurrentLeadContactActions.reset());
        }
        return 200;
      }

      return 400;
    } catch (error: unknown) {
      console.error('❌ updateLeadContactThunk error:', error);
      return 500;
    }
  };
};
