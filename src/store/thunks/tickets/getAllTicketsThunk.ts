import type { AppThunk } from '../../store';
import { getAllTickets } from '@/src/api';
import { TicketsActions } from '../../dumps/tickets';
import { TicketBuilderActions } from '../../builders/ticketBuilder';

type ResponseType = Promise<200 | 400 | 500>;

export const getAllTicketsThunk = (userId: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      dispatch(TicketBuilderActions.setIsLoading(true));
      dispatch(TicketBuilderActions.setErrorMessage(null));

      const response = await getAllTickets(userId);

      if (response.success && response.data) {
        dispatch(TicketsActions.setTickets(response.data));
        dispatch(TicketBuilderActions.setIsLoading(false));
        return 200;
      }

      // Don't show error for missing endpoints (404) - endpoint may not exist yet
      if (response.error?.includes('not available yet') || response.error?.includes('not found')) {
        dispatch(TicketsActions.setTickets([]));
        dispatch(TicketBuilderActions.setIsLoading(false));
        return 200; // Return success with empty array
      }

      dispatch(TicketBuilderActions.setErrorMessage(response.error || 'Failed to get tickets'));
      dispatch(TicketBuilderActions.setIsLoading(false));
      return 400;
    } catch (error: any) {
      console.error('❌ getAllTicketsThunk error:', error);
      dispatch(TicketBuilderActions.setErrorMessage(error.message));
      dispatch(TicketBuilderActions.setIsLoading(false));
      return 500;
    }
  };
};
