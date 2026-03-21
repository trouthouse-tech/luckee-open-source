import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TicketStatus, TicketPriority } from '@/src/model/ticket/Ticket';

export type ProjectDetailTabType = 'tickets' | 'time_entries';

type CurrentProjectDetailState = {
  projectId: string | null;
  activeTab: ProjectDetailTabType;
  // Ticket tab filters
  ticketSearchTerm: string;
  ticketStatuses: TicketStatus[];
  ticketPriorities: TicketPriority[];
  // Time entries tab filters
  timeEntrySearchTerm: string;
  timeEntryStartDate: string;
  timeEntryEndDate: string;
};

const initialState: CurrentProjectDetailState = {
  projectId: null,
  activeTab: 'tickets',
  ticketSearchTerm: '',
  ticketStatuses: ['todo', 'in_progress'],
  ticketPriorities: [],
  timeEntrySearchTerm: '',
  timeEntryStartDate: '',
  timeEntryEndDate: '',
};

export const currentProjectDetailSlice = createSlice({
  name: 'currentProjectDetail',
  initialState,
  reducers: {
    setCurrentProjectDetail: (state, action: PayloadAction<string>) => {
      state.projectId = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<ProjectDetailTabType>) => {
      state.activeTab = action.payload;
    },
    setTicketSearchTerm: (state, action: PayloadAction<string>) => {
      state.ticketSearchTerm = action.payload;
    },
    toggleTicketStatus: (state, action: PayloadAction<TicketStatus>) => {
      const index = state.ticketStatuses.indexOf(action.payload);
      if (index > -1) {
        state.ticketStatuses = state.ticketStatuses.filter((_, i) => i !== index);
      } else {
        state.ticketStatuses.push(action.payload);
      }
    },
    toggleTicketPriority: (state, action: PayloadAction<TicketPriority>) => {
      const index = state.ticketPriorities.indexOf(action.payload);
      if (index > -1) {
        state.ticketPriorities = state.ticketPriorities.filter((_, i) => i !== index);
      } else {
        state.ticketPriorities.push(action.payload);
      }
    },
    setTimeEntrySearchTerm: (state, action: PayloadAction<string>) => {
      state.timeEntrySearchTerm = action.payload;
    },
    setTimeEntryStartDate: (state, action: PayloadAction<string>) => {
      state.timeEntryStartDate = action.payload;
    },
    setTimeEntryEndDate: (state, action: PayloadAction<string>) => {
      state.timeEntryEndDate = action.payload;
    },
    clearProjectDetailFilters: (state) => {
      state.ticketSearchTerm = '';
      state.ticketStatuses = [];
      state.ticketPriorities = [];
      state.timeEntrySearchTerm = '';
      state.timeEntryStartDate = '';
      state.timeEntryEndDate = '';
    },
    reset: () => initialState,
  },
});

export const CurrentProjectDetailActions = currentProjectDetailSlice.actions;
export default currentProjectDetailSlice.reducer;
