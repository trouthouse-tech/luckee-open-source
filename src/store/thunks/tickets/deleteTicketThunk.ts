import type { AppThunk } from '../../store';
import { deleteTicket } from '@/src/api';
import { TicketsActions } from '../../dumps/tickets';
import { CurrentTicketActions } from '../../current/currentTicket';
import { TicketBuilderActions } from '../../builders/ticketBuilder';

type ResponseType = Promise<200 | 400 | 500>;

export const deleteTicketThunk = (ticketId: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      dispatch(TicketBuilderActions.setIsSaving(true));
      dispatch(TicketBuilderActions.setErrorMessage(null));

      const response = await deleteTicket(ticketId);

      if (response.success) {
        dispatch(TicketsActions.deleteTicket(ticketId));
        dispatch(CurrentTicketActions.reset());
        dispatch(TicketBuilderActions.setIsSaving(false));
        dispatch(TicketBuilderActions.closeDeleteModal());
        return 200;
      }

      dispatch(TicketBuilderActions.setErrorMessage(response.error || 'Failed to delete ticket'));
      dispatch(TicketBuilderActions.setIsSaving(false));
      return 400;
    } catch (error: any) {
      console.error('❌ deleteTicketThunk error:', error);
      dispatch(TicketBuilderActions.setErrorMessage(error.message));
      dispatch(TicketBuilderActions.setIsSaving(false));
      return 500;
    }
  };
};
