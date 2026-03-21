import { API_CONFIG } from '@/src/config/api';
import type { ApiResponse } from '../types';

type ProcessNextResult = {
  success: boolean;
  processed?: number;
  successful?: number;
  failed?: number;
  errors?: string[];
};

export const processNextQueueItem = async (): Promise<
  ApiResponse<ProcessNextResult>
> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/lead-contact-email-queue/process-next`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }
    );

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || `HTTP ${response.status}`,
      };
    }

    return { success: true, data: data };
  } catch (error: unknown) {
    console.error('❌ processNextQueueItem error:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to process next queue item',
    };
  }
};
