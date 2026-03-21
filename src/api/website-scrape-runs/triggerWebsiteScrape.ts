import { API_CONFIG } from '@/src/config/api';
import type { WebsiteScrapeRun } from '@/src/model/website-scrape-run';

export type TriggerWebsiteScrapeInput = {
  leadId: string;
  website: string;
};

export type TriggerWebsiteScrapeResponse = {
  success: boolean;
  data?: WebsiteScrapeRun;
  scrapeRunId?: string;
  error?: string;
};

/**
 * POST /api/data/website-scrape-runs/trigger
 */
export const triggerWebsiteScrape = async (
  input: TriggerWebsiteScrapeInput
): Promise<TriggerWebsiteScrapeResponse> => {
  try {
    const url = `${API_CONFIG.SERVER_URL}/api/data/website-scrape-runs/trigger`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leadId: input.leadId,
        website: input.website,
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        success: false,
        error: result.error || result.message || `HTTP ${response.status}`,
      };
    }
    return {
      success: Boolean(result.success),
      data: result.data,
      scrapeRunId: result.scrapeRunId,
      error: result.error,
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Unknown error',
    };
  }
};
