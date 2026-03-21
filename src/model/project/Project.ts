export type Project = {
  id: string;
  user_id: string;
  customer_id: string | null;
  name: string;
  color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
