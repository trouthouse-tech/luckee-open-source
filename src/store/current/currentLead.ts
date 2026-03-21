import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Lead } from '@/src/model';

type CurrentLeadState = Lead | null;

const initialState: CurrentLeadState = null;

export const currentLeadSlice = createSlice({
  name: 'currentLead',
  initialState: initialState as CurrentLeadState,
  reducers: {
    setCurrentLead: (state, action: PayloadAction<Lead | null>) => {
      return action.payload;
    },
    updateCurrentLead: (state, action: PayloadAction<Partial<Lead>>) => {
      if (state) {
        return { ...state, ...action.payload };
      }
      return state;
    },
    reset: () => null,
  },
});

export const CurrentLeadActions = currentLeadSlice.actions;
export default currentLeadSlice.reducer;
