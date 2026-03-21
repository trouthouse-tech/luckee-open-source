# 001 - Redux Patterns (Next.js)

## Status
Accepted

## Context
This ADR defines mandatory Redux patterns for **roads-seller-web** so async flows, slice state, and reducer behavior remain predictable across features.

## Decision

### 1) Use manual thunks only (`createAsyncThunk` is forbidden)
All async flows must be implemented as handwritten thunk functions. Do not use `createAsyncThunk`.

✅ **Do**
```ts
// src/store/orders/orders.thunks.ts
import type { AppThunk } from "@/store/types";
import { ordersLoadingStarted, ordersLoaded, ordersLoadingFailed } from "./orders.slice";
import { fetchOrders } from "@/api/orders/client";

export const loadOrders =
  (): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    dispatch(ordersLoadingStarted());

    const response = await fetchOrders();

    if (response.status === 200) {
      dispatch(ordersLoaded(response.data));
      return 200;
    }

    dispatch(ordersLoadingFailed(response.status));
    return response.status as 400 | 500;
  };
```

❌ **Don't**
```ts
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loadOrders = createAsyncThunk("orders/load", async () => {
  const response = await fetch("/api/orders");
  return response.json();
});
```

---

### 2) Every thunk must use this signature: `AppThunk<Promise<200 | 400 | 500>>`
Thunk return values are status-code unions. This keeps dispatch call sites explicit and consistent.

✅ **Do**
```ts
// src/store/types.ts
import type { Action } from "@reduxjs/toolkit";
import type { ThunkAction } from "redux-thunk";
import type { RootState } from "./store";

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
```

```ts
// src/store/orders/orders.thunks.ts
import type { AppThunk } from "@/store/types";

export const saveOrder =
  (): AppThunk<Promise<200 | 400 | 500>> =>
  async () => {
    return 200;
  };
```

❌ **Don't**
```ts
export const saveOrder = () => async () => {
  return true; // ambiguous return contract
};
```

```ts
export const saveOrder = (): any => async () => {
  return 200; // any is not allowed
};
```

---

### 3) Slice state must always include: `dumps`, `current`, `builders`, `config`
Every feature slice uses the same top-level shape. Do not omit or rename these keys.

✅ **Do**
```ts
type OrdersState = {
  dumps: {
    list: Array<{ id: string; title: string }>;
  };
  current: {
    selectedOrderId: string | null;
    status: "idle" | "loading" | "ready" | "error";
  };
  builders: {
    selectedItemIds: string[];
    step: "base" | "review" | "submit";
  };
  config: {
    pageSize: number;
    sortBy: "createdAt" | "price";
  };
};

const initialState: OrdersState = {
  dumps: { list: [] },
  current: { selectedOrderId: null, status: "idle" },
  builders: { selectedItemIds: [], step: "base" },
  config: { pageSize: 20, sortBy: "createdAt" },
};
```

❌ **Don't**
```ts
const initialState = {
  items: [],
  selected: null,
  settings: {},
}; // missing dumps/current/builders/config structure
```

---

### 4) Reducers must be logic-free (business logic belongs in thunks)
Reducers only apply payloads and set flags. Validation, branching, transformation, and side effects must live in thunks/services.

✅ **Do**
```ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type OrdersState = {
  dumps: { list: Array<{ id: string; title: string }> };
  current: { status: "idle" | "loading" | "ready" | "error" };
  builders: { selectedItemIds: string[]; step: "base" | "review" | "submit" };
  config: { pageSize: number };
};

const initialState: OrdersState = {
  dumps: { list: [] },
  current: { status: "idle" },
  builders: { selectedItemIds: [], step: "base" },
  config: { pageSize: 20 },
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    ordersLoadingStarted(state) {
      state.current.status = "loading";
    },
    ordersLoaded(state, action: PayloadAction<Array<{ id: string; title: string }>>) {
      state.dumps.list = action.payload;
      state.current.status = "ready";
    },
  },
});
```

❌ **Don't**
```ts
const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    ordersLoaded(state, action) {
      // business logic in reducer (forbidden)
      const deduped = new Map(action.payload.map((item) => [item.id, item]));
      state.dumps.list = Array.from(deduped.values()).filter((item) => item.title.length > 3);
      if (state.dumps.list.length > 10) {
        state.config.pageSize = 50;
      }
    },
  },
});
```

---

### 5) `builders` slices must not store objects
`builders` can contain primitives, literal unions, and arrays of primitives only. Never store nested objects/maps in `builders`.

✅ **Do**
```ts
type BuildersState = {
  selectedItemIds: string[];
  activeStep: "base" | "review" | "submit";
  hasUnsavedChanges: boolean;
};
```

❌ **Don't**
```ts
type BuildersState = {
  form: {
    title: string;
    filters: {
      status: string;
      dateRange: { from: string; to: string };
    };
  };
  byId: Record<string, { enabled: boolean }>;
};
```

---

## Consequences
- Async control flow is explicit and easier to trace in logs and debugging tools.
- Thunk return contracts are stable (`200 | 400 | 500`) and easy to consume in UI orchestration.
- Shared state shape (`dumps/current/builders/config`) reduces onboarding and review friction.
- Reducers stay deterministic and simple to test.
- `builders` remain serializable and lightweight for predictable state updates.
