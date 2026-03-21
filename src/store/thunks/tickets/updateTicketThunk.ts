import type { AppThunk } from '../../store';
import { updateTicket } from '@/src/api';
import type { Ticket } from '@/src/model';
import { TicketsActions } from '../../dumps/tickets';
import { CurrentTicketActions } from '../../current/currentTicket';
import { TicketBuilderActions } from '../../builders/ticketBuilder';

type ResponseType = Promise<200 | 400 | 500>;

export const updateTicketThunk = (
  ticketId: string,
  updates: Partial<Ticket>
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      dispatch(TicketBuilderActions.setIsSaving(true));
      dispatch(TicketBuilderActions.setErrorMessage(null));

      const response = await updateTicket(ticketId, updates);

      if (response.success && response.data) {
        dispatch(TicketsActions.updateTicket(response.data));
        dispatch(CurrentTicketActions.setCurrentTicket(response.data));
        dispatch(TicketBuilderActions.setIsSaving(false));
        dispatch(TicketBuilderActions.closeEditModal());
        return 200;
      }

      dispatch(TicketBuilderActions.setErrorMessage(response.error || 'Failed to update ticket'));
      dispatch(TicketBuilderActions.setIsSaving(false));
      return 400;
    } catch (error: any) {
      console.error('❌ updateTicketThunk error:', error);
      dispatch(TicketBuilderActions.setErrorMessage(error.message));
      dispatch(TicketBuilderActions.setIsSaving(false));
      return 500;
    }
  };
};
