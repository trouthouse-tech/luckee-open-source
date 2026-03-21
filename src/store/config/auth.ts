import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = {
  id: string;
  email: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: Record<string, unknown> | null;
  hasInitialized: boolean;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  session: null,
  hasInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setSession: (state, action: PayloadAction<Record<string, unknown> | null>) => {
      state.session = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.hasInitialized = action.payload;
    },
    signOut: (state) => {
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.hasInitialized = true;
    },
    reset: () => initialState,
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
