import type { AppThunk } from '../../store';
import { extractTicketsFromText } from '@/src/api/tickets';
import { TicketBuilderActions } from '../../builders/ticketBuilder';
import { TicketsActions } from '../../dumps/tickets';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Extract tickets from pasted text via backend. Backend reconciles against existing,
 * creates only new tickets, returns created + duplicates for approve/deny.
 */
export const extractTicketsFromTextThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const state = getState();
    const projectId = state.currentProjectDetail.projectId;
    const projects = state.projects;
    const project = projectId ? projects[projectId] ?? null : null;
    const customerId = project?.customer_id ?? null;
    const importTicketsText = state.ticketBuilder.importTicketsText;
    const userId = state.auth?.user?.id;

    if (!importTicketsText?.trim()) {
      return 400;
    }
    if (!projectId) {
      dispatch(TicketBuilderActions.setErrorMessage('No project selected'));
      return 400;
    }
    if (!userId) {
      dispatch(TicketBuilderActions.setErrorMessage('You must be signed in to create tickets'));
      return 400;
    }

    dispatch(TicketBuilderActions.setIsExtractingTickets(true));
    dispatch(TicketBuilderActions.setErrorMessage(null));
    dispatch(TicketBuilderActions.setExtractionDuplicates({ duplicates: [], createdCount: 0 }));

    const response = await extractTicketsFromText({
      userId,
      projectId,
      customerId,
      textBlob: importTicketsText.trim(),
    });

    dispatch(TicketBuilderActions.setIsExtractingTickets(false));

    if (!response.success) {
      dispatch(TicketBuilderActions.setErrorMessage(response.error ?? 'Failed to extract tickets'));
      return 400;
    }

    const { created, duplicates } = response.data ?? { created: [], duplicates: [] };

    if (created.length === 0 && duplicates.length === 0) {
      dispatch(TicketBuilderActions.setErrorMessage('No tickets found in the text'));
      return 400;
    }

    for (const ticket of created) {
      dispatch(
        TicketsActions.addTicket({
          ...ticket,
          project_id: ticket.project_id ?? projectId ?? null,
        }),
      );
    }

    dispatch(
      TicketBuilderActions.setExtractionDuplicates({
        duplicates,
        createdCount: created.length,
      }),
    );

    if (duplicates.length === 0) {
      dispatch(TicketBuilderActions.closeImportTicketsModal());
      const msg = created.length > 0 ? `Created ${created.length} ticket(s).` : 'No new tickets to create.';
      alert(msg);
    }

    return 200;
  };
};
