import { API_CONFIG } from '@/src/config/api';
import type { LeadCategory } from '@/src/model';
import type { ApiResponse } from '../types';

export type CreateLeadCategoryInput = {
  name: string;
  normalizedName: string;
  leadsCount?: number;
};

/**
 * Creates a lead category (Express expects snake_case body).
 */
export const createLeadCategory = async (
  input: CreateLeadCategoryInput,
  apiBaseUrl?: string
): Promise<ApiResponse<LeadCategory>> => {
  const baseUrl = apiBaseUrl ?? API_CONFIG.SERVER_URL;

  try {
    const response = await fetch(`${baseUrl}/api/data/lead-categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: input.name,
        normalized_name: input.normalizedName,
        leads_count: input.leadsCount ?? 0,
      }),
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

    const result = await response.json();
    const raw = (result as { data?: Record<string, unknown> }).data ?? result;
    const data: LeadCategory = {
      id: raw.id as string,
      name: raw.name as string,
      normalized_name: (raw.normalized_name as string) ?? input.normalizedName,
      leads_count: (raw.leads_count as number) ?? 0,
      created_at: (raw.created_at as string) ?? new Date().toISOString(),
      updated_at: (raw.updated_at as string) ?? new Date().toISOString(),
    };
    return { success: true, data };
  } catch (error) {
    console.error('Error creating lead category:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
