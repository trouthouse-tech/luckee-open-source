import { API_CONFIG } from '@/src/config/api';
import type { LeadContact, CreateLeadContactInput } from '@/src/model/lead-contact';
import type { ApiResponse } from '../types';

export const createLeadContact = async (
  input: CreateLeadContactInput
): Promise<ApiResponse<LeadContact>> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/lead-contacts`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }
    );

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('❌ Non-JSON response:', text.substring(0, 200));
      return { success: false, error: 'Invalid response' };
    }

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to create lead contact',
      };
    }

    return {
      success: true,
      data: data.data ?? data,
    };
  } catch (error: unknown) {
    console.error('❌ createLeadContact error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create lead contact',
    };
  }
};
