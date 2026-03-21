import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Lead } from '@/src/model';

type LeadsState = {
  [key: string]: Lead;
};

const initialState: LeadsState = {};

export const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setLeads: (_state, action: PayloadAction<Lead[]>) => {
      const normalized: LeadsState = {};
      action.payload.forEach((lead) => {
        normalized[lead.id] = lead;
      });
      return normalized;
    },
    addLead: (state, action: PayloadAction<Lead>) => {
      state[action.payload.id] = action.payload;
    },
    updateLead: (state, action: PayloadAction<Lead>) => {
      if (state[action.payload.id]) {
        state[action.payload.id] = action.payload;
      }
    },
    deleteLead: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    reset: () => initialState,
  },
});

export const LeadsActions = leadsSlice.actions;
export default leadsSlice.reducer;
