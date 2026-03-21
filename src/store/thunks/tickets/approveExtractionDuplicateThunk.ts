import type { AppThunk } from '../../store';
import { createTicket } from '@/src/api';
import { TicketBuilderActions } from '../../builders/ticketBuilder';
import { TicketsActions } from '../../dumps/tickets';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Create a ticket from an extraction duplicate (user approved "create anyway").
 * Removes the duplicate from the list after creation.
 */
export const approveExtractionDuplicateThunk = (index: number): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const state = getState();
    const duplicates = state.ticketBuilder.extractionDuplicates;
    const duplicate = duplicates[index];
    const projectId = state.currentProjectDetail.projectId;
    const projects = state.projects;
    const project = projectId ? projects[projectId] ?? null : null;
    const customerId = project?.customer_id ?? null;
    const userId = state.auth?.user?.id;

    if (!duplicate || !projectId || !userId) {
      return 400;
    }

    const { extracted } = duplicate;
    const ticketPayload = {
      user_id: userId,
      project_id: projectId,
      customer_id: customerId,
      title: extracted.title,
      description: extracted.description ?? null,
      status: (extracted.status as 'todo' | 'in_progress' | 'done') ?? 'todo',
      priority: (extracted.priority as 'low' | 'medium' | 'high') ?? 'medium',
      tags: [],
      labels: [],
    };

    const response = await createTicket(ticketPayload);

    if (response.success && response.data) {
      dispatch(TicketsActions.addTicket(response.data));
      dispatch(TicketBuilderActions.removeExtractionDuplicateAtIndex(index));
      return 200;
    }

    dispatch(TicketBuilderActions.setErrorMessage(response.error ?? 'Failed to create ticket'));
    return 400;
  };
};
