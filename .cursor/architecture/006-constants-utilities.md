# 006 — Constants & Utilities (Next.js)

## Purpose

Define a consistent approach for reusable constants and pure utilities in this Next.js codebase.

## Rules

1. **Extract utilities when used 2+ times**
   - If logic is duplicated in two or more places, move it into `src/utils/{domain}`.
2. **Keep constants in `src/utils/{domain}/constants.ts`**
   - Group related constants by domain (e.g., `pricing`, `date`, `api`, `validation`).
3. **Utility functions must be pure**
   - No React hooks (`useState`, `useMemo`, etc.), no Redux store access, no I/O side effects.
4. **Use named constants**
   - Avoid magic numbers/strings in handlers and business logic.
5. **Require JSDoc on router factory, handlers, and business logic**
   - Add JSDoc to:
     - Router factory function
     - Each HTTP handler (`GET`, `POST`, etc.)
     - Business logic functions used by handlers

## Standard Folder Shape

```txt
src/
  utils/
    {domain}/
      constants.ts
      index.ts
      <utility>.ts
```

## ✅ Good Example

```ts
// src/utils/orders/constants.ts
export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGE_SIZE = 20;
export const BAD_REQUEST_STATUS = 400;
export const CREATED_STATUS = 201;
export const ORDER_ID_PARAM = "orderId";
```

```ts
// src/utils/orders/pagination.ts
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "./constants";

/**
 * Returns a safe page size within allowed bounds.
 */
export function clampPageSize(rawPageSize?: number): number {
  if (!rawPageSize) return DEFAULT_PAGE_SIZE;
  return Math.min(Math.max(rawPageSize, 1), MAX_PAGE_SIZE);
}
```

```ts
// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { BAD_REQUEST_STATUS, CREATED_STATUS } from "@/utils/orders/constants";
import { clampPageSize } from "@/utils/orders/pagination";

/**
 * Builds order route handlers with injected business dependencies.
 */
export function createOrdersRouter(service: {
  listOrders: (pageSize: number) => Promise<unknown>;
  createOrder: (body: unknown) => Promise<unknown>;
}) {
  /**
   * GET /api/orders
   * Returns paginated orders.
   */
  async function GET(request: NextRequest) {
    const pageSizeParam = Number(request.nextUrl.searchParams.get("pageSize"));
    const pageSize = clampPageSize(pageSizeParam);
    const data = await service.listOrders(pageSize);
    return NextResponse.json(data);
  }

  /**
   * POST /api/orders
   * Creates a new order.
   */
  async function POST(request: NextRequest) {
    const body = await request.json();
    if (!body) {
      return NextResponse.json(
        { error: "Missing payload" },
        { status: BAD_REQUEST_STATUS },
      );
    }

    const created = await service.createOrder(body);
    return NextResponse.json(created, { status: CREATED_STATUS });
  }

  return { GET, POST };
}
```

## ❌ Bad Example

```ts
// src/app/api/orders/route.ts
import { useSelector } from "react-redux";

export async function GET(req: Request) {
  const pageSize = Number(new URL(req.url).searchParams.get("pageSize")) || 20; // magic number
  const capped = Math.min(pageSize, 100); // magic number
  const token = useSelector((state) => state.auth.token); // hook usage in utility flow
  return Response.json({ capped, token }, { status: 200 }); // magic status number
}

export async function POST(req: Request) {
  // no JSDoc
  const payload = await req.json();
  return Response.json(payload, { status: 201 }); // magic number
}
```

## Pull Request Checklist

- [ ] Any repeated logic (2+ usages) moved to `src/utils/{domain}`.
- [ ] Constants live in `src/utils/{domain}/constants.ts`.
- [ ] Utility functions are pure and framework-agnostic.
- [ ] No magic numbers/strings in handlers or business logic.
- [ ] JSDoc added to router factory, each handler, and business logic functions.
