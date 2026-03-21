import { API_CONFIG } from '@/src/config/api';
import type { Lead } from '@/src/model';
import type { ApiResponse } from '../types';

type CreateLeadPayload = Omit<Lead, 'id' | 'created_at' | 'updated_at'>;

/**
 * Creates a lead via Express API (used by Google Maps scraper upload on server).
 */
export const createLead = async (
  lead: CreateLeadPayload,
  apiBaseUrl?: string
): Promise<ApiResponse<Lead>> => {
  const baseUrl = apiBaseUrl ?? API_CONFIG.SERVER_URL;

  try {
    const response = await fetch(`${baseUrl}/api/data/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          (errorData as { error?: string }).error ||
          (errorData as { message?: string }).message ||
          `HTTP error! status: ${response.status}`,
      };
    }

    const result = (await response.json()) as { data?: Lead } | Lead;
    const data = 'data' in result && result.data ? result.data : (result as Lead);
    return { success: true, data };
  } catch (error) {
    console.error('Error creating lead:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
