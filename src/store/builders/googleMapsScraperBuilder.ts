import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type GoogleMapsScraperBuilderState = {
  isScraping: boolean;
};

const initialState: GoogleMapsScraperBuilderState = {
  isScraping: false,
};

const googleMapsScraperBuilderSlice = createSlice({
  name: 'googleMapsScraperBuilder',
  initialState,
  reducers: {
    setIsScraping: (state, action: PayloadAction<boolean>) => {
      state.isScraping = action.payload;
    },
  },
});

export const GoogleMapsScraperBuilderActions =
  googleMapsScraperBuilderSlice.actions;
export default googleMapsScraperBuilderSlice.reducer;
