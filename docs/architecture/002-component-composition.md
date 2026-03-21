# ADR 002: Component Composition

**Status:** Accepted  
**Date:** 2026-01-01  
**Context:** Establishing patterns for scalable, maintainable React components

## Decision

Components should be organized in `src/packages/{feature}/` with focused, composable sub-components. **Each file must contain exactly one component**—never multiple components in a single file. Components call thunks directly instead of using custom hooks. Styles stay inline within the component file.

## Rationale

### The Problem

Without clear component organization:
- **Unclear boundaries** - Where does "data" stop and "scheduler" begin?
- **Hard to navigate** - Components scattered without clear grouping
- **Prop drilling** - Data passed through unnecessarily
- **Hook proliferation** - Custom hooks that just wrap thunks

## File Organization

### Package Structure

```
src/
├── app/                           # Next.js pages (thin wrappers)
│   └── dashboard/
│       └── page.tsx              # Just imports from packages
├── packages/                      # Feature packages
│   └── {feature}/                # e.g., recorder, welcome, builder
│       ├── index.tsx             # Main component/composer
│       └── {SubComponent}.tsx    # Co-located components
└── components/                    # Truly reusable UI components
    ├── AppLayout.tsx
    ├── Header.tsx
    └── Button.tsx
```

### Example: Recorder Package

```
src/packages/recorder/
├── index.tsx                      # Main component (composes sub-components)
├── RecordingStartScreen.tsx       # Co-located sub-component
├── RecordingActiveScreen.tsx      # Co-located sub-component
└── RecordingErrorMessage.tsx      # Co-located sub-component
```

## Rules

### 1. App Pages Are Thin Wrappers

App router pages just import from packages:

```typescript
// ✅ GOOD: app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { initializeAuthThunk } from '../../store/thunks/auth';
import { DashboardContent } from '../../packages/root/dashboard-content';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, hasInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuthThunk());
  }, [dispatch]);

  useEffect(() => {
    if (hasInitialized && !isLoading && !isAuthenticated) {
      router.replace('/log-in');
    }
  }, [hasInitialized, isLoading, isAuthenticated, router]);

  const showSkeleton = !hasInitialized || isLoading;

  return <DashboardContent showSkeleton={showSkeleton} />;
}
```

### 2. Packages Own Features

Each package is a complete feature:

```typescript
// ✅ GOOD: packages/welcome/welcome-page.tsx
'use client';

import { ActionChecklist } from './action-checklist';

export const WelcomePage = () => {
  return (
    <div className={styles.container}>
      <ActionChecklist />
    </div>
  );
};

const styles = {
  container: `
    w-full py-8 px-4
  `,
};
```

### 3. Call Thunks Directly - No Custom Hooks

Components call thunks directly instead of wrapping them in hooks:

```typescript
// ✅ GOOD: Call thunks directly
export const HealthDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const healthStatuses = useSelector((state: RootState) => 
    Object.values(state.systemHealth.healthStatuses)
  );

  useEffect(() => {
    dispatch(getAllHealthStatusThunk());
  }, [dispatch]);

  const handleManualRefresh = async () => {
    await dispatch(getAllHealthStatusThunk());
  };

  return <div>{/* ... */}</div>;
};
```

```typescript
// ❌ BAD: Custom hook that just wraps thunks
const useHealthData = () => {
  const dispatch = useDispatch();
  const healthStatuses = useSelector(state => state.systemHealth.healthStatuses);
  
  const refresh = () => dispatch(getAllHealthStatusThunk());
  
  return { healthStatuses, refresh };
};

// Then in component
const { healthStatuses, refresh } = useHealthData(); // Unnecessary abstraction
```

**Exception:** Only create custom hooks for:
- Complex reusable logic across multiple features
- Third-party library integrations
- Browser API wrappers

### 4. Use `type` Not `interface`

```typescript
// ✅ GOOD: Use type
type DashboardContentProps = {
  showSkeleton?: boolean;
};

export const DashboardContent = ({ showSkeleton = false }: DashboardContentProps) => {
  // ...
};
```

```typescript
// ❌ BAD: interface
interface DashboardContentProps {
  showSkeleton?: boolean;
}
```

### 5. Styles Inline in Component File

Always keep styles in the same file, below the component:

```typescript
// ✅ GOOD: Styles inline below component
export const RecorderControls = () => {
  return (
    <div className={styles.container}>
      <button className={styles.startButton}>Start</button>
    </div>
  );
};

const styles = {
  container: `
    flex flex-col items-center justify-center
    min-h-screen p-8
    bg-gradient-to-br from-blue-50 to-indigo-100
  `,
  startButton: `
    bg-blue-600 hover:bg-blue-700
    text-white font-semibold py-4 px-8
    rounded-lg transition-colors
    border-none cursor-pointer
  `,
};
```

```typescript
// ❌ BAD: Separate styles file
import { styles } from './recorder-controls.styles';

// ❌ BAD: CSS modules
import styles from './recorder-controls.module.css';
```

### 6. Package index.tsx Is The Main Component

The `index.tsx` file in a package IS the main component itself, not a barrel export:

```typescript
// ✅ GOOD: packages/recorder/index.tsx
export default function RecorderPage() {
  const { recordingError, isRecording } = useAppSelector(state => state.recorderBuilder);

  return (
    <div className={styles.container}>
      {recordingError && <RecordingErrorMessage />}
      {!isRecording && !recordingError && <RecordingStartScreen />}
      {isRecording && <RecordingActiveScreen />}
    </div>
  );
}

const styles = {
  container: `min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100`,
};
```

```typescript
// ❌ BAD: Don't create index.ts barrel exports in UI folders
// packages/recorder/index.ts
export { RecorderMain } from './recorder-main';  // Wrong - this is for non-UI folders only
```

**Note:** `index.ts` (without .tsx) barrel exports are ONLY for non-UI folders like `utils/`, `store/`, `services/`, `api/`.

### 7. One Component Per File (Required)

**Never put multiple components in a single file.** Each `.tsx` file must define exactly one component and export it. Sub-components used by a parent must live in their own files and be imported.

```typescript
// ✅ GOOD: One component per file
// packages/recorder/RecordingStartScreen.tsx
export const RecordingStartScreen = () => { /* ... */ };

const styles = { /* ... */ };
```

```typescript
// ❌ BAD: Multiple components in one file
// packages/recorder/RecorderFlow.tsx
const RecordingStartScreen = () => { /* ... */ };
const RecordingActiveScreen = () => { /* ... */ };
export const RecorderFlow = () => (
  <>
    <RecordingStartScreen />
    <RecordingActiveScreen />
  </>
);
```

**Why:** One component per file keeps boundaries clear, makes discovery and refactors easier, and avoids bloated files. The composer (e.g. `index.tsx`) imports and composes sub-components from separate files.

### 8. Component Size Guidelines

While there's no strict line limit, keep components focused:
- ✅ A component that does one thing well
- ✅ Extract conditional UI blocks into **separate component files**
- ✅ Group related functionality together
- ❌ Multiple components in one file
- ❌ Giant files with multiple responsibilities
- ❌ Deeply nested conditionals

**Note:** Style objects can be large - that's fine. Focus on component logic size, not total file length.

## Component Patterns

### Main Composer Pattern

The `index.tsx` file composes sub-components:

```typescript
// packages/recorder/index.tsx
export default function RecorderPage() {
  const { recordingError, isRecording } = useAppSelector(state => state.recorderBuilder);

  return (
    <div className={styles.container}>
      {recordingError && <RecordingErrorMessage />}
      {!isRecording && !recordingError && <RecordingStartScreen />}
      {isRecording && <RecordingActiveScreen />}
    </div>
  );
}

const styles = {
  container: `flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100`,
};
```

### Sub-Component Pattern

Sub-components fetch their own data and actions:

```typescript
// packages/recorder/RecordingStartScreen.tsx
export const RecordingStartScreen = () => {
  const dispatch = useAppDispatch();
  
  const handleStart = async () => {
    await dispatch(startRecordingThunk());
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Record Your Screen</h1>
      <button onClick={handleStart} className={styles.button}>
        Start Recording
      </button>
    </div>
  );
};

const styles = {
  container: `text-center max-w-2xl`,
  title: `text-5xl font-bold text-gray-900 mb-4`,
  button: `bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg`,
};
```

## Real-World Example

### Before: Monolithic Component with Custom Hook

```typescript
// ❌ BAD: hooks/useMediaRecorder.ts
export const useMediaRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const startRecording = async () => { /* ... */ };
  return { startRecording, isRecording };
};

// ❌ BAD: app/page.tsx (doing too much)
export default function HomePage() {
  const { startRecording, stopRecording, isRecording } = useMediaRecorder();
  
  return (
    <div>
      {!isRecording && <button onClick={startRecording}>Start</button>}
      {isRecording && <button onClick={stopRecording}>Stop</button>}
    </div>
  );
}
```

### After: Package-Based with Direct Thunk Calls

```typescript
// ✅ GOOD: app/page.tsx (thin wrapper)
import RecorderPage from '../../packages/recorder';

export default function HomePage() {
  return <RecorderPage />;
}

// ✅ GOOD: packages/recorder/index.tsx
export default function RecorderPage() {
  const { isRecording } = useAppSelector(state => state.recorderBuilder);

  return (
    <div className={styles.container}>
      {!isRecording && <RecordingStartScreen />}
      {isRecording && <RecordingActiveScreen />}
    </div>
  );
}

const styles = {
  container: `min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100`,
};

// ✅ GOOD: packages/recorder/RecordingStartScreen.tsx
export const RecordingStartScreen = () => {
  const dispatch = useAppDispatch();
  
  const handleStart = async () => {
    await dispatch(startRecordingThunk());
  };
  
  return (
    <div className={styles.container}>
      <button onClick={handleStart} className={styles.button}>
        Start Recording
      </button>
    </div>
  );
};

const styles = {
  container: `text-center`,
  button: `bg-blue-600 text-white py-4 px-8 rounded-lg`,
};
```

## Red Flags

- 🚩 **Multiple components in a single file** (always one component per file)
- 🚩 Custom hook that just wraps a thunk call
- 🚩 Styles in separate files
- 🚩 Using `index.ts` barrel exports in UI folders (should be `index.tsx` with the component)
- 🚩 App page doing business logic
- 🚩 Using `interface` instead of `type`
- 🚩 Prop drilling more than 2 levels deep

## Benefits

- **Clear boundaries** - Each package is a feature
- **Easy navigation** - Find feature code in one place
- **Less abstraction** - Direct thunk calls are simpler
- **Co-located styles** - No hunting for CSS files
- **Testable** - Focused components are easy to test

## References

- See biaxis-web `src/packages/` for working examples
- See biaxis-web `src/app/` for thin wrapper pattern
- See ADR 001 for utility organization
