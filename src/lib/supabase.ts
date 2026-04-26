import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Vendor = {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  logo_url: string | null;
  location_city: string | null;
  location_country: string | null;
  tier: 'seedling' | 'verified' | 'pro' | 'elite';
  is_verified: boolean;
  is_elite: boolean;
  elite_number: number | null;
  events_count?: number;
};

export type Collector = {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  location_city: string | null;
  location_country: string | null;
  bio: string | null;
  created_at: string;
};

export type Event = {
  id: string;
  title: string;
  slug: string;
  date_start: string;
  date_end: string;
  location_name: string | null;
  image_url: string | null;
  is_featured: boolean;
  vendors_count?: number;
};

export async function getPremiumVendors() {
  const { data, error } = await supabase
    .from('vendors')
    .select('*, event_vendors(count)')
    .order('tier', { ascending: false })
    .limit(10);
    
  if (error) {
    console.error('Error fetching vendors:', error);
    return [];
  }
  
  return data.map(v => ({
    ...v,
    events_count: v.event_vendors?.[0]?.count || 0
  }));
}

export async function getUpcomingEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*, event_vendors(count)')
    .order('date_start', { ascending: true })
    .limit(6);
    
  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }
  
  return data.map(e => ({
    ...e,
    vendors_count: e.event_vendors?.[0]?.count || 0
  }));
}
