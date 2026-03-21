import type { AppThunk } from '../../store';
import { CurrentTicketActions } from '../../current/currentTicket';

type ResponseType = Promise<200>;

/**
 * Sets the current ticket in Redux from the tickets dump by id.
 * Call when a ticket is selected (e.g. table row or Kanban card click) before navigating to detail.
 */
export const setCurrentTicketThunk = (ticketId: string): AppThunk<ResponseType> => {
  return (dispatch, getState): ResponseType => {
    const ticket = getState().tickets[ticketId] ?? null;
    if (ticket != null) {
      dispatch(CurrentTicketActions.setCurrentTicket(ticket));
    } else {
      dispatch(CurrentTicketActions.reset());
    }
    return Promise.resolve(200);
  };
};
