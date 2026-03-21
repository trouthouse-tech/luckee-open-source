import { API_CONFIG } from '@/src/config/api';
import type { ApiResponse } from '../types';

export const deleteLeadContact = async (
  contactId: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/lead-contacts/${contactId}`,
      { method: 'DELETE' }
    );

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (response.ok) return { success: true };
      const text = await response.text();
      console.error('❌ Non-JSON response:', text.substring(0, 200));
      return { success: false, error: 'Invalid response' };
    }

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to delete lead contact',
      };
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('❌ deleteLeadContact error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete lead contact',
    };
  }
};
