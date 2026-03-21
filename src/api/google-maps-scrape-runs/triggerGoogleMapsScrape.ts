import { API_CONFIG } from '@/src/config/api';
import type { GoogleMapsScrapeRun } from '@/src/model';

const toModel = (row: Record<string, unknown>): GoogleMapsScrapeRun => ({
  id: row.id as string,
  name: row.name as string,
  searchQuery: row.search_query as string,
  status: row.status as GoogleMapsScrapeRun['status'],
  resultsCount: row.results_count as number,
  businessesImported: row.businesses_imported as number,
  maxResults: (row.max_results as number | null) ?? undefined,
  createdAt: new Date(row.created_at as string),
  completedAt: row.completed_at
    ? new Date(row.completed_at as string)
    : undefined,
  error: (row.error as string | null) ?? undefined,
  duration: (row.duration as number | null) ?? undefined,
});

export type TriggerGoogleMapsScrapeResponse = {
  scrapeRun: GoogleMapsScrapeRun;
  businessesScraped: number;
  leadsCreated: number;
  durationMs: number;
};

export type TriggerGoogleMapsScrapeResult =
  | { success: true; data: TriggerGoogleMapsScrapeResponse }
  | { success: false; error: string; scrapeRun?: GoogleMapsScrapeRun };

export const triggerGoogleMapsScrape = async (
  scrapeRunId: string
): Promise<TriggerGoogleMapsScrapeResult> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/google-maps-scrape-runs/trigger`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scrape_run_id: scrapeRunId }),
      }
    );

    const json = (await response.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;

    if (!response.ok) {
      const row = json.scrapeRun as Record<string, unknown> | undefined;
      return {
        success: false,
        error: (json.error as string) || `HTTP ${response.status}`,
        scrapeRun: row ? toModel(row) : undefined,
      };
    }

    const payload = json.data as Record<string, unknown> | undefined;
    if (!payload?.scrapeRun) {
      return { success: false, error: 'Invalid response from server' };
    }

    return {
      success: true,
      data: {
        scrapeRun: toModel(payload.scrapeRun as Record<string, unknown>),
        businessesScraped: (payload.businessesScraped as number) ?? 0,
        leadsCreated: (payload.leadsCreated as number) ?? 0,
        durationMs: (payload.durationMs as number) ?? 0,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Request failed',
    };
  }
};
