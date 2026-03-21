# 002 - Component Composition (Next.js)

## Status
Accepted

## Context
This document defines component composition rules for **roads-seller-web** to keep routing, feature logic, and shared UI consistent and scalable.

## Decision

### 1) App pages must be thin wrappers
`src/app/**/page.tsx` files only compose route-level layout by importing and rendering a package main component.

- No business logic
- No data orchestration
- No Redux selector/thunk wiring
- No large JSX trees

✅ **Do**
```tsx
// src/app/orders/page.tsx
import OrdersPage from "@/packages/orders";

export default function Page() {
  return <OrdersPage />;
}
```

❌ **Don't**
```tsx
// src/app/orders/page.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchOrdersThunk } from "@/packages/orders/store/thunks";

export default function Page() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.items);

  return (
    <div>
      <button onClick={() => dispatch(fetchOrdersThunk())}>Load</button>
      {orders.map((order) => (
        <div key={order.id}>{order.id}</div>
      ))}
    </div>
  );
}
```

---

### 2) Feature code lives in `src/packages/{feature}/`
Each feature is self-contained in its own package directory.

Suggested structure:
```text
src/packages/orders/
  index.tsx                # main package component (required)
  ui/
    OrdersView.tsx
    OrdersToolbar.tsx
  model/
    selectors.ts
    types.ts
  store/
    slice.ts
    thunks.ts
  api/
    client.ts
  server/
    router.ts
    handlers.ts
    service.ts
```

✅ **Do**
```text
src/packages/inventory/index.tsx
src/packages/inventory/ui/InventoryTable.tsx
src/packages/inventory/store/thunks.ts
```

❌ **Don't**
```text
src/features/inventory/*
src/app/inventory/components/*
src/components/inventory/InventoryPage.tsx
```

---

### 3) Shared UI belongs in `src/components/`
Only reusable, cross-feature components go in `src/components/`.

✅ **Do**
```text
src/components/Button.tsx
src/components/Modal.tsx
src/components/ReduxProvider.tsx
```

❌ **Don't**
```text
src/components/orders/OrdersFilters.tsx      # feature-specific UI
src/components/seller-dashboard/KpiCard.tsx  # feature-specific UI
```

Feature-specific UI must stay inside the feature package:
```text
src/packages/orders/ui/OrdersFilters.tsx
```

---

### 4) Call thunks directly (no custom hook wrappers)
Feature components dispatch thunks directly via Redux dispatch.

✅ **Do**
```tsx
// src/packages/orders/index.tsx
"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { fetchOrdersThunk } from "./store/thunks";

export default function OrdersPage() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    void dispatch(fetchOrdersThunk());
  }, [dispatch]);

  return <div>...</div>;
}
```

❌ **Don't**
```tsx
// src/packages/orders/hooks/useOrders.ts
export function useOrders() {
  // wraps thunk orchestration in custom hook (avoid)
}
```

---

### 5) `index.tsx` is the package main component
Each feature package exports one main component from `index.tsx`. App pages import this entry only.

✅ **Do**
```tsx
// src/packages/orders/index.tsx
import { OrdersScreen } from "./ui/OrdersScreen";

export default function OrdersPage() {
  return <OrdersScreen />;
}
```

❌ **Don't**
```tsx
// src/app/orders/page.tsx
import { OrdersScreen } from "@/packages/orders/ui/OrdersScreen"; // bypasses package entrypoint
```

---

### 6) JSDoc is required on router factory, handlers, and business logic
For server-side routing and business logic, add JSDoc comments to:

- Router factory function
- Every route handler function
- Business logic/service functions

✅ **Do**
```ts
// src/packages/orders/server/router.ts
import { getOrdersHandler, createOrderHandler } from "./handlers";

/**
 * Creates the orders route map for Next.js route handlers.
 */
export function createOrdersRouter() {
  return {
    GET: getOrdersHandler,
    POST: createOrderHandler,
  };
}
```

```ts
// src/packages/orders/server/handlers.ts
import { NextRequest, NextResponse } from "next/server";
import { listOrders, createOrder } from "./service";

/**
 * Handles GET /api/orders by returning seller orders.
 */
export async function getOrdersHandler() {
  const orders = await listOrders();
  return NextResponse.json({ data: orders });
}

/**
 * Handles POST /api/orders by validating and creating an order.
 */
export async function createOrderHandler(request: NextRequest) {
  const payload = await request.json();
  const order = await createOrder(payload);
  return NextResponse.json({ data: order }, { status: 201 });
}
```

```ts
// src/packages/orders/server/service.ts
import type { CreateOrderInput } from "../model/types";

/**
 * Returns all orders visible to the current seller context.
 */
export async function listOrders() {
  return [];
}

/**
 * Creates an order from validated input and returns persisted data.
 */
export async function createOrder(input: CreateOrderInput) {
  return { id: "new-order-id", ...input };
}
```

❌ **Don't**
```ts
export function createOrdersRouter() {
  return { GET: async () => {} }; // missing JSDoc
}

export async function getOrdersHandler() {
  return Response.json([]); // missing JSDoc
}

export async function listOrders() {
  return []; // missing JSDoc
}
```

## Consequences
- Predictable route composition across `src/app`.
- Feature isolation and easier ownership boundaries.
- Cleaner shared UI library with less accidental coupling.
- Simpler state orchestration with explicit thunk dispatching.
- Better maintainability and tooling support from consistent JSDoc on server code paths.

