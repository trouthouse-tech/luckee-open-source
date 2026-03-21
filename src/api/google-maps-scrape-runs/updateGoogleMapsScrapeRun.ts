import { API_CONFIG } from '@/src/config/api';
import type { GoogleMapsScrapeRun } from '@/src/model';
import type { ApiResponse } from '../types';

const convertToModel = (data: Record<string, unknown>): GoogleMapsScrapeRun => ({
  id: data.id as string,
  name: data.name as string,
  searchQuery: data.search_query as string,
  status: data.status as GoogleMapsScrapeRun['status'],
  resultsCount: data.results_count as number,
  businessesImported: data.businesses_imported as number,
  maxResults: (data.max_results as number | null) ?? undefined,
  createdAt: new Date(data.created_at as string),
  completedAt: data.completed_at
    ? new Date(data.completed_at as string)
    : undefined,
  error: (data.error as string | null) ?? undefined,
  duration: (data.duration as number | null) ?? undefined,
});

export type UpdateGoogleMapsScrapeRunInput = {
  status?: GoogleMapsScrapeRun['status'];
  resultsCount?: number;
  businessesImported?: number;
  completedAt?: Date | null;
  error?: string | null;
  duration?: number | null;
};

export const updateGoogleMapsScrapeRun = async (
  id: string,
  updates: UpdateGoogleMapsScrapeRunInput
): Promise<ApiResponse<GoogleMapsScrapeRun>> => {
  try {
    const payload: Record<string, unknown> = {};
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.resultsCount !== undefined)
      payload.results_count = updates.resultsCount;
    if (updates.businessesImported !== undefined)
      payload.businesses_imported = updates.businessesImported;
    if (updates.completedAt !== undefined) {
      payload.completed_at = updates.completedAt
        ? updates.completedAt.toISOString()
        : null;
    }
    if (updates.error !== undefined) payload.error = updates.error;
    if (updates.duration !== undefined) payload.duration = updates.duration;

    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/google-maps-scrape-runs/${id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          (errorData as { error?: string }).error ||
          `HTTP error! status: ${response.status}`,
      };
    }

    const result = await response.json();
    return { success: true, data: convertToModel(result.data as Record<string, unknown>) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
