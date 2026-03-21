import type { AppThunk } from '../../store';
import { createLeadContact } from '@/src/api/lead-contacts';
import { LeadContactsActions } from '../../dumps/leadContacts';
import { CurrentLeadContactActions } from '../../current';
import type { CreateLeadContactInput } from '@/src/model/lead-contact';

type ResponseType = Promise<200 | 400 | 500>;

export const createLeadContactThunk = (
  input: CreateLeadContactInput
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await createLeadContact(input);

      if (response.success && response.data) {
        dispatch(LeadContactsActions.updateLeadContact(response.data));
        dispatch(CurrentLeadContactActions.reset());
        return 200;
      }

      return 400;
    } catch (error: unknown) {
      console.error('❌ createLeadContactThunk error:', error);
      return 500;
    }
  };
};
