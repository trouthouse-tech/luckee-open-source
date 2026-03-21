import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { LeadContactEmailAttachment } from '@/src/model/lead-contact-email-attachment';

const initialState: Record<string, LeadContactEmailAttachment> = {};

const leadContactEmailAttachmentsSlice = createSlice({
  name: 'leadContactEmailAttachments',
  initialState,
  reducers: {
    addAttachments: (
      state,
      action: PayloadAction<LeadContactEmailAttachment[]>
    ) => {
      action.payload.forEach((attachment) => {
        state[attachment.id] = attachment;
      });
    },
    addAttachment: (
      state,
      action: PayloadAction<LeadContactEmailAttachment>
    ) => {
      state[action.payload.id] = action.payload;
    },
    removeAttachment: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    clearAttachments: () => initialState,
  },
});

export const LeadContactEmailAttachmentsActions =
  leadContactEmailAttachmentsSlice.actions;
export default leadContactEmailAttachmentsSlice.reducer;
