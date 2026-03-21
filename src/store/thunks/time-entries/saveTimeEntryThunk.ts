import type { AppThunk } from '../../store';
import { createTimeEntry } from '@/src/api/time-entries';
import { updateTimeEntry } from '@/src/api/time-entries';
import type { TimeEntry } from '@/src/model';
import { TimeEntriesActions } from '../../dumps/timeEntries';
import { CurrentTimeEntryActions } from '../../current/currentTimeEntry';
import { TimeEntryBuilderActions } from '../../builders/timeEntryBuilder';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Create or update time entry based on currentTimeEntry.id
 */
export const saveTimeEntryThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const state = getState();
    const current = state.currentTimeEntry;
    const userId = state.auth.user?.id;

    if (!userId) {
      dispatch(
        TimeEntryBuilderActions.setErrorMessage('You must be logged in to save a time entry')
      );
      return 400;
    }

    if (!current?.project_id) {
      dispatch(TimeEntryBuilderActions.setErrorMessage('Project is required'));
      return 400;
    }

    if (!current?.date) {
      dispatch(TimeEntryBuilderActions.setErrorMessage('Date is required'));
      return 400;
    }

    const timeMs = typeof current.time === 'number' ? current.time : 0;
    if (timeMs < 1) {
      dispatch(TimeEntryBuilderActions.setErrorMessage('Time must be at least 1 minute'));
      return 400;
    }

    const description = (current.description ?? '').replace(/<[^>]*>/g, '').trim();
    if (description.length < 10) {
      dispatch(
        TimeEntryBuilderActions.setErrorMessage('Description must be at least 10 characters')
      );
      return 400;
    }

    try {
      dispatch(TimeEntryBuilderActions.setIsSaving(true));
      dispatch(TimeEntryBuilderActions.setErrorMessage(null));

      if (current.id) {
        const response = await updateTimeEntry(current.id, {
          project_id: current.project_id,
          date: current.date,
          time: timeMs,
          title: current.title ?? '',
          description: current.description ?? '',
        });
        if (response.success && response.data) {
          dispatch(TimeEntriesActions.updateTimeEntry(response.data));
          dispatch(CurrentTimeEntryActions.setCurrentTimeEntry(response.data));
          dispatch(TimeEntryBuilderActions.setIsSaving(false));
          dispatch(TimeEntryBuilderActions.closeCreateModal());
          dispatch(TimeEntryBuilderActions.closeEditModal());
          return 200;
        }
        dispatch(
          TimeEntryBuilderActions.setErrorMessage(
            response.error || 'Failed to update time entry'
          )
        );
      } else {
        const response = await createTimeEntry({
          user_id: userId,
          project_id: current.project_id,
          customer_id: current.customer_id ?? null,
          date: current.date,
          time: timeMs,
          title: current.title ?? '',
          description: current.description ?? '',
        });
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
      }
      dispatch(TimeEntryBuilderActions.setIsSaving(false));
      return 400;
    } catch (error: unknown) {
      console.error('❌ saveTimeEntryThunk error:', error);
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
