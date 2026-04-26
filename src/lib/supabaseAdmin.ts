import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase Admin environment variables are missing');
}

/**
 * 🛠️ Supabase Admin Client
 * Use this ONLY for server-side operations that require bypassing RLS.
 * Never use this in client components or for public read operations 
 * that could be handled by the anon key.
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
