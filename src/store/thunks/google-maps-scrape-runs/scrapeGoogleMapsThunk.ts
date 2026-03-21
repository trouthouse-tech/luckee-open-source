import type { AppThunk } from '../../store';
import { GoogleMapsScraperBuilderActions } from '@/src/store/builders/googleMapsScraperBuilder';
import { CurrentGoogleMapsScrapeRunActions } from '@/src/store/current/currentGoogleMapsScrapeRun';
import { GoogleMapsScrapeRunsActions } from '@/src/store/dumps/googleMapsScrapeRuns';
import {
  createGoogleMapsScrapeRun,
  triggerGoogleMapsScrape,
} from '@/src/api/google-maps-scrape-runs';

type ResponseType = Promise<{
  success: boolean;
  error?: string;
  businessesScraped?: number;
  leadsCreated?: number;
}>;

/**
 * Creates scrape run → Express calls n8n (N8N_GOOGLE_MAPS_SCRAPE_WEBHOOK_URL) → leads inserted in DB.
 */
export const scrapeGoogleMapsThunk =
  (
    name: string,
    searchQuery: string,
    maxResults?: number
  ): AppThunk<ResponseType> =>
  async (dispatch): ResponseType => {
    try {
      dispatch(GoogleMapsScraperBuilderActions.setIsScraping(true));

      const createResponse = await createGoogleMapsScrapeRun({
        name,
        searchQuery,
        status: 'in_progress',
        results_count: 0,
        businesses_imported: 0,
        max_results: maxResults ?? null,
      });

      if (!createResponse.success || !createResponse.data) {
        dispatch(GoogleMapsScraperBuilderActions.setIsScraping(false));
        return {
          success: false,
          error: createResponse.error || 'Failed to create scrape run',
        };
      }

      const scrapeRun = createResponse.data;
      dispatch(CurrentGoogleMapsScrapeRunActions.setGoogleMapsScrapeRun(scrapeRun));
      dispatch(GoogleMapsScrapeRunsActions.addGoogleMapsScrapeRun(scrapeRun));

      const triggerResult = await triggerGoogleMapsScrape(scrapeRun.id);

      dispatch(GoogleMapsScraperBuilderActions.setIsScraping(false));

      if (!triggerResult.success) {
        if (triggerResult.scrapeRun) {
          dispatch(
            GoogleMapsScrapeRunsActions.updateGoogleMapsScrapeRun(
              triggerResult.scrapeRun
            )
          );
          dispatch(
            CurrentGoogleMapsScrapeRunActions.setGoogleMapsScrapeRun(
              triggerResult.scrapeRun
            )
          );
        }
        return {
          success: false,
          error: triggerResult.error,
        };
      }

      const { scrapeRun: updated, businessesScraped, leadsCreated } =
        triggerResult.data;

      dispatch(GoogleMapsScrapeRunsActions.updateGoogleMapsScrapeRun(updated));
      dispatch(CurrentGoogleMapsScrapeRunActions.setGoogleMapsScrapeRun(updated));

      return {
        success: true,
        businessesScraped,
        leadsCreated,
      };
    } catch (error) {
      dispatch(GoogleMapsScraperBuilderActions.setIsScraping(false));
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  };
