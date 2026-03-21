import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/src/model';

const initialState = null as User | null;

export const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    setCurrentUser: (_state, action: PayloadAction<User | null>) => action.payload as User | null,
    reset: () => initialState,
  },
});

export const CurrentUserActions = currentUserSlice.actions;
export default currentUserSlice.reducer;
