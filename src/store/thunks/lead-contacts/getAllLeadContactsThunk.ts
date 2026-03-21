import type { AppThunk } from '../../store';
import { getAllLeadContacts } from '@/src/api/lead-contacts';
import { LeadContactsActions } from '../../dumps/leadContacts';

type ResponseType = Promise<200 | 400 | 500>;

export const getAllLeadContactsThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getAllLeadContacts();

      if (response.success && response.data) {
        dispatch(LeadContactsActions.addLeadContacts(response.data));
        return 200;
      }

      if (
        response.error?.includes('not available yet') ||
        response.error?.includes('not found') ||
        response.error?.includes('Invalid response')
      ) {
        dispatch(LeadContactsActions.addLeadContacts([]));
        return 200;
      }

      return 400;
    } catch (error: unknown) {
      console.error('❌ getAllLeadContactsThunk error:', error);
      return 500;
    }
  };
};
