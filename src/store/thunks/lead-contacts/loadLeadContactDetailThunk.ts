import type { AppThunk } from '@/src/store';
import { getLeadById } from '@/src/api/leads';
import { getLeadContactsByLeadId } from '@/src/api/lead-contacts';
import { LeadsActions } from '../../dumps/leads';
import { CurrentLeadActions } from '../../current';
import { CurrentLeadContactActions } from '../../current';
import { LeadContactBuilderActions } from '../../builders';
import { setCurrentLeadThunk } from '../leads/setCurrentLeadThunk';
import { checkQueueStatusThunk } from './checkQueueStatusThunk';

type ResponseType = Promise<200 | 404 | 500>;

/**
 * Hydrates currentLead + currentLeadContact for the contact detail page.
 */
export const loadLeadContactDetailThunk = (
  leadId: string,
  contactId: string
): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    try {
      dispatch(LeadContactBuilderActions.reset());

      let lead = getState().leads[leadId];
      if (!lead) {
        const leadRes = await getLeadById(leadId);
        if (!leadRes.success || !leadRes.data) return 404;
        dispatch(LeadsActions.addLead(leadRes.data));
        lead = leadRes.data;
      }
      dispatch(CurrentLeadActions.setCurrentLead(lead));
      dispatch(setCurrentLeadThunk(leadId));

      const contactsRes = await getLeadContactsByLeadId(leadId);
      if (!contactsRes.success || !contactsRes.data) return 404;
      const contact = contactsRes.data.find((c) => c.id === contactId);
      if (!contact) return 404;

      dispatch(CurrentLeadContactActions.setLeadContact(contact));
      void dispatch(checkQueueStatusThunk(contactId));
      return 200;
    } catch (e) {
      console.error('❌ loadLeadContactDetailThunk:', e);
      return 500;
    }
  };
};
