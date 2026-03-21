import type { AppThunk } from '../../store';
import { deleteLeadNote } from '@/src/api/lead-notes';
import { LeadNotesActions } from '../../dumps/leadNotes';

type ResponseType = Promise<200 | 400 | 500>;

export const deleteLeadNoteThunk = (
  noteId: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await deleteLeadNote(noteId);
      if (!response.success) {
        console.error('Failed to delete lead note:', response.error);
        return 400;
      }
      dispatch(LeadNotesActions.removeLeadNote(noteId));
      return 200;
    } catch (error) {
      console.error('Error deleting lead note:', error);
      return 500;
    }
  };
};
