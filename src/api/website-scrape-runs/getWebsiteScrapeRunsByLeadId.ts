import { API_CONFIG } from '@/src/config/api';
import type { WebsiteScrapeRun } from '@/src/model/website-scrape-run';
import type { ApiResponse } from '../types';

/**
 * GET /api/data/website-scrape-runs/lead/:leadId
 */
export const getWebsiteScrapeRunsByLeadId = async (
  leadId: string
): Promise<ApiResponse<WebsiteScrapeRun[]>> => {
  try {
    const url = `${API_CONFIG.SERVER_URL}/api/data/website-scrape-runs/lead/${leadId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        success: false,
        error: payload.error || payload.message || 'Failed to load website scrapes',
      };
    }
    const runs = (payload.data ?? []) as WebsiteScrapeRun[];
    return { success: true, data: Array.isArray(runs) ? runs : [] };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to load website scrapes',
    };
  }
};
