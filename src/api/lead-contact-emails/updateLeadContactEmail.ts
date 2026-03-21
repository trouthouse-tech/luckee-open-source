import { API_CONFIG } from '@/src/config/api';
import type {
  LeadContactEmail,
  TiptapContent,
} from '@/src/model/lead-contact-email';
import type { ApiResponse } from '../types';

export type UpdateLeadContactEmailInput = {
  subject?: string;
  body?: TiptapContent;
  campaign_ids?: string[];
};

export const updateLeadContactEmail = async (
  id: string,
  updates: UpdateLeadContactEmailInput
): Promise<ApiResponse<LeadContactEmail>> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/lead-contact-emails/${id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }
    );
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        success: false,
        error: result.error || result.message || `HTTP ${response.status}`,
      };
    }
    return result.success !== false && result.data
      ? { success: true, data: result.data }
      : { success: true, data: result as LeadContactEmail };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
