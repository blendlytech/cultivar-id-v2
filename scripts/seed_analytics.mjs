import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedAnalytics() {
  console.log("📊 Seeding Analytics Events...");

  // 1. Get vendors
  const { data: vendors } = await supabase.from('vendors').select('id, slug');
  
  const eventsToInsert = [];
  const now = new Date();

  vendors.forEach(vendor => {
    // Total Views (30-100 per vendor)
    const totalViews = Math.floor(Math.random() * 70) + 30;
    
    for (let i = 0; i < totalViews; i++) {
      // Random date in last 30 days
      const eventDate = new Date();
      eventDate.setDate(now.getDate() - Math.floor(Math.random() * 30));
      eventDate.setHours(Math.floor(Math.random() * 24));

      eventsToInsert.push({
        vendor_id: vendor.id,
        event_type: 'profile_view',
        created_at: eventDate.toISOString(),
        metadata: {
          platform: Math.random() > 0.5 ? 'desktop' : 'mobile',
          referrer: Math.random() > 0.7 ? 'google' : 'internal'
        }
      });
    }
  });

  // 2. Insert in batches if needed, but 15*100 is manageable
  const { data, error } = await supabase
    .from('analytics_events')
    .insert(eventsToInsert);

  if (error) {
    console.error("❌ Error seeding analytics:", error);
  } else {
    console.log(`✅ Successfully seeded ${eventsToInsert.length} analytics events.`);
  }
}

seedAnalytics();
