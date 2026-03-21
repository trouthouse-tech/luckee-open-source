import { API_CONFIG } from '@/src/config/api';
import type { LeadSentEmail } from '@/src/model/lead-sent-email';
import type { ApiResponse } from '../types';

export type UpdateLeadSentEmailInput = {
  status?: LeadSentEmail['status'];
  campaign_id?: string | null;
};

export const updateLeadSentEmail = async (
  id: string,
  updates: UpdateLeadSentEmailInput
): Promise<ApiResponse<LeadSentEmail>> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/lead-sent-emails/${id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }
    );

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        success: false,
        error:
          data.error || data.message || `HTTP error! status: ${response.status}`,
      };
    }

    return { success: true, data: data.data ?? data };
  } catch (error: unknown) {
    console.error('Error updating lead sent email:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
