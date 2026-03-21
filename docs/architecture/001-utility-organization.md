# ADR 001: Utility Organization

**Status:** Accepted  
**Date:** 2026-01-01  
**Context:** Establishing a scalable, maintainable utility structure

## Decision

All utility functions must be organized by domain in `src/utils/{domain}/functionName.ts` structure.

## Rationale

### The Problem

Without a clear utility structure, teams tend to:
- Duplicate functions across files (`formatDuration` appears in 3+ places)
- Implement the same logic differently based on preference or unawareness
- Bloat component files with generic logic that doesn't belong there
- Make codebases harder to maintain and test

### The Solution

**Domain-based utility organization:**

```
src/utils/
├── date-time/          # Time and date formatting/manipulation
│   ├── formatDuration.ts
│   ├── getRemainingTime.ts
│   └── index.ts
├── video/              # Video-specific utilities
│   ├── constants.ts
│   ├── getBlobDuration.ts
│   └── index.ts
├── text/               # String manipulation
│   ├── truncate.ts
│   ├── slugify.ts
│   └── index.ts
└── url/                # URL building and manipulation
    ├── buildShareUrl.ts
    ├── copyToClipboard.ts
    └── index.ts
```

## Rules

### 1. One Function Per File

Each utility function gets its own file:

```typescript
// ✅ GOOD: src/utils/date-time/formatDuration.ts
/**
 * Formats a duration in seconds to MM:SS format
 * @param seconds - Duration in seconds
 * @returns Formatted string in MM:SS format
 * @example
 * formatDuration(65) // "01:05"
 * formatDuration(0) // "00:00"
 */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
```

```typescript
// ❌ BAD: Inline in component
const RecorderControls = () => {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  // ... component code
};
```

### 2. Use Barrel Exports

Each domain folder has an `index.ts` for clean imports:

```typescript
// src/utils/date-time/index.ts
export * from './formatDuration';
export * from './getRemainingTime';
```

This allows:

```typescript
// ✅ Clean import
import { formatDuration, getRemainingTime } from '@/utils/date-time';

// ❌ Avoid direct file imports (harder to refactor)
import { formatDuration } from '@/utils/date-time/formatDuration';
```

### 3. Complete JSDoc Comments

Every utility must have:
- Purpose description
- Parameter documentation with types
- Return value documentation
- At least one `@example` showing usage
- Edge cases or gotchas if applicable

```typescript
/**
 * Builds a shareable video URL from a share token
 * @param shareToken - Unique video share token
 * @param baseUrl - Optional base URL (defaults to window.location.origin)
 * @returns Full shareable URL
 * @example
 * buildShareUrl('abc123') // "https://example.com/v/abc123"
 * buildShareUrl('abc123', 'https://custom.com') // "https://custom.com/v/abc123"
 */
export const buildShareUrl = (shareToken: string, baseUrl?: string): string => {
  const base = baseUrl || window.location.origin;
  return `${base}/v/${shareToken}`;
};
```

### 4. Keep Utilities Pure

Utilities should be:
- **Pure functions** (same input → same output)
- **Side-effect free** when possible
- **Framework agnostic** (no React hooks, no Redux)
- **Easily testable**

```typescript
// ✅ GOOD: Pure utility
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// ❌ BAD: Not a utility, this is a hook
export const useFormattedDuration = (seconds: number) => {
  const [formatted, setFormatted] = useState('');
  // ... hook logic
};
```

### 5. When to Extract a Utility

Extract to a utility when:
- ✅ Function is used in 2+ places
- ✅ Function performs data transformation/conversion
- ✅ Function has no side effects
- ✅ Function could be useful in other contexts
- ✅ Function is more than 3 lines and has clear single purpose

Don't extract when:
- ❌ Function is highly specific to one component
- ❌ Function uses React hooks or component state
- ❌ Function is just 1-2 lines (unless used everywhere)
- ❌ Function has side effects (API calls, mutations)

## Domain Guidelines

### `date-time/`
Time, date, duration formatting and manipulation
- `formatDuration`, `formatTimestamp`, `parseISODate`

### `video/`
Video-specific utilities and constants
- `constants.ts` (MAX_RECORDING_DURATION, supported codecs)
- Video blob/metadata helpers

### `text/`
String manipulation and formatting
- `truncate`, `slugify`, `capitalize`, `stripHTML`

### `url/`
URL building, parsing, and clipboard operations
- `buildShareUrl`, `copyToClipboard`, `parseQueryParams`

### `number/`
Number formatting and math utilities
- `formatBytes`, `formatPercentage`, `clamp`

## Migration Path

When you find duplicated logic:

1. **Identify the domain** - Where does this utility belong?
2. **Create the file** - `src/utils/{domain}/{functionName}.ts`
3. **Add JSDoc** - Document thoroughly
4. **Export from index** - Add to domain's `index.ts`
5. **Replace usage** - Update imports across codebase
6. **Test** - Verify functionality unchanged

## Benefits

- **DRY** - Write once, use everywhere
- **Testable** - Pure functions are easy to test
- **Discoverable** - Clear structure makes utilities easy to find
- **Maintainable** - One place to update, fixes propagate everywhere
- **Scalable** - Easy to add new utilities as needs grow

## References

- See ADR 003 for constants organization
- See `src/utils/` for working examples

