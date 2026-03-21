import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { LeadSentEmail } from '@/src/model/lead-sent-email';

const initialState: Record<string, LeadSentEmail> = {};

export const leadSentEmailsSlice = createSlice({
  name: 'leadSentEmails',
  initialState,
  reducers: {
    addLeadSentEmails: (state, action: PayloadAction<LeadSentEmail[]>) => {
      action.payload.forEach((email) => {
        state[email.id] = email;
      });
    },
    updateLeadSentEmail: (state, action: PayloadAction<LeadSentEmail>) => {
      state[action.payload.id] = action.payload;
    },
    removeLeadSentEmail: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    clearLeadSentEmails: () => initialState,
  },
});

export const LeadSentEmailsActions = leadSentEmailsSlice.actions;
export const leadSentEmailsReducer = leadSentEmailsSlice.reducer;
export default leadSentEmailsSlice.reducer;
