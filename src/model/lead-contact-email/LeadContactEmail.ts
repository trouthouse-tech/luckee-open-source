export type TiptapTextNode = {
  type: 'text';
  text: string;
  marks?: Array<{ type: string; [key: string]: unknown }>;
};

export type TiptapNode = {
  type: string;
  content?: TiptapNode[];
  text?: string;
  [key: string]: unknown;
};

export type TiptapContent = {
  type: string;
  content?: TiptapNode[];
  [key: string]: unknown;
};

export type LeadContactEmail = {
  id: string;
  lead_id: string;
  lead_contact_id: string;
  subject: string;
  body: TiptapContent;
  campaign_ids: string[];
  created_at: Date | string;
  updated_at: Date | string;
};
