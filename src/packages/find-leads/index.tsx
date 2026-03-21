'use client';

import { GoogleMapsScraperForm } from './GoogleMapsScraperForm';
import { SearchResultsPreview } from './SearchResultsPreview';
import { ScrapeRunsList } from './ScrapeRunsList';

export { GoogleMapsScraperForm, SearchResultsPreview, ScrapeRunsList };

export const FindLeads = () => {
  return (
    <div className={styles.wrap}>
      <p className={styles.intro}>
        Search Google Maps for local businesses. Matching listings are saved as leads in your
        database.
      </p>
      <GoogleMapsScraperForm />
      <SearchResultsPreview />
      <ScrapeRunsList />
    </div>
  );
};

const styles = {
  wrap: `w-full max-w-5xl`,
  intro: `text-sm text-gray-600 mb-4`,
};
