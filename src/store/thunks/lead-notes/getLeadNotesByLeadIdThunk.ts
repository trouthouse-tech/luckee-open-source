import type { AppThunk } from '../../store';
import { getLeadNotesByLeadId } from '@/src/api/lead-notes';
import { LeadNotesActions } from '../../dumps/leadNotes';

type ResponseType = Promise<200 | 400 | 500>;

export const getLeadNotesByLeadIdThunk = (
  leadId: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getLeadNotesByLeadId(leadId);
      if (!response.success || !response.data) {
        console.error('Failed to get lead notes:', response.error);
        return 400;
      }
      dispatch(LeadNotesActions.addLeadNotes(response.data));
      return 200;
    } catch (error) {
      console.error('Error getting lead notes:', error);
      return 500;
    }
  };
};
