import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ExtractionDuplicate } from '@/src/api/tickets/extractTicketsFromText';

type TicketBuilderState = {
  // Modal states
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isImportTicketsModalOpen: boolean;
  importTicketsText: string;
  isExtractingTickets: boolean;

  // Extraction duplicates (for approve/deny after import)
  extractionDuplicates: ExtractionDuplicate[];
  extractionCreatedCount: number;

  // UI state
  viewMode: 'table' | 'kanban';
  isLoading: boolean;
  isSaving: boolean;

  // Error handling
  errorMessage: string | null;
};

const initialState: TicketBuilderState = {
  isCreateModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  isImportTicketsModalOpen: false,
  importTicketsText: '',
  isExtractingTickets: false,
  extractionDuplicates: [],
  extractionCreatedCount: 0,
  viewMode: 'table',
  isLoading: false,
  isSaving: false,
  errorMessage: null,
};

export const ticketBuilderSlice = createSlice({
  name: 'ticketBuilder',
  initialState,
  reducers: {
    openCreateModal: (state) => {
      state.isCreateModalOpen = true;
    },
    closeCreateModal: (state) => {
      state.isCreateModalOpen = false;
    },
    openEditModal: (state) => {
      state.isEditModalOpen = true;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
    },
    openDeleteModal: (state) => {
      state.isDeleteModalOpen = true;
    },
    closeDeleteModal: (state) => {
      state.isDeleteModalOpen = false;
    },
    openImportTicketsModal: (state) => {
      state.isImportTicketsModalOpen = true;
    },
    closeImportTicketsModal: (state) => {
      state.isImportTicketsModalOpen = false;
      state.importTicketsText = '';
      state.extractionDuplicates = [];
      state.extractionCreatedCount = 0;
      state.errorMessage = null;
    },
    setExtractionDuplicates: (
      state,
      action: PayloadAction<{ duplicates: ExtractionDuplicate[]; createdCount: number }>,
    ) => {
      state.extractionDuplicates = action.payload.duplicates;
      state.extractionCreatedCount = action.payload.createdCount;
    },
    removeExtractionDuplicateAtIndex: (state, action: PayloadAction<number>) => {
      state.extractionDuplicates = state.extractionDuplicates.filter(
        (_, i) => i !== action.payload,
      );
    },
    setImportTicketsText: (state, action: PayloadAction<string>) => {
      state.importTicketsText = action.payload;
    },
    setIsExtractingTickets: (state, action: PayloadAction<boolean>) => {
      state.isExtractingTickets = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setIsSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },
    setErrorMessage: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload;
    },
    setTicketsViewMode: (state, action: PayloadAction<'table' | 'kanban'>) => {
      state.viewMode = action.payload;
    },
    reset: () => initialState,
  },
});

export const TicketBuilderActions = ticketBuilderSlice.actions;
export default ticketBuilderSlice.reducer;
