import { API_CONFIG } from '@/src/config/api';
import type { LeadContactEmail } from '@/src/model/lead-contact-email';
import type { ApiResponse } from '../types';

export const getLeadContactEmailsByContactId = async (
  contactId: string
): Promise<ApiResponse<LeadContactEmail[]>> => {
  try {
    const url = `${API_CONFIG.SERVER_URL}/api/data/lead-contact-emails/contact/${contactId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return {
        success: false,
        error: err.error || err.message || `HTTP ${response.status}`,
      };
    }
    const result = await response.json();
    const list = result.data ?? result ?? [];
    return { success: true, data: Array.isArray(list) ? list : [] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
