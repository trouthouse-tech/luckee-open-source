import type { AppThunk } from '../../store';
import { createTicket } from '@/src/api';
import type { Ticket } from '@/src/model';
import { TicketsActions } from '../../dumps/tickets';
import { CurrentTicketActions } from '../../current/currentTicket';
import { TicketBuilderActions } from '../../builders/ticketBuilder';

type ResponseType = Promise<200 | 400 | 500>;

export const createTicketThunk = (
  ticket: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      dispatch(TicketBuilderActions.setIsSaving(true));
      dispatch(TicketBuilderActions.setErrorMessage(null));

      const response = await createTicket(ticket);

      if (response.success && response.data) {
        dispatch(TicketsActions.addTicket(response.data));
        dispatch(CurrentTicketActions.setCurrentTicket(response.data)); // Populate currentTicket with created ticket
        dispatch(TicketBuilderActions.setIsSaving(false));
        dispatch(TicketBuilderActions.closeCreateModal());
        return 200;
      }

      dispatch(TicketBuilderActions.setErrorMessage(response.error || 'Failed to create ticket'));
      dispatch(TicketBuilderActions.setIsSaving(false));
      return 400;
    } catch (error: any) {
      console.error('❌ createTicketThunk error:', error);
      dispatch(TicketBuilderActions.setErrorMessage(error.message));
      dispatch(TicketBuilderActions.setIsSaving(false));
      return 500;
    }
  };
};
