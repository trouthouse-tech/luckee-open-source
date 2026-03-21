import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Ticket } from '@/src/model';

const initialState: Partial<Ticket> = {
  project_id: null,
  customer_id: null,
  title: '',
  description: null,
  status: 'todo',
  priority: 'medium',
  tags: [],
  labels: [],
};

export const currentTicketSlice = createSlice({
  name: 'currentTicket',
  initialState,
  reducers: {
    setCurrentTicket: (_state, action: PayloadAction<Partial<Ticket>>) => action.payload,
    updateTicketField: (state, action: PayloadAction<Partial<Ticket>>) => {
      return { ...state, ...action.payload };
    },
    reset: () => initialState,
  },
});

export const CurrentTicketActions = currentTicketSlice.actions;
export default currentTicketSlice.reducer;
