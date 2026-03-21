export type GoogleMapsScrapeRunStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed';

export type GoogleMapsScrapeRun = {
  id: string;
  name: string;
  searchQuery: string;
  status: GoogleMapsScrapeRunStatus;
  resultsCount: number;
  businessesImported: number;
  maxResults?: number;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
  duration?: number;
};
