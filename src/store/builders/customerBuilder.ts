import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CustomerBuilderState = {
  isAddModalOpen: boolean;
  isAddProjectModalOpen: boolean;
  isSaving: boolean;
  errorMessage: string | null;
};

const initialState: CustomerBuilderState = {
  isAddModalOpen: false,
  isAddProjectModalOpen: false,
  isSaving: false,
  errorMessage: null,
};

export const customerBuilderSlice = createSlice({
  name: 'customerBuilder',
  initialState,
  reducers: {
    openAddModal: (state) => {
      state.isAddModalOpen = true;
      state.errorMessage = null;
    },
    closeAddModal: (state) => {
      state.isAddModalOpen = false;
      state.errorMessage = null;
    },
    openAddProjectModal: (state) => {
      state.isAddProjectModalOpen = true;
      state.errorMessage = null;
    },
    closeAddProjectModal: (state) => {
      state.isAddProjectModalOpen = false;
      state.errorMessage = null;
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

export const CustomerBuilderActions = customerBuilderSlice.actions;
export default customerBuilderSlice.reducer;
