import type { AppThunk } from '../../store';
import { createTimeEntry } from '@/src/api/time-entries';
import type { TimeEntry } from '@/src/model';
import { TimeEntriesActions } from '../../dumps/timeEntries';
import { CurrentTimeEntryActions } from '../../current/currentTimeEntry';
import { TimeEntryBuilderActions } from '../../builders/timeEntryBuilder';

type ResponseType = Promise<200 | 400 | 500>;

export const createTimeEntryThunk = (
  payload: Omit<TimeEntry, 'id' | 'created_at' | 'updated_at'>
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      dispatch(TimeEntryBuilderActions.setIsSaving(true));
      dispatch(TimeEntryBuilderActions.setErrorMessage(null));

      const response = await createTimeEntry(payload);

      if (response.success && response.data) {
        dispatch(TimeEntriesActions.addTimeEntry(response.data));
        dispatch(CurrentTimeEntryActions.setCurrentTimeEntry(response.data));
        dispatch(TimeEntryBuilderActions.setIsSaving(false));
        dispatch(TimeEntryBuilderActions.closeCreateModal());
        return 200;
      }

      dispatch(
        TimeEntryBuilderActions.setErrorMessage(
          response.error || 'Failed to create time entry'
        )
      );
      dispatch(TimeEntryBuilderActions.setIsSaving(false));
      return 400;
    } catch (error: unknown) {
      console.error('❌ createTimeEntryThunk error:', error);
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
