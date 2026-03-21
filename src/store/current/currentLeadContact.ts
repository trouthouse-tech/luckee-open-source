import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { LeadContact } from '@/src/model/lead-contact';

const emptyContact: LeadContact = {
  id: '',
  lead_id: '',
  name: '',
  email: null,
  phone: null,
  role: null,
  notes: null,
  status: 'not_contacted',
  created_at: '',
  updated_at: '',
};

type CurrentLeadContactState = LeadContact;

const initialState: CurrentLeadContactState = emptyContact;

export const currentLeadContactSlice = createSlice({
  name: 'currentLeadContact',
  initialState,
  reducers: {
    setLeadContact: (state, action: PayloadAction<LeadContact>) => {
      return action.payload;
    },
    updateCurrentLeadContact: (state, action: PayloadAction<Partial<LeadContact>>) => {
      return { ...state, ...action.payload };
    },
    reset: () => emptyContact,
  },
});

export const CurrentLeadContactActions = currentLeadContactSlice.actions;
export default currentLeadContactSlice.reducer;
