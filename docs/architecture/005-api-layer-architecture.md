# ADR 005: API Layer Architecture

**Status:** Accepted  
**Date:** 2026-01-01  
**Context:** Establishing patterns for frontend API functions and backend service organization

## Decision

Frontend API functions call backend endpoints using a standardized `ApiResponse<T>` wrapper. Backend services are organized by domain with Express routers handling HTTP layer.

## Rationale

### The Problem

Without clear API/service organization:
- **Inconsistent responses** - Different return formats across endpoints
- **Poor error handling** - Unclear how to handle failures
- **Scattered logic** - API calls mixed with component code
- **Hard to maintain** - No clear pattern for adding new endpoints

### The Solution

A layered approach with clear separation between frontend API functions and backend services.

## Frontend API Layer

### Structure

```
src/api/
├── types.ts                  # Shared ApiResponse<T> type
└── {domain}/                 # e.g., videos, users, templates
    ├── getAllVideos.ts
    ├── getVideoById.ts
    ├── createVideo.ts
    ├── updateVideo.ts
    ├── deleteVideo.ts
    ├── types.ts              # Domain-specific request/response types
    └── index.ts              # Barrel export
```

### Core Type: ApiResponse

```typescript
// api/types.ts
/**
 * Shared API Types
 * Common types used across all API functions
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Re-export model types for convenience
export type { Video } from '../model/video';
export type { User } from '../model/user';
```

### API Function Pattern

Each API function:
1. Takes `apiBaseUrl` as first parameter
2. Takes request data as subsequent parameters
3. Returns `Promise<ApiResponse<T>>`
4. Handles errors gracefully
5. Has JSDoc comments

**Example: GET request**

```typescript
// api/videos/getAllVideos.ts
/**
 * Get All Videos API
 * Fetches all videos for the current user
 */

import { ApiResponse, Video } from '../types';

/**
 * Gets all videos
 * @param apiBaseUrl - Base URL for the API
 * @param limit - Optional limit for number of videos
 * @returns Promise that resolves to API response with videos array
 */
export const getAllVideos = async (
  apiBaseUrl: string,
  limit?: number
): Promise<ApiResponse<Video[]>> => {
  try {
    const url = limit 
      ? `${apiBaseUrl}/api/videos?limit=${limit}`
      : `${apiBaseUrl}/api/videos`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const videos = data.videos || data.data || [];

    return {
      success: true,
      data: videos
    };

  } catch (error) {
    console.error('❌ [getAllVideos] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
```

**Example: POST request**

```typescript
// api/videos/createVideo.ts
/**
 * Create Video API
 * Creates a new video record
 */

import { ApiResponse, Video } from '../types';
import { CreateVideoData } from './types';

/**
 * Creates a new video
 * @param apiBaseUrl - Base URL for the API
 * @param videoData - Video creation data
 * @returns Promise that resolves to API response with created video
 */
export const createVideo = async (
  apiBaseUrl: string,
  videoData: CreateVideoData
): Promise<ApiResponse<Video>> => {
  try {
    const url = `${apiBaseUrl}/api/videos`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(videoData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success && data.video) {
      return {
        success: true,
        data: data.video
      };
    } else {
      return {
        success: false,
        error: data.error || 'Failed to create video'
      };
    }

  } catch (error) {
    console.error('❌ [createVideo] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
```

**Example: Upload with progress**

```typescript
// api/videos/uploadVideo.ts
import { ApiResponse, Video } from '../types';

type UploadOptions = {
  onProgress?: (progress: number) => void;
};

/**
 * Uploads a video file
 * @param apiBaseUrl - Base URL for the API
 * @param videoBlob - Video file blob
 * @param title - Video title
 * @param description - Video description
 * @param options - Upload options (progress callback)
 * @returns Promise that resolves to API response with uploaded video
 */
export const uploadVideo = async (
  apiBaseUrl: string,
  videoBlob: Blob,
  title: string,
  description: string,
  options?: UploadOptions
): Promise<ApiResponse<Video>> => {
  try {
    const formData = new FormData();
    formData.append('video', videoBlob);
    formData.append('title', title);
    formData.append('description', description);

    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && options?.onProgress) {
          const progress = (e.loaded / e.total) * 100;
          options.onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          resolve({
            success: true,
            data: data.video
          });
        } else {
          resolve({
            success: false,
            error: `Upload failed with status ${xhr.status}`
          });
        }
      });

      xhr.addEventListener('error', () => {
        resolve({
          success: false,
          error: 'Upload failed'
        });
      });

      xhr.open('POST', `${apiBaseUrl}/api/videos/upload`);
      xhr.send(formData);
    });

  } catch (error) {
    console.error('❌ [uploadVideo] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
};
```

### Domain Types

```typescript
// api/videos/types.ts
/**
 * Video API Types
 * Request and response types for video-related API calls
 */

export type CreateVideoData = {
  title: string;
  description: string;
  url: string;
  shareToken: string;
  duration?: number;
};

export type UpdateVideoData = Partial<CreateVideoData>;
```

### Barrel Export

```typescript
// api/videos/index.ts
/**
 * Videos API Index
 * Exports all video-related API functions and types
 */

export * from './types';
export * from './getAllVideos';
export * from './getVideoById';
export * from './createVideo';
export * from './updateVideo';
export * from './deleteVideo';
export * from './uploadVideo';
```

## Backend Service Layer (Optional Reference)

### Structure

```
server/src/data/
└── {domain}/                 # e.g., videos
    ├── get-all.ts
    ├── get-by-id.ts
    ├── create.ts
    ├── update.ts
    ├── delete.ts
    ├── upload.ts
    ├── router.ts             # Express routes
    ├── types.ts              # Backend types
    └── index.ts              # Barrel export
```

### Service Function Pattern

```typescript
// data/videos/get-all.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { Video } from './types';

/**
 * Gets all videos, optionally filtered
 * @param supabase - Supabase client
 * @param limit - Optional result limit
 * @returns Promise that resolves to array of videos
 */
export const getAllVideos = async (
  supabase: SupabaseClient,
  limit?: number
): Promise<Video[]> => {
  try {
    let query = supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data: videos, error } = await query;

    if (error) {
      throw error;
    }

    return videos || [];

  } catch (error) {
    console.error('❌ Error getting all videos:', error);
    return [];
  }
};
```

### Router Pattern

```typescript
// data/videos/router.ts
import { Router, Request, Response } from 'express';
import { getSupabaseClient } from '../../services/supabase';
import { getAllVideos, getVideoById, createVideo } from './index';

const router = Router();

/**
 * GET /api/videos
 * Retrieves all videos, optionally with limit
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

    const supabase = getSupabaseClient();
    const videos = await getAllVideos(supabase, limit);

    res.status(200).json({
      success: true,
      videos,
      data: videos, // Include 'data' for consistency
      count: videos.length
    });

  } catch (error) {
    console.error('Error in GET /api/videos:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

/**
 * GET /api/videos/:id
 * Retrieves a specific video by ID
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const videoId = req.params.id;

    if (!videoId) {
      res.status(400).json({
        success: false,
        error: 'Video ID is required'
      });
      return;
    }

    const supabase = getSupabaseClient();
    const video = await getVideoById(supabase, videoId);

    if (!video) {
      res.status(404).json({
        success: false,
        error: 'Video not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      video
    });

  } catch (error) {
    console.error('Error in GET /api/videos/:id:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

export default router;
```

## Usage in Thunks

API functions are called from Redux thunks:

```typescript
// store/thunks/videos/getAllVideosThunk.ts
import { AppThunk } from '../../types';
import { VideosActions } from '../../dumps/videos';
import { getAllVideos } from '../../../api/videos';

type ResponseType = Promise<200 | 400 | 500>;

export const getAllVideosThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    try {
      const { apiBaseUrl } = getState().environment;
      
      const result = await getAllVideos(apiBaseUrl);
      
      if (result.success && result.data) {
        dispatch(VideosActions.addVideos(result.data));
        return 200;
      }
      
      console.error('Failed to fetch videos:', result.error);
      return 400;
      
    } catch (error) {
      console.error('Error in getAllVideosThunk:', error);
      return 500;
    }
  };
};
```

## Error Handling Patterns

### Frontend API Functions

Always return `ApiResponse<T>` even on error:

```typescript
try {
  // ... API call
  return {
    success: true,
    data: result
  };
} catch (error) {
  console.error('❌ [functionName] Error:', error);
  return {
    success: false,
    error: error instanceof Error ? error.message : 'Unknown error occurred'
  };
}
```

### Thunks

Check `success` field and handle appropriately:

```typescript
const result = await apiFunction(apiBaseUrl, params);

if (result.success && result.data) {
  // Handle success
  dispatch(someAction(result.data));
  return 200;
}

// Handle error
console.error('API call failed:', result.error);
return 400;
```

## File Naming Conventions

### Frontend API Functions

- `getAllX.ts` - Get collection
- `getXById.ts` - Get single item
- `createX.ts` - Create new item
- `updateX.ts` - Update existing item
- `deleteX.ts` - Delete item
- `uploadX.ts` - Upload files
- `types.ts` - Domain types
- `index.ts` - Barrel export

### Backend Service Functions

- `get-all.ts` - Get collection
- `get-by-id.ts` - Get single item
- `create.ts` - Create new item
- `update.ts` - Update existing item
- `delete.ts` - Delete item
- `router.ts` - Express router
- `types.ts` - Backend types
- `index.ts` - Barrel export

## Best Practices

### 1. Always Use apiBaseUrl

```typescript
// ✅ GOOD: Get from parameter
export const getVideos = async (apiBaseUrl: string) => {
  const url = `${apiBaseUrl}/api/videos`;
};

// ❌ BAD: Hardcoded URL
const url = 'http://localhost:3001/api/videos';
```

### 2. Consistent Error Logging

```typescript
// ✅ GOOD: Emoji prefix + function name in brackets
console.error('❌ [getAllVideos] Error:', error);

// ❌ BAD: Generic message
console.error('Error:', error);
```

### 3. Handle Both Response Formats

```typescript
// Backend might return data in different keys
const videos = data.videos || data.data || [];
```

### 4. Type Everything

```typescript
// ✅ GOOD: Fully typed
export const createVideo = async (
  apiBaseUrl: string,
  videoData: CreateVideoData
): Promise<ApiResponse<Video>> => {
  // ...
};

// ❌ BAD: Untyped
export const createVideo = async (apiBaseUrl, videoData) => {
  // ...
};
```

### 5. One Function Per File

```typescript
// ✅ GOOD: Single focused function
// api/videos/getAllVideos.ts
export const getAllVideos = async (...) => { };

// ❌ BAD: Multiple functions in one file
export const getAllVideos = async (...) => { };
export const getVideoById = async (...) => { };
```

## Red Flags

- 🚩 API calls directly in components (should be in thunks)
- 🚩 Inconsistent return types (always use `ApiResponse<T>`)
- 🚩 Hardcoded API URLs (use `apiBaseUrl` parameter)
- 🚩 Missing error handling (always try/catch)
- 🚩 No JSDoc comments on API functions
- 🚩 Not checking `response.ok` after fetch
- 🚩 Multiple functions in one file

## Benefits

- **Type safety** - Compile-time error catching
- **Consistent** - Same pattern across all API calls
- **Maintainable** - Easy to add new endpoints
- **Testable** - Pure functions with clear inputs/outputs
- **Discoverable** - Clear structure makes finding API functions easy
- **Error handling** - Standardized error responses

## References

- See biaxis-web `src/api/` for frontend examples
- See falcon-burgers-bi `src/data/` for backend examples

