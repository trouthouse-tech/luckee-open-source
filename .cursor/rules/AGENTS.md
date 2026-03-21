# roads-seller-web Next.js Rules

BEFORE implementing ANY feature, you MUST:
1. Read `.cursor/architecture/README.md`.
2. Read the relevant ADRs in `.cursor/architecture/`.
3. Follow documented patterns EXACTLY; if no pattern exists, you MUST add an ADR first.

## Non-Negotiable Rules

### Redux
1. You MUST keep Redux logic in `src/store/` and feature state close to its slice.
2. You MUST use Redux Toolkit slice patterns; NEVER write ad-hoc mutable global state.
3. You MUST expose typed store hooks/selectors from `src/store/` and ALWAYS reuse them.
4. You MUST keep async side effects out of components; ALWAYS place them in thunks/services.

### Components
1. You MUST keep route segments in `src/app/`; shared UI MUST live in `src/components/`.
2. You MUST keep components focused and composable; NEVER mix data orchestration with presentational markup.
3. You MUST default to Server Components and ONLY use `"use client"` when browser APIs/state are required.
4. You MUST pass explicit typed props; NEVER use `any` in component public interfaces.

### Styling
1. You MUST use the approved styling approach from architecture ADRs (Tailwind/utilities + globals).
2. You MUST keep design tokens and global rules in `src/app/globals.css`.
3. You MUST avoid inline style objects except truly dynamic one-off values.
4. You MUST keep class composition predictable; NEVER hide core layout rules in JS helpers without ADR approval.

### API
1. You MUST place HTTP handlers in `src/app/api/**/route.ts`.
2. You MUST add JSDoc to every router factory, each exported handler (`GET`, `POST`, etc.), and all business-logic functions they call.
3. You MUST keep handlers thin: validate input, delegate business logic, map errors to HTTP responses.
4. You MUST NEVER access request bodies/query params directly in business logic; pass typed DTOs.

### Files
1. You MUST colocate files by feature/domain and keep naming explicit (`*.slice.ts`, `*.service.ts`, `*.types.ts`).
2. You MUST keep one primary responsibility per file; split files once they mix UI, state, and API concerns.
3. You MUST use barrel exports (`index.ts`) only when they reduce coupling and preserve clear ownership.
4. You MUST keep import boundaries clean; NEVER create circular dependencies.

## Quick Reference (Architecture + Next.js ADRs)
- Architecture entrypoint -> `.cursor/architecture/README.md`
- Next.js App Router boundaries -> `.cursor/architecture/010-nextjs-app-router-boundaries.md`
- Next.js data fetching and caching -> `.cursor/architecture/011-nextjs-data-fetching-caching.md`
- Next.js route handlers and API contracts -> `.cursor/architecture/012-nextjs-route-handlers-api-contracts.md`
- Redux usage in Next.js -> `.cursor/architecture/013-redux-in-nextjs.md`
- Styling system and Tailwind conventions -> `.cursor/architecture/014-styling-system-tailwind.md`
- File and module organization -> `.cursor/architecture/015-file-module-organization.md`
