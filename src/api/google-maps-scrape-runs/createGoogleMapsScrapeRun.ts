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

export const createGoogleMapsScrapeRun = async (run: {
  name: string;
  searchQuery: string;
  status?: GoogleMapsScrapeRun['status'];
  results_count?: number;
  businesses_imported?: number;
  max_results?: number | null;
}): Promise<ApiResponse<GoogleMapsScrapeRun>> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/google-maps-scrape-runs`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: run.name,
          search_query: run.searchQuery,
          status: run.status ?? 'in_progress',
          results_count: run.results_count ?? 0,
          businesses_imported: run.businesses_imported ?? 0,
          max_results: run.max_results ?? null,
        }),
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
