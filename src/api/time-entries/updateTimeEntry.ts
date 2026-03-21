import { API_CONFIG } from '@/src/config/api';
import type { TimeEntry } from '@/src/model';
import type { ApiResponse } from '../types';

export const updateTimeEntry = async (
  timeEntryId: string,
  updates: Partial<Pick<TimeEntry, 'project_id' | 'date' | 'time' | 'title' | 'description'>>
): Promise<ApiResponse<TimeEntry>> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/time-entries/${timeEntryId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
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
        error: data.error || 'Failed to update time entry',
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error: unknown) {
    console.error('❌ Failed to update time entry:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update time entry',
    };
  }
};
