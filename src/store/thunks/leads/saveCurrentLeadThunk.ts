import type { AppThunk } from '../../store';
import { LeadBuilderActions } from '../../builders';
import { updateLeadThunk } from './updateLeadThunk';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Persists `currentLead` field edits via PATCH. Sets `isSavingLeadDetail` on the lead builder.
 */
export const saveCurrentLeadThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const currentLead = getState().currentLead;
    if (!currentLead?.id) return 400;
    if (getState().leadBuilder.isSavingLeadDetail) return 400;

    dispatch(LeadBuilderActions.setIsSavingLeadDetail(true));
    try {
      return await dispatch(
        updateLeadThunk(currentLead.id, {
          business_name: currentLead.business_name,
          status: currentLead.status,
          quality_score: currentLead.quality_score ?? undefined,
          website: currentLead.website ?? undefined,
          name: currentLead.name ?? undefined,
          email: currentLead.email ?? undefined,
          phone: currentLead.phone ?? undefined,
          business_phone: currentLead.business_phone ?? undefined,
          address: currentLead.address ?? undefined,
          notes: currentLead.notes ?? undefined,
        })
      );
    } finally {
      dispatch(LeadBuilderActions.setIsSavingLeadDetail(false));
    }
  };
};
