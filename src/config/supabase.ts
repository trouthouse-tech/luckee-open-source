import { createClient } from '@supabase/supabase-js';

export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(`Missing Supabase environment variables. URL: ${supabaseUrl}, Key: ${supabaseAnonKey ? 'exists' : 'missing'}`);
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = createSupabaseClient();
