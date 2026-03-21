import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Ticket } from '@/src/model';

type TicketsState = {
  [key: string]: Ticket;
};

const initialState: TicketsState = {};

export const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setTickets: (_state, action: PayloadAction<Ticket[]>) => {
      const normalized: TicketsState = {};
      action.payload.forEach((ticket) => {
        normalized[ticket.id] = ticket;
      });
      return normalized;
    },
    addTicket: (state, action: PayloadAction<Ticket>) => {
      state[action.payload.id] = action.payload;
    },
    updateTicket: (state, action: PayloadAction<Ticket>) => {
      if (state[action.payload.id]) {
        state[action.payload.id] = action.payload;
      }
    },
    deleteTicket: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    reset: () => initialState,
  },
});

export const TicketsActions = ticketsSlice.actions;
export default ticketsSlice.reducer;
