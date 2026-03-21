import type { AppThunk } from '../../store';
import { deleteTimeEntry } from '@/src/api/time-entries';
import { TimeEntriesActions } from '../../dumps/timeEntries';
import { CurrentTimeEntryActions } from '../../current/currentTimeEntry';
import { TimeEntryBuilderActions } from '../../builders/timeEntryBuilder';

type ResponseType = Promise<200 | 400 | 500>;

export const deleteTimeEntryThunk = (
  timeEntryId: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      dispatch(TimeEntryBuilderActions.setIsSaving(true));
      dispatch(TimeEntryBuilderActions.setErrorMessage(null));

      const response = await deleteTimeEntry(timeEntryId);

      if (response.success) {
        dispatch(TimeEntriesActions.deleteTimeEntry(timeEntryId));
        dispatch(CurrentTimeEntryActions.reset());
        dispatch(TimeEntryBuilderActions.setIsSaving(false));
        return 200;
      }

      dispatch(
        TimeEntryBuilderActions.setErrorMessage(
          response.error || 'Failed to delete time entry'
        )
      );
      dispatch(TimeEntryBuilderActions.setIsSaving(false));
      return 400;
    } catch (error: unknown) {
      console.error('❌ deleteTimeEntryThunk error:', error);
      dispatch(
        TimeEntryBuilderActions.setErrorMessage(
          error instanceof Error ? error.message : 'Unknown error'
        )
      );
      dispatch(TimeEntryBuilderActions.setIsSaving(false));
      return 500;
    }
  };
};
