import type { AppThunk } from '../../store';
import { updateTimeEntry } from '@/src/api/time-entries';
import type { TimeEntry } from '@/src/model';
import { TimeEntriesActions } from '../../dumps/timeEntries';
import { CurrentTimeEntryActions } from '../../current/currentTimeEntry';
import { TimeEntryBuilderActions } from '../../builders/timeEntryBuilder';

type ResponseType = Promise<200 | 400 | 500>;

export const updateTimeEntryThunk = (
  timeEntryId: string,
  updates: Partial<Pick<TimeEntry, 'project_id' | 'date' | 'time' | 'title' | 'description'>>
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      dispatch(TimeEntryBuilderActions.setIsSaving(true));
      dispatch(TimeEntryBuilderActions.setErrorMessage(null));

      const response = await updateTimeEntry(timeEntryId, updates);

      if (response.success && response.data) {
        dispatch(TimeEntriesActions.updateTimeEntry(response.data));
        dispatch(CurrentTimeEntryActions.setCurrentTimeEntry(response.data));
        dispatch(TimeEntryBuilderActions.setIsSaving(false));
        dispatch(TimeEntryBuilderActions.closeEditModal());
        return 200;
      }

      dispatch(
        TimeEntryBuilderActions.setErrorMessage(
          response.error || 'Failed to update time entry'
        )
      );
      dispatch(TimeEntryBuilderActions.setIsSaving(false));
      return 400;
    } catch (error: unknown) {
      console.error('❌ updateTimeEntryThunk error:', error);
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
