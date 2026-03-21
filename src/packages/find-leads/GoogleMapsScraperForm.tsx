'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/src/store/hooks';
import { scrapeGoogleMapsThunk } from '@/src/store/thunks/google-maps-scrape-runs';

export const GoogleMapsScraperForm = () => {
  const dispatch = useAppDispatch();
  const [searchName, setSearchName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxResults, setMaxResults] = useState(50);

  const handleScrape = async () => {
    if (!searchName.trim()) {
      alert('Please enter a search name');
      return;
    }
    if (!searchQuery.trim()) {
      alert('Please enter a search query');
      return;
    }

    const result = await dispatch(
      scrapeGoogleMapsThunk(searchName.trim(), searchQuery.trim(), maxResults)
    );

    if (result.success) {
      alert(
        `Found ${result.businessesScraped ?? 0} businesses, created ${result.leadsCreated ?? 0} leads.`
      );
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Search Name *</label>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="e.g., Philadelphia Plumbers - Jan 2026"
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Search Query *</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., Philadelphia Plumbers"
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Max Results: {maxResults}</label>
            <input
              type="range"
              min={10}
              max={200}
              step={10}
              value={maxResults}
              onChange={(e) => setMaxResults(parseInt(e.target.value, 10))}
              className={styles.slider}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button type="button" onClick={handleScrape} className={styles.scrapeButton}>
              Scrape Google Maps
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: `w-full mb-4`,
  form: `bg-white rounded border border-gray-300 p-4`,
  formRow: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end`,
  formGroup: `flex flex-col`,
  label: `text-xs font-medium text-gray-700 mb-1`,
  input: `px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`,
  slider: `w-full mt-1`,
  buttonGroup: `flex items-end`,
  scrapeButton: `w-full bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50`,
};
