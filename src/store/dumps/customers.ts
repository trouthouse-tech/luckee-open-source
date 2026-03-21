import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Customer } from '@/src/model';

type CustomersState = {
  [key: string]: Customer;
};

const initialState: CustomersState = {};

export const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setCustomers: (_state, action: PayloadAction<Customer[]>) => {
      const normalized: CustomersState = {};
      action.payload.forEach((customer) => {
        normalized[customer.id] = customer;
      });
      return normalized;
    },
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state[action.payload.id] = action.payload;
    },
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      if (state[action.payload.id]) {
        state[action.payload.id] = action.payload;
      }
    },
    deleteCustomer: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    reset: () => initialState,
  },
});

export const CustomersActions = customersSlice.actions;
export default customersSlice.reducer;
