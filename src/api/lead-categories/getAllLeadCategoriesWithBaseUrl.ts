import type { LeadCategory } from '@/src/model';
import type { ApiResponse } from '../types';

/**
 * Fetch categories with explicit base URL (server-side scraper upload).
 */
export const getAllLeadCategoriesWithBaseUrl = async (
  apiBaseUrl: string
): Promise<ApiResponse<LeadCategory[]>> => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/data/lead-categories`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return {
        success: false,
        error: (data as { error?: string }).error || 'Failed to get lead categories',
      };
    }

    const json = await response.json();
    const list = (json.data ?? json ?? []) as LeadCategory[];
    return { success: true, data: Array.isArray(list) ? list : [] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get lead categories',
    };
  }
};
