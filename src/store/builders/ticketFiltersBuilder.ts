import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TicketStatus, TicketPriority } from '@/src/model/ticket/Ticket';

type TicketFiltersBuilderState = {
  // Filter values
  searchTerm: string;
  selectedStatuses: TicketStatus[];
  selectedPriorities: TicketPriority[];
  selectedProjects: string[];
  selectedCustomers: string[];
  startDate: string;
  endDate: string;

  // UI state
  isLoading: boolean;
  hasQueried: boolean;
};

const initialState: TicketFiltersBuilderState = {
  searchTerm: '',
  selectedStatuses: [],
  selectedPriorities: [],
  selectedProjects: [],
  selectedCustomers: [],
  startDate: '',
  endDate: '',
  isLoading: false,
  hasQueried: false,
};

export const ticketFiltersBuilderSlice = createSlice({
  name: 'ticketFiltersBuilder',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    toggleStatus: (state, action: PayloadAction<TicketStatus>) => {
      const index = state.selectedStatuses.indexOf(action.payload);
      if (index > -1) {
        state.selectedStatuses = state.selectedStatuses.filter((_, i) => i !== index);
      } else {
        state.selectedStatuses.push(action.payload);
      }
    },
    togglePriority: (state, action: PayloadAction<TicketPriority>) => {
      const index = state.selectedPriorities.indexOf(action.payload);
      if (index > -1) {
        state.selectedPriorities = state.selectedPriorities.filter((_, i) => i !== index);
      } else {
        state.selectedPriorities.push(action.payload);
      }
    },
    toggleProject: (state, action: PayloadAction<string>) => {
      const index = state.selectedProjects.indexOf(action.payload);
      if (index > -1) {
        state.selectedProjects = state.selectedProjects.filter((_, i) => i !== index);
      } else {
        state.selectedProjects.push(action.payload);
      }
    },
    toggleCustomer: (state, action: PayloadAction<string>) => {
      const index = state.selectedCustomers.indexOf(action.payload);
      if (index > -1) {
        state.selectedCustomers = state.selectedCustomers.filter((_, i) => i !== index);
      } else {
        state.selectedCustomers.push(action.payload);
      }
    },
    setStartDate: (state, action: PayloadAction<string>) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action: PayloadAction<string>) => {
      state.endDate = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setHasQueried: (state, action: PayloadAction<boolean>) => {
      state.hasQueried = action.payload;
    },
    clearFilters: (state) => {
      state.searchTerm = '';
      state.selectedStatuses = [];
      state.selectedPriorities = [];
      state.selectedProjects = [];
      state.selectedCustomers = [];
      state.startDate = '';
      state.endDate = '';
    },
    reset: () => initialState,
  },
});

export const TicketFiltersBuilderActions = ticketFiltersBuilderSlice.actions;
export default ticketFiltersBuilderSlice.reducer;
