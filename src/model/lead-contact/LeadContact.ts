export type LeadContactStatus =
  | 'not_contacted'
  | 'contacted'
  | 'responded'
  | 'not_responded'
  | 'won'
  | 'lost';

export type LeadContact = {
  id: string;
  lead_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  notes: string | null;
  status: LeadContactStatus;
  created_at: string;
  updated_at: string;
};

export type CreateLeadContactInput = {
  lead_id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  notes?: string;
  status?: LeadContactStatus;
};
