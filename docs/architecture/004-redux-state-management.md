# ADR 004: Redux State Management

**Status:** Accepted  
**Date:** 2026-01-01  
**Context:** Establishing Redux patterns for scalable state management

## Decision

Use Redux Toolkit with a structured approach: typed hooks, manual thunks (no `createAsyncThunk`), and organized slices by purpose (dumps, current, builders, config).

## Rationale

### The Problem

Without clear Redux organization:
- **State scattered** - No clear pattern for where state lives
- **Inconsistent patterns** - Mix of approaches across features
- **Type safety issues** - Untyped selectors and dispatch
- **Hard to scale** - Unclear where new state should go

### The Solution

A structured Redux architecture with clear patterns for different types of state.

## Redux Store Structure

```
src/store/
├── store.ts              # Store configuration
├── reducer.ts            # Root reducer (combineReducers)
├── types.ts              # RootState, AppDispatch, AppThunk
├── hooks.ts              # Typed useAppDispatch, useAppSelector
├── index.ts              # Barrel export
├── dumps/                # Collections (normalized state)
│   ├── videos.ts
│   ├── users.ts
│   └── index.ts
├── current/              # Single entity state
│   ├── currentVideo.ts
│   ├── currentUser.ts
│   └── index.ts
├── builders/             # UI state (modals, loading, etc.)
│   ├── recorderBuilder.ts
│   ├── playerBuilder.ts
│   └── index.ts
├── config/               # App configuration
│   ├── environment.ts
│   ├── auth.ts
│   └── index.ts
└── thunks/               # Async actions by domain
    ├── videos/
    │   ├── uploadVideoThunk.ts
    │   ├── deleteVideoThunk.ts
    │   └── index.ts
    └── auth/
        ├── loginThunk.ts
        └── index.ts
```

## Root Files

### store.ts

Configure the Redux store:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // For Blob, File, etc.
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### types.ts

Type definitions for the store:

```typescript
import { ThunkAction, Action as ReduxAction } from '@reduxjs/toolkit';
import { store } from './store';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<R> = ThunkAction<R, RootState, unknown, ReduxAction<string>>;
```

**Note:** `AppThunk<R>` is the return type for thunks. Use it like:
```typescript
export const myThunk = (): AppThunk<Promise<200 | 400>> => {
  return async (dispatch, getState) => {
    // ...
  };
};
```

### hooks.ts

Typed Redux hooks:

```typescript
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './types';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

### reducer.ts

Combine all slices:

```typescript
import { combineReducers } from '@reduxjs/toolkit';

// Import slices
import { videos } from './dumps';
import currentVideo from './current/currentVideo';
import recorderBuilder from './builders/recorderBuilder';
import { environment } from './config';

const rootReducer = combineReducers({
  // Dumps
  videos,
  
  // Current
  currentVideo,
  
  // Builders
  recorderBuilder,
  
  // Config
  environment,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
```

### index.ts

Barrel export:

```typescript
export { store } from './store';
export { useAppDispatch, useAppSelector } from './hooks';
export type { RootState, AppDispatch, AppThunk } from './types';
export * from './config';
```

## Slice Types

### 1. Dumps Slices (`dumps/`)

**Purpose:** Normalized collections of entities with ID-based keys.

**Characteristics:**
- Object state: `{ [key: string]: Entity }`
- Used for storing multiple entities
- Efficient lookups by ID
- CRUD operations

**Example:**

```typescript
// dumps/videos.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Video } from '../../model';

type InitialState = {
  [key: string]: Video;
};

const initialState: InitialState = {};

export const videosSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    addVideos: (state, action: PayloadAction<Video[]>) => {
      action.payload.forEach(video => {
        state[video.id] = video;
      });
    },
    updateVideo: (state, action: PayloadAction<Video>) => {
      state[action.payload.id] = action.payload;
    },
    deleteVideo: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    reset: () => initialState,
  },
});

export const VideosActions = videosSlice.actions;
export default videosSlice.reducer;
```

```typescript
// dumps/index.ts
export { default as videos } from './videos';
export { VideosActions } from './videos';
```

**Usage:**
```typescript
// ✅ GOOD: Always use useMemo for derived state
const videos = useAppSelector(state => state.videos);

const videoList = useMemo(() => {
  return Object.values(videos);
}, [videos]);

const specificVideo = useMemo(() => {
  return videos['video-id-123'];
}, [videos]);
```

```typescript
// ❌ BAD: Don't access state directly without useMemo
const videos = useAppSelector(state => state.videos);
const videoList = Object.values(videos); // Missing useMemo
const specificVideo = videos['video-id-123']; // Missing useMemo
```

### 2. Current Slices (`current/`)

**Purpose:** Single entity state for currently selected/edited item.

**Characteristics:**
- Single entity (not array or object)
- Used for forms, detail views, editing
- Always has `reset` action
- Often has individual field setters

**Example:**

```typescript
// current/currentVideo.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Video } from '../../model';

const initialState: Video = {
  id: '',
  title: '',
  description: '',
  url: '',
  shareToken: '',
  createdAt: '',
};

export const currentVideoSlice = createSlice({
  name: 'currentVideo',
  initialState,
  reducers: {
    setCurrentVideo: (_state, action: PayloadAction<Video>) => action.payload,
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    reset: () => initialState,
  },
});

export const CurrentVideoActions = currentVideoSlice.actions;
export default currentVideoSlice.reducer;
```

**Usage:**
```typescript
const currentVideo = useAppSelector(state => state.currentVideo);
dispatch(CurrentVideoActions.setTitle('New Title'));
dispatch(CurrentVideoActions.reset()); // Clear form
```

### 3. Builders Slices (`builders/`)

**Purpose:** UI state and construction/building workflows.

**Characteristics:**
- Primitives only (strings, numbers, booleans, null)
- Modal states, loading flags, progress
- Step/workflow state
- No complex objects

**Example:**

```typescript
// builders/recorderBuilder.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type RecorderBuilderState = {
  isRecording: boolean;
  isPaused: boolean;
  recordingDuration: number;
  recordingError: string | null;
  isUploading: boolean;
  uploadProgress: number;
  shareToken: string | null;
};

const initialState: RecorderBuilderState = {
  isRecording: false,
  isPaused: false,
  recordingDuration: 0,
  recordingError: null,
  isUploading: false,
  uploadProgress: 0,
  shareToken: null,
};

const recorderBuilderSlice = createSlice({
  name: 'recorderBuilder',
  initialState,
  reducers: {
    startRecording: (state) => {
      state.isRecording = true;
      state.isPaused = false;
      state.recordingDuration = 0;
      state.recordingError = null;
    },
    stopRecording: (state) => {
      state.isRecording = false;
      state.isPaused = false;
    },
    setRecordingError: (state, action: PayloadAction<string | null>) => {
      state.recordingError = action.payload;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    reset: () => initialState,
  },
});

export const RecorderBuilderActions = recorderBuilderSlice.actions;
export default recorderBuilderSlice.reducer;
```

**Usage:**
```typescript
const { isRecording, uploadProgress } = useAppSelector(state => state.recorderBuilder);
dispatch(RecorderBuilderActions.startRecording());
```

### 4. Config Slices (`config/`)

**Purpose:** Application configuration and settings.

**Characteristics:**
- App-wide settings
- Environment variables
- Feature flags
- Auth state

**Example:**

```typescript
// config/environment.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type EnvironmentState = {
  apiBaseUrl: string;
  supabaseUrl: string;
};

const initialState: EnvironmentState = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
};

const environmentSlice = createSlice({
  name: 'environment',
  initialState,
  reducers: {
    setApiBaseUrl: (state, action: PayloadAction<string>) => {
      state.apiBaseUrl = action.payload;
    },
  },
});

export const EnvironmentActions = environmentSlice.actions;
export default environmentSlice.reducer;
```

## Thunks

**Purpose:** Async actions that can dispatch multiple actions and access state.

**Important:** Use manual thunks with `AppThunk`, NOT `createAsyncThunk`.

### Thunk Pattern

```typescript
// thunks/videos/uploadVideoThunk.ts
import { AppThunk } from '../../types';
import { RecorderBuilderActions } from '../../builders/recorderBuilder';
import { VideosActions } from '../../dumps/videos';
import { uploadVideo } from '../../../api/videos';

type ResponseType = Promise<200 | 400 | 500>;

export const uploadVideoThunk = (
  videoBlob: Blob,
  title: string,
  description: string
): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    try {
      dispatch(RecorderBuilderActions.setIsUploading(true));
      
      const response = await uploadVideo(videoBlob, title, description, {
        onProgress: (progress) => {
          dispatch(RecorderBuilderActions.setUploadProgress(progress));
        },
      });
      
      if (response.success) {
        dispatch(VideosActions.addVideo(response.video));
        dispatch(RecorderBuilderActions.setShareToken(response.video.shareToken));
        dispatch(RecorderBuilderActions.setIsUploading(false));
        return 200;
      }
      
      dispatch(RecorderBuilderActions.setIsUploading(false));
      return 400;
    } catch (error) {
      console.error('Upload failed:', error);
      dispatch(RecorderBuilderActions.setIsUploading(false));
      return 500;
    }
  };
};
```

### Thunk Organization

```
thunks/
├── videos/
│   ├── uploadVideoThunk.ts
│   ├── deleteVideoThunk.ts
│   ├── getAllVideosThunk.ts
│   └── index.ts
├── auth/
│   ├── loginThunk.ts
│   ├── logoutThunk.ts
│   └── index.ts
└── index.ts
```

### Thunk Best Practices

1. **Return status codes:** `200` (success), `400` (client error), `500` (server error)
2. **Type the return:** `AppThunk<Promise<200 | 400 | 500>>`
3. **Dispatch actions:** Update state through slice actions
4. **Handle errors:** Always catch and return error codes
5. **Access state:** Use `getState()` when needed

## Usage in Components

### Basic Pattern

```typescript
import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RecorderBuilderActions } from '@/store/builders/recorderBuilder';
import { uploadVideoThunk } from '@/store/thunks/videos';

export default function RecorderPage() {
  const dispatch = useAppDispatch();
  const { isRecording, uploadProgress } = useAppSelector(
    state => state.recorderBuilder
  );
  
  // ✅ GOOD: Use useMemo for derived state from dumps
  const videos = useAppSelector(state => state.videos);
  const videoList = useMemo(() => Object.values(videos), [videos]);
  
  const handleUpload = async () => {
    const result = await dispatch(uploadVideoThunk(blob, title, description));
    if (result === 200) {
      // Success
    } else {
      // Error handling
    }
  };
  
  return <div>{/* ... */}</div>;
}
```

### Selecting from Dumps

**Always use `useMemo` for derived state from dumps:**

```typescript
// ✅ GOOD: Get all videos as array with useMemo
const videos = useAppSelector(state => state.videos);
const videoList = useMemo(() => Object.values(videos), [videos]);

// ✅ GOOD: Get specific video by ID with useMemo
const videoId = 'abc123';
const videos = useAppSelector(state => state.videos);
const video = useMemo(() => videos[videoId], [videos, videoId]);

// ✅ GOOD: Filtered selection with useMemo
const videos = useAppSelector(state => state.videos);
const activeVideos = useMemo(() => 
  Object.values(videos).filter(v => v.status === 'active'),
  [videos]
);
```

```typescript
// ❌ BAD: Accessing state without useMemo
const videos = useAppSelector(state => Object.values(state.videos)); // Wrong
const video = useAppSelector(state => state.videos[videoId]); // Wrong
```

**Why useMemo?** Prevents unnecessary re-renders and re-calculations. Object transformations (like `Object.values()`) create new array references on every render without memoization.

## Action Naming Conventions

### Dumps Actions
- `addXs` - Add array of entities (e.g., `addVideos`)
- `updateX` - Update single entity
- `deleteX` - Delete single entity
- `reset` - Clear to initial state

**Note:** No `setX` action - use `addXs` with an array to avoid reference issues.

### Current Actions
- `setCurrentX` - Set entire entity
- `setFieldName` - Set specific field
- `reset` - Clear to initial state

### Builder Actions
- `setX` - Set primitive value
- `openModal` / `closeModal` - Modal states
- `reset` - Clear to initial state

## Red Flags

- 🚩 Using `createAsyncThunk` (use manual thunks with `AppThunk`)
- 🚩 Complex objects in builders (should be primitives only)
- 🚩 Array state in dumps (should be object with ID keys)
- 🚩 Using `setX` in dumps (use `addXs` with array instead)
- 🚩 Accessing dump state without `useMemo` (e.g., `Object.values(videos)`)
- 🚩 Direct property access without `useMemo` (e.g., `videos[id]`)
- 🚩 Not exporting Actions from slices
- 🚩 Untyped `useDispatch` or `useSelector`
- 🚩 Thunks not returning status codes

## Benefits

- **Type safety** - Typed hooks catch errors at compile time
- **Organized** - Clear structure for where state lives
- **Scalable** - Easy to add new slices following patterns
- **Performant** - Normalized state for efficient lookups
- **Maintainable** - Consistent patterns across codebase
- **Testable** - Pure reducers and typed thunks

## References

- See biaxis-web `src/store/` for working examples
- See biaxis-web `src/store/REDUX_STORE_README.md` for detailed documentation
- Redux Toolkit docs: https://redux-toolkit.js.org/

