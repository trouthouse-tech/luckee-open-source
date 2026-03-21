import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TimeEntry } from '@/src/model';

type TimeEntriesState = {
  [key: string]: TimeEntry;
};

const initialState: TimeEntriesState = {};

export const timeEntriesSlice = createSlice({
  name: 'timeEntries',
  initialState,
  reducers: {
    setTimeEntries: (_state, action: PayloadAction<TimeEntry[]>) => {
      const normalized: TimeEntriesState = {};
      action.payload.forEach((entry) => {
        normalized[entry.id] = entry;
      });
      return normalized;
    },
    addTimeEntry: (state, action: PayloadAction<TimeEntry>) => {
      state[action.payload.id] = action.payload;
    },
    updateTimeEntry: (state, action: PayloadAction<TimeEntry>) => {
      if (state[action.payload.id]) {
        state[action.payload.id] = action.payload;
      }
    },
    deleteTimeEntry: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    reset: () => initialState,
  },
});

export const TimeEntriesActions = timeEntriesSlice.actions;
export default timeEntriesSlice.reducer;
