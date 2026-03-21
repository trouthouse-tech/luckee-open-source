import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { GoogleMapsScrapeRun } from '@/src/model';

type State = GoogleMapsScrapeRun | null;

const slice = createSlice({
  name: 'currentGoogleMapsScrapeRun',
  initialState: null as State,
  reducers: {
    setGoogleMapsScrapeRun: (_state, action: PayloadAction<GoogleMapsScrapeRun | null>) =>
      action.payload,
  },
});

export const CurrentGoogleMapsScrapeRunActions = slice.actions;
export default slice.reducer;
