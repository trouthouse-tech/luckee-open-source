import { API_CONFIG } from '@/src/config/api';
import type { TimeEntry } from '@/src/model';
import type { ApiResponse } from '../types';

export const getAllTimeEntries = async (
  userId: string,
  startDate: string,
  endDate: string
): Promise<ApiResponse<TimeEntry[]>> => {
  try {
    const params = new URLSearchParams({
      userId,
      startDate,
      endDate,
    });
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/time-entries?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (response.status === 404) {
        return { success: true, data: [] };
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
        error: data.error || 'Failed to get time entries',
      };
    }

    return {
      success: true,
      data: data.data || [],
    };
  } catch (error: unknown) {
    console.error('❌ Failed to get time entries:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get time entries',
    };
  }
};
