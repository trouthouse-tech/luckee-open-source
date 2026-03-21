import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/src/model';

type InitialState = {
  [key: string]: User;
};

const initialState: InitialState = {};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (_state, action: PayloadAction<InitialState>) => action.payload,
    addUser: (state, action: PayloadAction<User>) => {
      state[action.payload.id] = action.payload;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state[action.payload.id] = action.payload;
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    reset: () => initialState,
  },
});

export const UsersActions = usersSlice.actions;
export default usersSlice.reducer;
