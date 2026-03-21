import { API_CONFIG } from '@/src/config/api';
import type { ApiResponse } from '../types';

export const deleteQueueItem = async (
  id: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/lead-contact-email-queue/${id}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || `HTTP ${response.status}`,
      };
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('❌ deleteQueueItem error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to delete queue item',
    };
  }
};
