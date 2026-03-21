import type { AppThunk } from '../../store';
import { triggerWebsiteScrape } from '@/src/api/website-scrape-runs';
import { WebsiteScrapeRunsActions } from '../../dumps/websiteScrapeRuns';

type ResponseType = Promise<{
  success: boolean;
  scrapeRunId?: string;
  error?: string;
}>;

export const triggerWebsiteScrapeThunk = (
  leadId: string,
  website: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await triggerWebsiteScrape({ leadId, website });
      if (!response.success || !response.data) {
        console.error('Failed to trigger website scrape:', response.error);
        return {
          success: false,
          error: response.error || 'Failed to trigger website scrape',
        };
      }
      dispatch(WebsiteScrapeRunsActions.addWebsiteScrapeRun(response.data));
      return {
        success: true,
        scrapeRunId: response.scrapeRunId ?? response.data.id,
      };
    } catch (error) {
      console.error('Error triggering website scrape:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  };
};
