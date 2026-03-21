import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  LeadContactEmail,
  TiptapContent,
} from '@/src/model/lead-contact-email';

type CurrentLeadContactEmailState = {
  id: string;
  lead_id: string;
  lead_contact_id: string;
  subject: string;
  body: TiptapContent;
  campaign_ids: string[];
  attachment_ids: string[];
  pendingAttachmentFile: File | null;
};

const emptyBody: TiptapContent = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

const initialState: CurrentLeadContactEmailState = {
  id: '',
  lead_id: '',
  lead_contact_id: '',
  subject: '',
  body: emptyBody,
  campaign_ids: [],
  attachment_ids: [],
  pendingAttachmentFile: null,
};

export const currentLeadContactEmailSlice = createSlice({
  name: 'currentLeadContactEmail',
  initialState,
  reducers: {
    setEmail: (_state, action: PayloadAction<LeadContactEmail>) => ({
      id: action.payload.id,
      lead_id: action.payload.lead_id,
      lead_contact_id: action.payload.lead_contact_id,
      subject: action.payload.subject,
      body: action.payload.body,
      campaign_ids: action.payload.campaign_ids ?? [],
      attachment_ids: [],
      pendingAttachmentFile: null,
    }),
    setPendingAttachmentFile: (
      state,
      action: PayloadAction<File | null>
    ) => {
      state.pendingAttachmentFile = action.payload;
    },
    addAttachmentId: (state, action: PayloadAction<string>) => {
      if (!state.attachment_ids.includes(action.payload)) {
        state.attachment_ids.push(action.payload);
      }
    },
    removeAttachmentId: (state, action: PayloadAction<string>) => {
      state.attachment_ids = state.attachment_ids.filter(
        (id) => id !== action.payload
      );
    },
    setSubject: (state, action: PayloadAction<string>) => {
      state.subject = action.payload;
    },
    setBody: (state, action: PayloadAction<TiptapContent>) => {
      state.body = action.payload;
    },
    updateFields: (
      state,
      action: PayloadAction<Partial<CurrentLeadContactEmailState>>
    ) => {
      return { ...state, ...action.payload };
    },
    reset: () => initialState,
  },
});

export const CurrentLeadContactEmailActions =
  currentLeadContactEmailSlice.actions;
export default currentLeadContactEmailSlice.reducer;
