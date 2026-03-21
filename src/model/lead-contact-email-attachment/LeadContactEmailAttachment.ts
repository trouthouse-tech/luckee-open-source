export type EmailAttachmentType = 'pdf' | 'png' | 'jpg';

export type LeadContactEmailAttachment = {
  id: string;
  lead_contact_email_id: string;
  file_name: string;
  file_type: EmailAttachmentType;
  file_size_bytes: number;
  storage_path: string;
  created_at: Date | string;
  updated_at: Date | string;
};
