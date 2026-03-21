import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { LeadContact } from '@/src/model/lead-contact';

const initialState: Record<string, LeadContact> = {};

export const leadContactsSlice = createSlice({
  name: 'leadContacts',
  initialState,
  reducers: {
    addLeadContacts: (state, action: PayloadAction<LeadContact[]>) => {
      action.payload.forEach((contact) => {
        state[contact.id] = contact;
      });
    },
    updateLeadContact: (state, action: PayloadAction<LeadContact>) => {
      state[action.payload.id] = action.payload;
    },
    removeLeadContact: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    clearLeadContacts: () => initialState,
  },
});

export const LeadContactsActions = leadContactsSlice.actions;
export const leadContactsReducer = leadContactsSlice.reducer;
export default leadContactsSlice.reducer;
