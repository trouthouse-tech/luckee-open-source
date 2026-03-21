import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { DateRangeFilter } from '@/src/utils/date-time';

export type StatCardFilter =
  | 'bounced'
  | 'unique_opens'
  | 'total_opens'
  | 'not_opened'
  | null;

type LeadSentEmailsBuilderState = {
  dateRangeFilter: DateRangeFilter;
  statCardFilter: StatCardFilter;
};

const initialState: LeadSentEmailsBuilderState = {
  dateRangeFilter: null,
  statCardFilter: null,
};

const leadSentEmailsBuilderSlice = createSlice({
  name: 'leadSentEmailsBuilder',
  initialState,
  reducers: {
    setDateRangeFilter: (state, action: PayloadAction<DateRangeFilter>) => {
      state.dateRangeFilter = action.payload;
    },
    clearDateRangeFilter: (state) => {
      state.dateRangeFilter = null;
    },
    setStatCardFilter: (state, action: PayloadAction<StatCardFilter>) => {
      state.statCardFilter = action.payload;
    },
    clearStatCardFilter: (state) => {
      state.statCardFilter = null;
    },
  },
});

export const LeadSentEmailsBuilderActions =
  leadSentEmailsBuilderSlice.actions;
export default leadSentEmailsBuilderSlice.reducer;
