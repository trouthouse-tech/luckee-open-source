import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type LeadContactTab = 'Notes' | 'Emails';

type LeadContactBuilderState = {
  isMenuOpen: boolean;
  isStatusMenuOpen: boolean;
  isEditing: boolean;
  isSaving: boolean;
  isUpdatingStatus: boolean;
  activeTab: LeadContactTab;
  queueStatus: {
    status: 'queued' | 'sending' | 'sent' | 'failed';
    id: string;
  } | null;
};

const initialState: LeadContactBuilderState = {
  isMenuOpen: false,
  isStatusMenuOpen: false,
  isEditing: false,
  isSaving: false,
  isUpdatingStatus: false,
  activeTab: 'Notes',
  queueStatus: null,
};

const leadContactBuilderSlice = createSlice({
  name: 'leadContactBuilder',
  initialState,
  reducers: {
    setMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMenuOpen = action.payload;
    },
    setStatusMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isStatusMenuOpen = action.payload;
    },
    setEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    setSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },
    setUpdatingStatus: (state, action: PayloadAction<boolean>) => {
      state.isUpdatingStatus = action.payload;
    },
    setQueueStatus: (
      state,
      action: PayloadAction<LeadContactBuilderState['queueStatus']>
    ) => {
      state.queueStatus = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<LeadContactTab>) => {
      state.activeTab = action.payload;
    },
    reset: () => initialState,
  },
});

export const LeadContactBuilderActions = leadContactBuilderSlice.actions;
export default leadContactBuilderSlice.reducer;
