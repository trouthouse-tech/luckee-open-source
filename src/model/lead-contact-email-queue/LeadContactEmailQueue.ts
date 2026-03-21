export type LeadContactEmailQueueStatus =
  | 'queued'
  | 'sending'
  | 'sent'
  | 'failed';

export type LeadContactEmailQueueType =
  | 'campaign_variation'
  | 'custom_email';

export type LeadContactEmailQueue = {
  id: string;
  lead_contact_id: string;
  lead_id: string;
  campaign_id: string | null;
  type: LeadContactEmailQueueType;
  lead_contact_email_id: string | null;
  status: LeadContactEmailQueueStatus;
  scheduled_at: string;
  sent_at: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
};
