import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TimeEntryBuilderState = {
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isLoading: boolean;
  isSaving: boolean;
  selectedDate: string | null;
  selectedProjectIds: string[];
  selectedCustomerId: string | null;
  errorMessage: string | null;
};

const initialState: TimeEntryBuilderState = {
  isCreateModalOpen: false,
  isEditModalOpen: false,
  isLoading: false,
  isSaving: false,
  selectedDate: null,
  selectedProjectIds: [],
  selectedCustomerId: null,
  errorMessage: null,
};

export const timeEntryBuilderSlice = createSlice({
  name: 'timeEntryBuilder',
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
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setIsSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<string | null>) => {
      state.selectedDate = action.payload;
    },
    setSelectedProjectIds: (state, action: PayloadAction<string[]>) => {
      state.selectedProjectIds = action.payload;
    },
    setSelectedCustomerId: (state, action: PayloadAction<string | null>) => {
      state.selectedCustomerId = action.payload;
    },
    setErrorMessage: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload;
    },
    reset: () => initialState,
  },
});

export const TimeEntryBuilderActions = timeEntryBuilderSlice.actions;
export default timeEntryBuilderSlice.reducer;
