import { API_CONFIG } from '@/src/config/api';
import type { ApiResponse } from '../types';

export const deleteAttachment = async (
  attachmentId: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/lead-contact-email-attachments/${attachmentId}`,
      { method: 'DELETE' }
    );
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return {
        success: false,
        error: data.error || `HTTP ${response.status}`,
      };
    }
    return { success: true, data: undefined };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Unknown error',
    };
  }
};
