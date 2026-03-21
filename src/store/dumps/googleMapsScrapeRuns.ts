import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { GoogleMapsScrapeRun } from '@/src/model';

type State = Record<string, GoogleMapsScrapeRun>;

const initialState: State = {};

const slice = createSlice({
  name: 'googleMapsScrapeRuns',
  initialState,
  reducers: {
    setGoogleMapsScrapeRuns: (state, action: PayloadAction<GoogleMapsScrapeRun[]>) => {
      action.payload.forEach((run) => {
        state[run.id] = run;
      });
    },
    addGoogleMapsScrapeRun: (state, action: PayloadAction<GoogleMapsScrapeRun>) => {
      state[action.payload.id] = action.payload;
    },
    updateGoogleMapsScrapeRun: (state, action: PayloadAction<GoogleMapsScrapeRun>) => {
      state[action.payload.id] = action.payload;
    },
  },
});

export const GoogleMapsScrapeRunsActions = slice.actions;
export default slice.reducer;
