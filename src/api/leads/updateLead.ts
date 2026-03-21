import { API_CONFIG } from '@/src/config/api';
import type { Lead } from '@/src/model';
import type { ApiResponse } from '../types';

export const updateLead = async (
  leadId: string,
  payload: Partial<Lead>
): Promise<ApiResponse<Lead>> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/leads/${leadId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('❌ Non-JSON response:', text.substring(0, 200));
      return {
        success: false,
        error: 'Invalid response',
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to update lead',
      };
    }

    return {
      success: true,
      data: data.data ?? data,
    };
  } catch (error: unknown) {
    console.error('❌ Failed to update lead:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update lead',
    };
  }
};
