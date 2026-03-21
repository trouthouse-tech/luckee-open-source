import { API_CONFIG } from '@/src/config/api';
import type { ApiResponse } from '../types';

export const deleteTimeEntry = async (
  timeEntryId: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/time-entries/${timeEntryId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (response.status === 404) {
        return {
          success: false,
          error: 'Time entries API endpoint not available yet',
        };
      }
      const text = await response.text();
      console.error('❌ Non-JSON response:', text.substring(0, 200));
      return {
        success: false,
        error: 'API endpoint not found or returned invalid response',
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to delete time entry',
      };
    }

    return {
      success: true,
    };
  } catch (error: unknown) {
    console.error('❌ Failed to delete time entry:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete time entry',
    };
  }
};
