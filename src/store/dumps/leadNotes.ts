import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { LeadNote } from '@/src/model/lead-note';

const initialState: Record<string, LeadNote> = {};

export const leadNotesSlice = createSlice({
  name: 'leadNotes',
  initialState,
  reducers: {
    addLeadNotes: (state, action: PayloadAction<LeadNote[]>) => {
      action.payload.forEach((note) => {
        state[note.id] = note;
      });
    },
    removeLeadNote: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    clearLeadNotes: () => initialState,
  },
});

export const LeadNotesActions = leadNotesSlice.actions;
export default leadNotesSlice.reducer;
