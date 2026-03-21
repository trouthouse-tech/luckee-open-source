import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TimeEntry } from '@/src/model';

const initialState: Partial<TimeEntry> = {
  project_id: '',
  customer_id: null,
  date: '',
  time: 0,
  title: '',
  description: '',
};

export const currentTimeEntrySlice = createSlice({
  name: 'currentTimeEntry',
  initialState,
  reducers: {
    setCurrentTimeEntry: (_state, action: PayloadAction<Partial<TimeEntry>>) =>
      action.payload,
    updateField: (
      state,
      action: PayloadAction<Partial<Pick<TimeEntry, 'project_id' | 'customer_id' | 'date' | 'time' | 'title' | 'description'>>>
    ) => {
      return { ...state, ...action.payload };
    },
    reset: () => initialState,
  },
});

export const CurrentTimeEntryActions = currentTimeEntrySlice.actions;
export default currentTimeEntrySlice.reducer;
