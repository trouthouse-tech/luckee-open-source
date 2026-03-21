import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Project } from '@/src/model';

const initialState: Partial<Project> = {
  name: '',
  color: '#6366f1',
  is_active: true,
  customer_id: null,
};

export const currentProjectSlice = createSlice({
  name: 'currentProject',
  initialState,
  reducers: {
    setCurrentProject: (_state, action: PayloadAction<Partial<Project>>) =>
      action.payload,
    updateField: (
      state,
      action: PayloadAction<
        Partial<Pick<Project, 'name' | 'color' | 'is_active' | 'customer_id'>>
      >
    ) => {
      return { ...state, ...action.payload };
    },
    reset: () => initialState,
  },
});

export const CurrentProjectActions = currentProjectSlice.actions;
export default currentProjectSlice.reducer;
