import { API_CONFIG } from '@/src/config/api';
import type { ApiResponse } from '../types';

export const deleteLead = async (
  leadId: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/leads/${leadId}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return {
        success: false,
        error: data.error || 'Failed to delete lead',
      };
    }

    return { success: true, data: null };
  } catch (error: unknown) {
    console.error('❌ Failed to delete lead:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete lead',
    };
  }
};
