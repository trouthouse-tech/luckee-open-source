import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { LeadContactEmailQueue } from '@/src/model/lead-contact-email-queue';

const initialState: Record<string, LeadContactEmailQueue> = {};

export const leadContactEmailQueueSlice = createSlice({
  name: 'leadContactEmailQueue',
  initialState,
  reducers: {
    addQueueItems: (state, action: PayloadAction<LeadContactEmailQueue[]>) => {
      action.payload.forEach((item) => {
        state[item.id] = item;
      });
    },
    updateQueueItem: (state, action: PayloadAction<LeadContactEmailQueue>) => {
      state[action.payload.id] = action.payload;
    },
    removeQueueItem: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    clearQueueItems: () => initialState,
  },
});

export const LeadContactEmailQueueActions =
  leadContactEmailQueueSlice.actions;
export const leadContactEmailQueueReducer =
  leadContactEmailQueueSlice.reducer;
export default leadContactEmailQueueSlice.reducer;
