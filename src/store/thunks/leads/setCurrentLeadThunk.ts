import type { AppThunk } from '../../store';
import { CurrentLeadActions } from '../../current';
import { LeadBuilderActions } from '../../builders';

type ResponseType = Promise<200>;

/**
 * Sets the current lead in Redux from the leads dump by id.
 * Call when a lead is selected (e.g. from the leads list or when opening the detail page by URL).
 * Also resets the lead detail tab to Overview.
 */
export const setCurrentLeadThunk = (leadId: string): AppThunk<ResponseType> => {
  return (dispatch, getState): ResponseType => {
    const lead = getState().leads[leadId] ?? null;
    dispatch(CurrentLeadActions.setCurrentLead(lead));
    dispatch(LeadBuilderActions.setActiveLeadDetailTab('Overview'));
    return Promise.resolve(200);
  };
};
