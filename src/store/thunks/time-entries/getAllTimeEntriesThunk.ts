import type { AppThunk } from '../../store';
import { getAllTimeEntries } from '@/src/api/time-entries';
import { TimeEntriesActions } from '../../dumps/timeEntries';
import { TimeEntryBuilderActions } from '../../builders/timeEntryBuilder';

type ResponseType = Promise<200 | 400 | 500>;

export const getAllTimeEntriesThunk = (
  userId: string,
  startDate: string,
  endDate: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      dispatch(TimeEntryBuilderActions.setIsLoading(true));
      dispatch(TimeEntryBuilderActions.setErrorMessage(null));

      const response = await getAllTimeEntries(userId, startDate, endDate);

      if (response.success && response.data) {
        dispatch(TimeEntriesActions.setTimeEntries(response.data));
        dispatch(TimeEntryBuilderActions.setIsLoading(false));
        return 200;
      }

      if (
        response.error?.includes('not available yet') ||
        response.error?.includes('not found')
      ) {
        dispatch(TimeEntriesActions.setTimeEntries([]));
        dispatch(TimeEntryBuilderActions.setIsLoading(false));
        return 200;
      }

      dispatch(
        TimeEntryBuilderActions.setErrorMessage(
          response.error || 'Failed to get time entries'
        )
      );
      dispatch(TimeEntryBuilderActions.setIsLoading(false));
      return 400;
    } catch (error: unknown) {
      console.error('❌ getAllTimeEntriesThunk error:', error);
      dispatch(
        TimeEntryBuilderActions.setErrorMessage(
          error instanceof Error ? error.message : 'Unknown error'
        )
      );
      dispatch(TimeEntryBuilderActions.setIsLoading(false));
      return 500;
    }
  };
};
