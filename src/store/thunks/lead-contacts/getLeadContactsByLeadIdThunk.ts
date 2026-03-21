import type { AppThunk } from '../../store';
import { getLeadContactsByLeadId } from '@/src/api/lead-contacts';
import { LeadContactsActions } from '../../dumps/leadContacts';

type ResponseType = Promise<200 | 400 | 500>;

export const getLeadContactsByLeadIdThunk = (
  leadId: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getLeadContactsByLeadId(leadId);

      if (response.success && response.data) {
        dispatch(LeadContactsActions.addLeadContacts(response.data));
        return 200;
      }

      return 400;
    } catch (error: unknown) {
      console.error('❌ getLeadContactsByLeadIdThunk error:', error);
      return 500;
    }
  };
};
