import { API_CONFIG } from '@/src/config/api';
import type { ApiResponse } from '../types';

export type SendNowInput = {
  lead_contact_email_id: string;
};

export const sendNow = async (
  input: SendNowInput
): Promise<ApiResponse<{ sentEmailId: string }>> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/lead-contact-emails/send-now`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_contact_email_id: input.lead_contact_email_id,
        }),
      }
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || `HTTP ${response.status}`,
      };
    }
    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
