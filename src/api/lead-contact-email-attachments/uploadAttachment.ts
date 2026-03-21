import { API_CONFIG } from '@/src/config/api';
import type { LeadContactEmailAttachment } from '@/src/model/lead-contact-email-attachment';
import type { ApiResponse } from '../types';

export type UploadAttachmentInput = {
  file: File;
  lead_contact_email_id: string;
  lead_id: string;
  lead_contact_id: string;
};

export const uploadAttachment = async (
  input: UploadAttachmentInput
): Promise<ApiResponse<LeadContactEmailAttachment>> => {
  try {
    const formData = new FormData();
    formData.append('file', input.file);
    formData.append('lead_contact_email_id', input.lead_contact_email_id);
    formData.append('lead_id', input.lead_id);
    formData.append('lead_contact_id', input.lead_contact_id);

    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/lead-contact-email-attachments`,
      { method: 'POST', body: formData }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          errorData.error ||
          errorData.message ||
          `HTTP error! status: ${response.status}`,
      };
    }
    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
