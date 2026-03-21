# ADR 003: Constants and Configuration

**Status:** Accepted  
**Date:** 2026-01-01  
**Context:** Establishing where constants, magic numbers, and configuration values should live

## Decision

Constants must be extracted from inline code and organized by domain. Configuration values live in Redux store, constants live in `src/utils/`.

## Rationale

### The Problem

Magic numbers and hardcoded values scattered throughout code lead to:
- **Inconsistency** - Same value defined differently in different places
- **Hard to update** - Need to find all occurrences to change
- **Unclear meaning** - `300` means what? Seconds? Pixels? Bytes?
- **Error-prone** - Easy to mistype or use wrong value
- **Testing difficulty** - Can't easily mock or override values

### Example: Current Issues

```typescript
// useMediaRecorder.ts
const MAX_RECORDING_DURATION = 300; // 5 minutes in seconds

// recorder-controls.tsx
const getRemainingTime = (): string => {
  const remaining = 300 - recordingDuration; // What is 300?
  return formatDuration(remaining);
};

// another-file.ts
if (duration > 5 * 60) { // Yet another way to express the same thing
  // ...
}
```

**Problems:**
- Same value defined 3 different ways
- No single source of truth
- Unclear what the numbers mean
- Hard to change max duration globally

## Rules

### 1. Extract All Magic Numbers

Replace magic numbers with named constants:

```typescript
// ✅ GOOD: Named constant with clear meaning
import { MAX_RECORDING_DURATION } from '@/utils/video/constants';

if (duration >= MAX_RECORDING_DURATION) {
  stopRecording();
}
```

```typescript
// ❌ BAD: Magic number
if (duration >= 300) {
  stopRecording();
}
```

### 2. Constants Location: Domain-Based

Constants live with their domain utilities:

```
src/utils/
├── video/
│   ├── constants.ts          # Video-related constants
│   ├── getBlobDuration.ts
│   └── index.ts
├── date-time/
│   ├── constants.ts          # Time-related constants
│   ├── formatDuration.ts
│   └── index.ts
└── network/
    ├── constants.ts          # API/network constants
    └── index.ts
```

**Example: Video Constants**

```typescript
// src/utils/video/constants.ts

/**
 * Maximum recording duration in seconds (5 minutes)
 */
export const MAX_RECORDING_DURATION = 300;

/**
 * Recording duration in milliseconds
 */
export const MAX_RECORDING_DURATION_MS = MAX_RECORDING_DURATION * 1000;

/**
 * Supported video MIME types in order of preference
 */
export const SUPPORTED_VIDEO_MIME_TYPES = [
  'video/webm;codecs=vp9',
  'video/webm;codecs=vp8',
  'video/webm',
] as const;

/**
 * Default video bitrate (2.5 Mbps)
 */
export const DEFAULT_VIDEO_BITRATE = 2_500_000;

/**
 * Default video resolution
 */
export const DEFAULT_VIDEO_RESOLUTION = {
  width: 1920,
  height: 1080,
} as const;

/**
 * Default frame rate
 */
export const DEFAULT_FRAME_RATE = 30;
```

### 3. Group Related Constants

Group constants into objects when they're related:

```typescript
// ✅ GOOD: Grouped related constants
export const VIDEO_CONSTRAINTS = {
  maxDuration: 300,
  maxFileSize: 100_000_000, // 100MB
  minDuration: 1,
  resolution: {
    width: 1920,
    height: 1080,
  },
  frameRate: 30,
  bitrate: 2_500_000,
} as const;

// Usage
if (duration > VIDEO_CONSTRAINTS.maxDuration) { /* ... */ }
```

```typescript
// ❌ BAD: Scattered individual exports
export const MAX_DURATION = 300;
export const MAX_SIZE = 100_000_000;
export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;
export const FRAME_RATE = 30;
```

### 4. Use TypeScript const assertions

For constants that should be readonly:

```typescript
// ✅ GOOD: Immutable with type inference
export const SUPPORTED_FORMATS = ['webm', 'mp4'] as const;
// Type: readonly ["webm", "mp4"]

export const VIDEO_CONFIG = {
  maxDuration: 300,
  bitrate: 2_500_000,
} as const;
// Type: { readonly maxDuration: 300; readonly bitrate: 2500000 }
```

### 5. Document Constants

Every constant needs:
- JSDoc comment explaining what it is
- Units if applicable (seconds, bytes, pixels, etc.)
- Why that specific value was chosen (if not obvious)

```typescript
/**
 * Maximum recording duration in seconds
 * 
 * Set to 5 minutes to balance:
 * - User experience (enough time for demos)
 * - File size (manageable uploads)
 * - Storage costs (reasonable per-video cost)
 */
export const MAX_RECORDING_DURATION = 300;

/**
 * Video bitrate in bits per second (2.5 Mbps)
 * 
 * Provides good quality for screen recordings while
 * keeping file sizes reasonable for upload.
 */
export const DEFAULT_VIDEO_BITRATE = 2_500_000;
```

### 6. Environment vs. Constants

**Constants** - Values that don't change between environments:

```typescript
// src/utils/video/constants.ts
export const MAX_RECORDING_DURATION = 300; // Always 5 minutes
export const SUPPORTED_FORMATS = ['webm', 'mp4'] as const;
```

**Configuration** - Values that change between environments:

```typescript
// src/store/config/environment.ts
const initialState = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  maxUploadSize: process.env.MAX_UPLOAD_SIZE || 100_000_000,
};
```

**When to use which:**
- ✅ **Constants** - Business logic, UI limits, format specs
- ✅ **Config** - API URLs, feature flags, environment-specific values

## Common Constant Domains

### Video Constants (`utils/video/constants.ts`)
```typescript
export const MAX_RECORDING_DURATION = 300;
export const DEFAULT_VIDEO_BITRATE = 2_500_000;
export const SUPPORTED_VIDEO_MIME_TYPES = ['video/webm;codecs=vp9'] as const;
```

### Date/Time Constants (`utils/date-time/constants.ts`)
```typescript
export const MILLISECONDS_PER_SECOND = 1000;
export const SECONDS_PER_MINUTE = 60;
export const MINUTES_PER_HOUR = 60;
export const HOURS_PER_DAY = 24;
```

### File Size Constants (`utils/file/constants.ts`)
```typescript
export const BYTES_PER_KB = 1024;
export const BYTES_PER_MB = BYTES_PER_KB * 1024;
export const BYTES_PER_GB = BYTES_PER_MB * 1024;
export const MAX_UPLOAD_SIZE = 100 * BYTES_PER_MB; // 100MB
```

### Network Constants (`utils/network/constants.ts`)
```typescript
export const API_TIMEOUT = 30_000; // 30 seconds
export const MAX_RETRY_ATTEMPTS = 3;
export const RETRY_DELAY = 1000; // 1 second
```

### UI Constants (`utils/ui/constants.ts`)
```typescript
export const MOBILE_BREAKPOINT = 768; // pixels
export const TABLET_BREAKPOINT = 1024;
export const MAX_NOTIFICATION_DURATION = 5000; // milliseconds
```

## Style Constants

For inline Tailwind classes, consider:

```typescript
// ✅ GOOD: Reusable style constants when used multiple times
const BUTTON_BASE = 'px-4 py-2 rounded-lg font-semibold transition-colors border-none cursor-pointer';

const styles = {
  primaryButton: `${BUTTON_BASE} bg-blue-600 hover:bg-blue-700 text-white`,
  secondaryButton: `${BUTTON_BASE} bg-gray-300 hover:bg-gray-400 text-gray-800`,
  dangerButton: `${BUTTON_BASE} bg-red-600 hover:bg-red-700 text-white`,
};
```

Or better yet, extract to a shared styles utility:

```typescript
// src/utils/ui/button-styles.ts
export const buttonStyles = {
  base: 'px-4 py-2 rounded-lg font-semibold transition-colors border-none cursor-pointer',
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-300 hover:bg-gray-400 text-gray-800',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
};

// Usage in components
import { buttonStyles } from '@/utils/ui/button-styles';

<button className={`${buttonStyles.base} ${buttonStyles.primary}`}>
  Click Me
</button>
```

## TypeScript Enums vs. Constants

Prefer constants over enums:

```typescript
// ✅ GOOD: Constants with type
export const VIDEO_STATE = {
  IDLE: 'idle',
  RECORDING: 'recording',
  PAUSED: 'paused',
  STOPPED: 'stopped',
} as const;

export type VideoState = typeof VIDEO_STATE[keyof typeof VIDEO_STATE];
```

```typescript
// ❌ AVOID: TypeScript enums (less flexible, harder to work with)
enum VideoState {
  IDLE = 'idle',
  RECORDING = 'recording',
  PAUSED = 'paused',
  STOPPED = 'stopped',
}
```

## Migration Checklist

When you find magic numbers/strings:

1. ✅ Identify the value's domain (video, time, network, etc.)
2. ✅ Create constant in `src/utils/{domain}/constants.ts`
3. ✅ Add JSDoc with units and reasoning
4. ✅ Export from domain's `index.ts`
5. ✅ Replace all occurrences in codebase
6. ✅ Use TypeScript `as const` for immutability

## Red Flags

Watch for these signals:

- 🚩 Numbers in code without variable names
- 🚩 Same number appearing in multiple files
- 🚩 Strings repeated across components
- 🚩 Comments explaining what a number means
- 🚩 Math operations with unclear numbers (`5 * 60`)

## Benefits

- **Single source of truth** - One place to update values
- **Self-documenting** - Named constants explain themselves
- **Type-safe** - TypeScript ensures correct usage
- **Testable** - Easy to override in tests
- **Maintainable** - Changes propagate automatically
- **Discoverable** - Easy to find available constants

## Examples

### Before: Magic Numbers

```typescript
// useMediaRecorder.ts
const MAX_RECORDING_DURATION = 300;

// recorder-controls.tsx
const getRemainingTime = (): string => {
  const remaining = 300 - recordingDuration;
  return formatDuration(remaining);
};

// MediaRecorder setup
const mediaRecorder = new MediaRecorder(displayStream, {
  videoBitsPerSecond: 2500000, // What is this?
});

// Resolution
const displayStream = await navigator.mediaDevices.getDisplayMedia({
  video: {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    frameRate: { ideal: 30 },
  },
});
```

### After: Named Constants

```typescript
// src/utils/video/constants.ts
export const VIDEO_CONSTRAINTS = {
  maxDuration: 300,
  bitrate: 2_500_000,
  resolution: { width: 1920, height: 1080 },
  frameRate: 30,
} as const;

// useMediaRecorder.ts
import { VIDEO_CONSTRAINTS } from '@/utils/video/constants';

// recorder-controls.tsx
import { VIDEO_CONSTRAINTS } from '@/utils/video/constants';
import { getRemainingTime } from '@/utils/date-time';

const remaining = getRemainingTime(recordingDuration, VIDEO_CONSTRAINTS.maxDuration);

// MediaRecorder setup
const mediaRecorder = new MediaRecorder(displayStream, {
  videoBitsPerSecond: VIDEO_CONSTRAINTS.bitrate,
});

// Resolution
const displayStream = await navigator.mediaDevices.getDisplayMedia({
  video: {
    width: { ideal: VIDEO_CONSTRAINTS.resolution.width },
    height: { ideal: VIDEO_CONSTRAINTS.resolution.height },
    frameRate: { ideal: VIDEO_CONSTRAINTS.frameRate },
  },
});
```

## References

- See ADR 001 for utility organization patterns
- See `src/utils/*/constants.ts` for examples
- See `src/store/config/` for environment configuration

