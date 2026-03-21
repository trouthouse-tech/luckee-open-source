import type { AppThunk } from '@/src/store';
import { processNextQueueItem } from '@/src/api/lead-contact-email-queue';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Process the next item in the email queue (force send).
 * Backend may not implement this; non-2xx is handled by the UI.
 */
export const processEmailQueueThunk = (): AppThunk<ResponseType> => {
  return async (): ResponseType => {
    try {
      const response = await processNextQueueItem();

      if (response.success) return 200;
      return response.error?.includes('404') || response.error?.includes('501')
        ? 400
        : 500;
    } catch (error: unknown) {
      console.error('❌ processEmailQueueThunk error:', error);
      return 500;
    }
  };
};
