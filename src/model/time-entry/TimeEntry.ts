export type TimeEntry = {
  id: string;
  user_id: string;
  project_id: string;
  customer_id: string | null;
  date: string;
  time: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
};
