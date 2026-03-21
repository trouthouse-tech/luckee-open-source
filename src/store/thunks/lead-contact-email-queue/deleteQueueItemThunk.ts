import type { AppThunk } from '@/src/store';
import { LeadContactEmailQueueActions } from '../../dumps/leadContactEmailQueue';
import { deleteQueueItem } from '@/src/api/lead-contact-email-queue';

type ResponseType = Promise<200 | 400 | 500>;

export const deleteQueueItemThunk = (itemId: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await deleteQueueItem(itemId);

      if (!response.success) {
        console.error('Failed to delete queue item:', response.error);
        return 400;
      }

      dispatch(LeadContactEmailQueueActions.removeQueueItem(itemId));
      return 200;
    } catch (error: unknown) {
      console.error('❌ deleteQueueItemThunk error:', error);
      return 500;
    }
  };
};
