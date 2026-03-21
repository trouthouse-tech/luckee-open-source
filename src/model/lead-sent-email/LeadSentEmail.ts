export type LeadSentEmailStatus =
  | 'sent'
  | 'responded_won'
  | 'responded_lost'
  | 'not_responded';

export type LeadSentEmailDeliveryStatus =
  | 'sent'
  | 'delivered'
  | 'bounced'
  | 'deferred'
  | 'opened';

export type LeadSentEmail = {
  id: string;
  lead_email_id: string;
  lead_contact_id: string;
  campaign_id: string | null;
  campaign_email_variation_id: string | null;
  status: LeadSentEmailStatus;
  sent_at: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
  from_name?: string | null;
  variation_id?: number | null;
  sg_message_id?: string | null;
  opened_at?: Date | string | null;
  opened_count?: number | null;
  /** SendGrid lifecycle: sent, delivered, bounced, deferred, opened */
  delivery_status?: LeadSentEmailDeliveryStatus | null;
};
