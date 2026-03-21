export type LeadStatus =
  | 'not_contacted'
  | 'not_answered'
  | 'contacted'
  | 'lost'
  | 'archived';

export type WorkflowRecommendation = {
  workflow_name: string;
  reason: string;
};

export type LeadSummary = {
  content: string;
  highlights: string[];
  opportunities: string[];
  concerns: string[];
  recommended_workflows?: WorkflowRecommendation[];
  generated_at: string;
  source_data: {
    notes_count: number;
    scrapes_count: number;
  };
};

export type Lead = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  business_name: string;
  business_email: string | null;
  business_phone: string | null;
  address: string | null;
  website: string | null;
  has_quote_form: boolean;
  has_chat_bot: boolean;
  has_phone_quote: boolean;
  notes: string | null;
  description: string | null;
  status: LeadStatus;
  archive_reason?: string | null;
  idempotency_key: string;
  search_run_id?: string | null;
  category_id?: string | null;
  category_name?: string | null;
  quality_score?: number | null;
  opportunities?: string[];
  summary?: LeadSummary | null;
  created_at: string;
  updated_at: string;
};

export type LeadOpportunityId =
  | 'website_redo'
  | 'admin_automation'
  | 'report_automation'
  | 'software_app';

export const LEAD_OPPORTUNITY_OPTIONS: { id: LeadOpportunityId; label: string }[] = [
  { id: 'website_redo', label: 'Website redo' },
  { id: 'admin_automation', label: 'Admin automation' },
  { id: 'report_automation', label: 'Report automation' },
  { id: 'software_app', label: 'Software app' },
];
