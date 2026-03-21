import { API_CONFIG } from '@/src/config/api';
import type { LeadContactEmailAttachment } from '@/src/model/lead-contact-email-attachment';
import type { ApiResponse } from '../types';

export const getAttachmentsByEmailId = async (
  emailId: string
): Promise<ApiResponse<LeadContactEmailAttachment[]>> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/lead-contact-email-attachments/${emailId}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}`,
      };
    }
    const list = data.data ?? [];
    return { success: true, data: Array.isArray(list) ? list : [] };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Unknown error',
    };
  }
};
