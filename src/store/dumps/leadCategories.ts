import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { LeadCategory } from '@/src/model';

type LeadCategoriesState = LeadCategory[];

const initialState: LeadCategoriesState = [];

export const leadCategoriesSlice = createSlice({
  name: 'leadCategories',
  initialState,
  reducers: {
    setLeadCategories: (_state, action: PayloadAction<LeadCategory[]>) => {
      return action.payload;
    },
    reset: () => initialState,
  },
});

export const LeadCategoriesActions = leadCategoriesSlice.actions;
export default leadCategoriesSlice.reducer;
