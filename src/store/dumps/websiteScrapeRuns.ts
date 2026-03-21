import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { WebsiteScrapeRun } from '@/src/model/website-scrape-run';

const initialState: WebsiteScrapeRun[] = [];

export const websiteScrapeRunsSlice = createSlice({
  name: 'websiteScrapeRuns',
  initialState,
  reducers: {
    setWebsiteScrapeRuns: (_state, action: PayloadAction<WebsiteScrapeRun[]>) =>
      action.payload,
    addWebsiteScrapeRun: (state, action: PayloadAction<WebsiteScrapeRun>) => {
      const index = state.findIndex((run) => run.id === action.payload.id);
      if (index >= 0) {
        state[index] = action.payload;
      } else {
        state.push(action.payload);
      }
    },
    clearWebsiteScrapeRuns: () => initialState,
  },
});

export const WebsiteScrapeRunsActions = websiteScrapeRunsSlice.actions;
export default websiteScrapeRunsSlice.reducer;
