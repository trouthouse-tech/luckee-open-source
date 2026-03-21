import { API_CONFIG } from '@/src/config/api';
import type { LeadContactEmailQueue } from '@/src/model/lead-contact-email-queue';
import type { ApiResponse } from '../types';

export type LeadContactEmailQueueType =
  | 'campaign_variation'
  | 'custom_email';

export type AddToQueueInput = {
  lead_contact_id: string;
  lead_id?: string;
  campaign_id?: string | null;
  type?: LeadContactEmailQueueType;
  lead_contact_email_id?: string | null;
};

export const addToQueue = async (
  input: AddToQueueInput
): Promise<ApiResponse<LeadContactEmailQueue>> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/lead-contact-email-queue`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }
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
