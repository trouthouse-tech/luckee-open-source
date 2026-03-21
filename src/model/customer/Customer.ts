export type Customer = {
  id: string;
  user_id: string;
  name: string;
  status: 'pending_review' | 'active' | 'inactive';
  created_at: string;
  updated_at: string;
};
