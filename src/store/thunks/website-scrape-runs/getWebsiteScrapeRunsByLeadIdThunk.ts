import type { AppThunk } from '../../store';
import { getWebsiteScrapeRunsByLeadId } from '@/src/api/website-scrape-runs';
import { WebsiteScrapeRunsActions } from '../../dumps/websiteScrapeRuns';

type ResponseType = Promise<200 | 400 | 500>;

export const getWebsiteScrapeRunsByLeadIdThunk = (
  leadId: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getWebsiteScrapeRunsByLeadId(leadId);
      if (!response.success || !response.data) {
        console.error('Failed to get website scrape runs:', response.error);
        return 400;
      }
      dispatch(WebsiteScrapeRunsActions.setWebsiteScrapeRuns(response.data));
      return 200;
    } catch (error) {
      console.error('Error getting website scrape runs:', error);
      return 500;
    }
  };
};
