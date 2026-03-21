import type { AppThunk } from '@/src/store';
import { LeadContactEmailsActions } from '../../dumps/leadContactEmails';
import {
  createLeadContactEmail,
  updateLeadContactEmail,
  type CreateLeadContactEmailInput,
  type UpdateLeadContactEmailInput,
} from '@/src/api/lead-contact-emails';
import type { LeadContactEmail } from '@/src/model/lead-contact-email';

type SaveSuccess = { status: 200; email: LeadContactEmail };
type ResponseType = Promise<SaveSuccess | 400 | 500>;

export const saveCurrentLeadContactEmailThunk = (emailData: {
  id?: string;
  lead_id: string;
  lead_contact_id: string;
  subject: string;
  body: CreateLeadContactEmailInput['body'];
  campaign_ids?: string[];
}): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      if (emailData.id) {
        const updates: UpdateLeadContactEmailInput = {
          subject: emailData.subject,
          body: emailData.body,
          campaign_ids: emailData.campaign_ids,
        };
        const response = await updateLeadContactEmail(emailData.id, updates);
        if (!response.success || !response.data) return 400;
        dispatch(LeadContactEmailsActions.updateLeadContactEmail(response.data));
        return { status: 200, email: response.data };
      }
      const createData: CreateLeadContactEmailInput = {
        lead_id: emailData.lead_id,
        lead_contact_id: emailData.lead_contact_id,
        subject: emailData.subject,
        body: emailData.body,
        campaign_ids: emailData.campaign_ids || [],
      };
      const response = await createLeadContactEmail(createData);
      if (!response.success || !response.data) return 400;
      dispatch(LeadContactEmailsActions.addLeadContactEmails([response.data]));
      return { status: 200, email: response.data };
    } catch (error) {
      console.error('saveCurrentLeadContactEmailThunk:', error);
      return 500;
    }
  };
};
