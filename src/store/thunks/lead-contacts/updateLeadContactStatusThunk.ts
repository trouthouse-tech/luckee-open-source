import type { AppThunk } from '@/src/store';
import { updateLeadContact } from '@/src/api/lead-contacts';
import { LeadContactsActions } from '../../dumps/leadContacts';
import { CurrentLeadContactActions } from '../../current';
import { LeadContactBuilderActions } from '../../builders';
import type { LeadContactStatus } from '@/src/model/lead-contact';

type ResponseType = Promise<200 | 400 | 500>;

export const updateLeadContactStatusThunk = (
  contactId: string,
  status: LeadContactStatus
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      dispatch(LeadContactBuilderActions.setUpdatingStatus(true));
      const response = await updateLeadContact(contactId, { status });
      if (response.success && response.data) {
        dispatch(LeadContactsActions.updateLeadContact(response.data));
        dispatch(
          CurrentLeadContactActions.updateCurrentLeadContact({ status })
        );
        dispatch(LeadContactBuilderActions.setUpdatingStatus(false));
        return 200;
      }
      dispatch(LeadContactBuilderActions.setUpdatingStatus(false));
      return 400;
    } catch (error) {
      console.error('Failed to update lead contact status:', error);
      dispatch(LeadContactBuilderActions.setUpdatingStatus(false));
      return 500;
    }
  };
};
