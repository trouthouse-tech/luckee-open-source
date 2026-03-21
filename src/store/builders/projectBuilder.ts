import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ProjectBuilderState = {
  isCreateModalOpen: boolean;
  isLoading: boolean;
  isSaving: boolean;
  errorMessage: string | null;
};

const initialState: ProjectBuilderState = {
  isCreateModalOpen: false,
  isLoading: false,
  isSaving: false,
  errorMessage: null,
};

export const projectBuilderSlice = createSlice({
  name: 'projectBuilder',
  initialState,
  reducers: {
    openCreateModal: (state) => {
      state.isCreateModalOpen = true;
    },
    closeCreateModal: (state) => {
      state.isCreateModalOpen = false;
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
    reset: () => initialState,
  },
});

export const ProjectBuilderActions = projectBuilderSlice.actions;
export default projectBuilderSlice.reducer;
