# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) that document the key architectural patterns and decisions for this project.

## What are ADRs?

ADRs capture important architectural decisions along with their context and consequences. They help:
- Explain **why** code is structured a certain way
- Provide guidance for new team members and AI assistants
- Maintain consistency across the codebase
- Document patterns to follow when adding new features

## Quick Reference

### Core Principles

1. **Utilities are reusable** - Extract functions to `src/utils/{domain}/` when used 2+ times
2. **Packages organize features** - Each feature lives in `src/packages/{feature}/`
3. **One component per file** - Never put multiple components in a single file
4. **Components call thunks directly** - No custom hooks that just wrap thunks
5. **Constants are named** - No magic numbers, extract to domain constants
6. **Styles stay inline** - Keep styles in component file below the component
7. **Use `type` not `interface`** - For consistency

### Common Patterns

#### Extracting a Utility
```typescript
// ❌ DON'T: Inline utility function in component
const formatDuration = (seconds: number) => { /* ... */ };

// ✅ DO: Extract to utils
import { formatDuration } from '@/utils/date-time';
```

#### One Component Per File
```typescript
// ❌ DON'T: Multiple components in one file
// RecorderFlow.tsx
const StartScreen = () => <div>Start</div>;
const ActiveScreen = () => <div>Recording...</div>;
export const RecorderFlow = () => (<>...</>);

// ✅ DO: One component per file; composer imports sub-components
// index.tsx
import { RecordingStartScreen } from './RecordingStartScreen';
import { RecordingActiveScreen } from './RecordingActiveScreen';
export const RecorderPage = () => (<>...</>);

// RecordingStartScreen.tsx
export const RecordingStartScreen = () => <div>Start</div>;
```

#### Package Structure
```typescript
// ❌ DON'T: Put features in components/
src/components/recorder/recorder-controls.tsx

// ✅ DO: Use packages for features (one component per file)
src/packages/recorder/index.tsx
src/packages/recorder/RecordingStartScreen.tsx
src/packages/recorder/RecordingActiveScreen.tsx

// ✅ DO: App pages are thin wrappers
// app/page.tsx
import RecorderPage from '../../packages/recorder';

export default function Page() {
  return <RecorderPage />;
}
```

#### Call Thunks Directly
```typescript
// ❌ DON'T: Custom hook wrapping thunks
const useRecorder = () => {
  const dispatch = useDispatch();
  const start = () => dispatch(startRecordingThunk());
  return { start };
};

// ✅ DO: Call thunks directly
const handleStart = () => {
  dispatch(startRecordingThunk());
};
```

#### Using Constants
```typescript
// ❌ DON'T: Magic numbers
if (duration > 300) { /* ... */ }

// ✅ DO: Named constants
import { MAX_RECORDING_DURATION } from '@/utils/video/constants';
if (duration > MAX_RECORDING_DURATION) { /* ... */ }
```

## ADRs Index

### [ADR 001: Utility Organization](./001-utility-organization.md)
**Status:** Accepted

How to organize and structure utility functions in domain-based folders.

**Key Points:**
- Utilities live in `src/utils/{domain}/functionName.ts`
- One function per file with JSDoc comments
- Use barrel exports (`index.ts`) for clean imports
- Extract functions used 2+ times
- Keep utilities pure and framework-agnostic

**When to reference:**
- Before creating a new utility function
- When you find duplicate logic across files
- When a component has inline helper functions

---

### [ADR 002: Component Composition](./002-component-composition.md)
**Status:** Accepted

Package-based architecture for organizing features.

**Key Points:**
- Features live in `src/packages/{feature}/`
- **One component per file**—never multiple components in a single file
- App pages are thin wrappers
- Components call thunks directly (no custom hooks wrapping thunks)
- Styles stay inline in component file
- Use `type` not `interface`
- Package index exports public API only

**When to reference:**
- Before creating a new feature
- When organizing related components
- When adding a new component (put it in its own file)
- When tempted to create custom hooks
- When deciding where styles should live

---

### [ADR 003: Constants and Configuration](./003-constants-and-configuration.md)
**Status:** Accepted

Where to define constants, magic numbers, and configuration values.

**Key Points:**
- Extract all magic numbers to named constants
- Constants live in `src/utils/{domain}/constants.ts`
- Group related constants into objects
- Use TypeScript `as const` for immutability
- Document with JSDoc including units and reasoning

**When to reference:**
- When you see a number or string repeated in code
- Before hardcoding a value
- When adding new configuration
- When unsure if something is a constant or config

---

### [ADR 004: Redux State Management](./004-redux-state-management.md)
**Status:** Accepted

Redux architecture with typed hooks, manual thunks, and organized slices.

**Key Points:**
- Typed hooks: `useAppDispatch`, `useAppSelector`
- Four slice types: dumps, current, builders, config
- Manual thunks with `AppThunk<R>` (no `createAsyncThunk`)
- Normalized state in dumps (object with ID keys)
- Thunks return status codes (200, 400, 500)

**When to reference:**
- Setting up Redux in new project
- Creating new slices
- Writing thunks
- Organizing state by type

---

### [ADR 005: API Layer Architecture](./005-api-layer-architecture.md)
**Status:** Accepted

Frontend API functions with standardized `ApiResponse<T>` wrapper and backend service organization.

**Key Points:**
- API functions return `ApiResponse<T>` with `success`, `data`, `error`
- Take `apiBaseUrl` as first parameter
- One function per file with JSDoc
- Organized by domain (e.g., `api/videos/`)
- Called from thunks, never directly from components
- Consistent error handling with emoji logging

**When to reference:**
- Creating new API endpoints
- Adding frontend API functions
- Organizing backend services
- Error handling patterns

---

## File Organization

```
src/
├── app/                        # Next.js app router (thin wrappers)
│   └── dashboard/
│       └── page.tsx           # Just imports from packages
├── packages/                   # Feature packages
│   ├── recorder/
│   │   ├── index.tsx          # Main component
│   │   ├── RecordingStartScreen.tsx
│   │   └── RecordingActiveScreen.tsx
│   └── welcome/
│       └── index.tsx          # Main component
├── components/                 # Truly reusable UI components
│   ├── AppLayout.tsx
│   ├── Header.tsx
│   └── Button.tsx
├── utils/                      # Utility functions by domain
│   ├── date-time/
│   │   ├── formatDuration.ts
│   │   ├── getRemainingTime.ts
│   │   └── index.ts           # Barrel export (non-UI folder)
│   ├── video/
│   │   ├── constants.ts
│   │   └── index.ts           # Barrel export (non-UI folder)
│   └── url/
│       ├── buildShareUrl.ts
│       └── index.ts           # Barrel export (non-UI folder)
├── hooks/                      # Custom React hooks (sparingly)
├── store/                      # Redux store
│   ├── builders/              # UI state
│   ├── current/               # Current editing state
│   ├── dumps/                 # Normalized data
│   ├── config/                # Configuration
│   └── thunks/                # Async actions
└── api/                        # API layer
```

**Note:** `index.ts` barrel exports are ONLY for non-UI folders (utils, store, api, services). UI folders use `index.tsx` as the main component.

## When to Create a New ADR

Create a new ADR when:
- Establishing a new architectural pattern
- Making a decision that affects multiple parts of the codebase
- Changing an existing pattern (mark old one as superseded)
- Documenting a pattern used in multiple projects

ADR Template:
```markdown
# ADR XXX: [Title]

**Status:** [Proposed | Accepted | Deprecated | Superseded by ADR-YYY]
**Date:** YYYY-MM-DD
**Context:** Why we're making this decision

## Decision
What we decided to do

## Rationale
Why we made this decision

## Rules
Specific guidelines to follow

## Benefits
What we gain from this approach

## References
Links to related ADRs or documentation
```

## How to Use These ADRs

### For Developers
1. **Read all ADRs** when joining the project
2. **Reference ADRs** when implementing features
3. **Follow the patterns** demonstrated in examples
4. **Propose updates** when patterns need refinement

### For AI Assistants (Cursor, Copilot, etc.)
1. **Consult ADRs** before generating code
2. **Follow the rules** specified in each ADR
3. **Apply patterns** from the examples
4. **Point to ADRs** when explaining architectural decisions

### For Code Reviews
- Verify code follows ADR patterns
- Reference specific ADRs in review comments
- Suggest ADR updates if patterns are unclear

## Contributing

To update an ADR:
1. Add a note explaining the change
2. Update the date
3. If major change, consider creating a new ADR and marking old one as superseded

To add a new ADR:
1. Use the next sequential number
2. Follow the template structure
3. Add it to this README index
4. Update `.cursorrules` if relevant

## Benefits of This Approach

- ✅ **Portable** - Works with any AI tool, any developer
- ✅ **Searchable** - Easy to find relevant patterns
- ✅ **Maintainable** - Clear structure for updates
- ✅ **Enforceable** - Code structure makes patterns obvious
- ✅ **Scalable** - Easy to add new patterns as needed
- ✅ **Educational** - New team members learn from examples

## Additional Resources

- See `.cursorrules` for quick reminders to check these ADRs
- See `src/utils/` for working utility examples
- See `src/components/` for component composition examples

