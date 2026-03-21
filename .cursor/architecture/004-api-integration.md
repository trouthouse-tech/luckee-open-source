# 004 - API Integration Patterns (Next.js)

## Objective

Define one consistent API integration pattern for this Next.js codebase so data flow, typing, and error handling are predictable.

## Required Rules

1. **API functions live in `src/api/{domain}/` only.**
2. **All API boundaries return `ApiResponse<T>`.**
3. **Components never call API functions directly. Components dispatch thunks; thunks call API functions.**
4. **Error handling must be explicit and status-code driven.**
5. **JSDoc is required on router factory, each route handler, and business logic functions.**

---

## 1) File and Ownership Pattern

```text
src/
  api/
    _shared/
      types.ts
      response.ts
    lots/
      client.ts
      service.ts
      mapper.ts
  app/
    api/
      lots/
        [lotId]/
          route.ts
  store/
    thunks/
      lots.thunks.ts
```

- `src/api/{domain}/client.ts`: outbound HTTP calls and response parsing.
- `src/api/{domain}/service.ts`: business logic orchestration (validation, transformation, composition).
- `src/app/api/**/route.ts`: Next.js route handlers only.
- `src/store/thunks/**`: the **only** client-side layer allowed to call `src/api/**`.

---

## 2) `ApiResponse<T>` Contract

```ts
// src/api/_shared/types.ts
export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "UNPROCESSABLE_ENTITY"
  | "TOO_MANY_REQUESTS"
  | "INTERNAL_SERVER_ERROR"
  | "SERVICE_UNAVAILABLE";

export type ApiResponse<T> =
  | {
      ok: true;
      status: number;
      data: T;
      message?: string;
    }
  | {
      ok: false;
      status: number;
      error: {
        code: ApiErrorCode;
        message: string;
        details?: unknown;
      };
    };
```

### Response Helper

```ts
// src/api/_shared/response.ts
import { NextResponse } from "next/server";
import type { ApiResponse } from "./types";

export function jsonResponse<T>(payload: ApiResponse<T>) {
  return NextResponse.json(payload, { status: payload.status });
}
```

---

## 3) JSDoc Requirements (Factory, Handlers, Business Logic)

### Router Factory (required JSDoc)

```ts
// src/api/_shared/router-factory.ts
import type { NextRequest } from "next/server";
import type { ApiResponse } from "./types";
import { jsonResponse } from "./response";

/**
 * Creates a standardized Next.js route handler with shared error handling.
 * Ensures every route returns ApiResponse<T> and consistent HTTP status codes.
 */
export function createRouteHandler<T>(
  handler: (req: NextRequest) => Promise<ApiResponse<T>>
) {
  return async function routeHandler(req: NextRequest) {
    try {
      const result = await handler(req);
      return jsonResponse(result);
    } catch (error) {
      return jsonResponse({
        ok: false,
        status: 500,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Unexpected server error",
          details: error,
        },
      });
    }
  };
}
```

### Route Handlers (required JSDoc on each exported handler)

```ts
// src/app/api/lots/[lotId]/route.ts
import { createRouteHandler } from "@/api/_shared/router-factory";
import { getLotById } from "@/api/lots/service";

/**
 * GET /api/lots/:lotId
 * Returns a lot by id.
 */
export const GET = createRouteHandler(async (_req) => {
  return getLotById("example-id");
});
```

### Business Logic Functions (required JSDoc)

```ts
// src/api/lots/service.ts
import type { ApiResponse } from "@/api/_shared/types";
import type { Lot } from "@/model/lot";

/**
 * Fetches and validates a lot domain entity, then maps it to API response shape.
 */
export async function getLotById(lotId: string): Promise<ApiResponse<Lot>> {
  if (!lotId) {
    return {
      ok: false,
      status: 400,
      error: { code: "BAD_REQUEST", message: "lotId is required" },
    };
  }

  // Domain fetch omitted.
  return {
    ok: true,
    status: 200,
    data: {} as Lot,
  };
}
```

---

## 4) Thunk-Only API Access

### ✅ Correct: Component -> Thunk -> API

```ts
// src/store/thunks/lots.thunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { lotsApi } from "@/api/lots/client";

/**
 * Loads a lot by id through the API layer.
 */
export const fetchLotByIdThunk = createAsyncThunk(
  "lots/fetchById",
  async (lotId: string, { rejectWithValue }) => {
    const result = await lotsApi.getById(lotId);
    if (!result.ok) return rejectWithValue(result.error);
    return result.data;
  }
);
```

```tsx
// src/components/LotView.tsx
const dispatch = useAppDispatch();

useEffect(() => {
  void dispatch(fetchLotByIdThunk(lotId));
}, [dispatch, lotId]);
```

### ❌ Incorrect: Component calls API directly

```tsx
// Do not do this:
useEffect(() => {
  void lotsApi.getById(lotId); // bypasses thunk/state/error lifecycle
}, [lotId]);
```

---

## 5) Error Handling and Status Codes

### Status Code Guidance

| Status | Use for |
| --- | --- |
| `200` | Successful read/update response with body |
| `201` | Resource created |
| `204` | Successful action with no response body |
| `400` | Invalid input or malformed request |
| `401` | Unauthenticated |
| `403` | Authenticated but not allowed |
| `404` | Resource not found |
| `409` | Conflict (duplicate/state collision) |
| `422` | Semantically invalid data |
| `429` | Rate limited |
| `500` | Unexpected server error |
| `503` | Upstream dependency unavailable |

### ✅ Correct: Always return structured error

```ts
return {
  ok: false,
  status: 404,
  error: {
    code: "NOT_FOUND",
    message: `Lot ${lotId} not found`,
  },
} satisfies ApiResponse<never>;
```

### ❌ Incorrect: Throw raw errors to client

```ts
throw new Error("Lot not found"); // no status, no typed payload
```

---

## 6) ✅ / ❌ Quick Rules

### API Placement

- ✅ `src/api/lots/client.ts`
- ❌ `src/components/lots/api.ts`

### Return Types

- ✅ `Promise<ApiResponse<Lot>>`
- ❌ `Promise<any>`

### Component Usage

- ✅ `dispatch(fetchLotByIdThunk(id))`
- ❌ `await fetch("/api/lots/" + id)` inside component

### JSDoc Coverage

- ✅ Router factory has JSDoc
- ✅ Every exported `GET/POST/PATCH/DELETE` handler has JSDoc
- ✅ Every exported business logic function has JSDoc
- ❌ Missing JSDoc on any of the above

---

## 7) PR Review Checklist

- [ ] API function added under `src/api/{domain}/`
- [ ] Uses `ApiResponse<T>` for success and error shapes
- [ ] Called from thunk only (no direct component API call)
- [ ] Error branch returns typed error with explicit status code
- [ ] JSDoc present on router factory, handler(s), and business logic function(s)
