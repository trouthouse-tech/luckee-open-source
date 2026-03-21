import type { AppThunk } from '../../store';
import { createLeadNote } from '@/src/api/lead-notes';
import { LeadNotesActions } from '../../dumps/leadNotes';

type ResponseType = Promise<200 | 400 | 500>;

export const createLeadNoteThunk = (
  leadId: string,
  content: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await createLeadNote({
        lead_id: leadId,
        content: content.trim(),
      });
      if (!response.success || !response.data) {
        console.error('Failed to create lead note:', response.error);
        return 400;
      }
      dispatch(LeadNotesActions.addLeadNotes([response.data]));
      return 200;
    } catch (error) {
      console.error('Error creating lead note:', error);
      return 500;
    }
  };
};
