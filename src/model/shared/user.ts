/**
 * User Types
 */

export type User = {
  id: string;
  name: string;
  email?: string;
  provider: 'apple' | 'google' | 'email';
  image?: string;
  tier: 'free' | 'paid' | 'byok';
  created_at: string;
  updated_at: string;
};

export type UserCredits = {
  id: string;
  user_id: string;
  credits: number;
  created_at: string;
  updated_at: string;
};
