export type WebsiteScrapeRunStatus =
  | 'pending'
  | 'active'
  | 'completed'
  | 'failed'
  | 'timeout';

export type WebsiteScrapeRun = {
  id: string;
  lead_id: string;
  website: string;
  status: WebsiteScrapeRunStatus;
  scraped_data?: Record<string, unknown> | null;
  cost_cents?: number | null;
  started_at: string;
  completed_at?: string | null;
  error?: string | null;
  created_at?: string;
};
