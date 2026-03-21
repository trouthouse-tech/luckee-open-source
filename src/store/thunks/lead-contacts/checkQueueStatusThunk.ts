import type { AppThunk } from '@/src/store';
import { LeadContactBuilderActions } from '../../builders';
import { getAllQueueItems } from '@/src/api/lead-contact-email-queue';

type ResponseType = Promise<200 | 400 | 500>;

export const checkQueueStatusThunk = (
  contactId: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getAllQueueItems({
        lead_contact_id: contactId,
      });
      if (response.success && response.data) {
        const activeItem = response.data.find(
          (item) => item.status === 'queued' || item.status === 'sending'
        );
        dispatch(
          LeadContactBuilderActions.setQueueStatus(
            activeItem
              ? { status: activeItem.status, id: activeItem.id }
              : null
          )
        );
        return 200;
      }
      return 400;
    } catch (error) {
      console.error('Failed to check queue status:', error);
      return 500;
    }
  };
};
