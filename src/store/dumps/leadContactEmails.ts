import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { LeadContactEmail } from '@/src/model/lead-contact-email';

const initialState: Record<string, LeadContactEmail> = {};

export const leadContactEmailsSlice = createSlice({
  name: 'leadContactEmails',
  initialState,
  reducers: {
    addLeadContactEmails: (
      state,
      action: PayloadAction<LeadContactEmail[]>
    ) => {
      action.payload.forEach((email) => {
        state[email.id] = email;
      });
    },
    updateLeadContactEmail: (
      state,
      action: PayloadAction<LeadContactEmail>
    ) => {
      state[action.payload.id] = action.payload;
    },
    removeLeadContactEmail: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    clearLeadContactEmails: () => initialState,
  },
});

export const LeadContactEmailsActions = leadContactEmailsSlice.actions;
export default leadContactEmailsSlice.reducer;
