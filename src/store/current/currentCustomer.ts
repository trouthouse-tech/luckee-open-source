import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CurrentCustomerState = {
  customerId: string | null;
};

const initialState: CurrentCustomerState = {
  customerId: null,
};

export const currentCustomerSlice = createSlice({
  name: 'currentCustomer',
  initialState,
  reducers: {
    setCurrentCustomer: (state, action: PayloadAction<string>) => {
      state.customerId = action.payload;
    },
    reset: () => initialState,
  },
});

export const CurrentCustomerActions = currentCustomerSlice.actions;
export default currentCustomerSlice.reducer;
