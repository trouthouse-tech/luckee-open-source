import type { AppThunk } from '@/src/store';
import { LeadContactEmailQueueActions } from '../../dumps/leadContactEmailQueue';
import { getAllQueueItems } from '@/src/api/lead-contact-email-queue';

type ResponseType = Promise<200 | 400 | 500>;

export const getAllLeadContactEmailQueueThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getAllQueueItems();

      if (response.success && response.data) {
        dispatch(LeadContactEmailQueueActions.addQueueItems(response.data));
        return 200;
      }

      if (
        response.error?.includes('not found') ||
        response.error?.includes('Invalid response')
      ) {
        dispatch(LeadContactEmailQueueActions.addQueueItems([]));
        return 200;
      }

      return 400;
    } catch (error: unknown) {
      console.error('❌ getAllLeadContactEmailQueueThunk error:', error);
      return 500;
    }
  };
};
