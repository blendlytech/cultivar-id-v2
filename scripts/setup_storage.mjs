import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupStorage() {
  console.log("🏗️ Setting up Supabase Storage buckets...");

  const buckets = [
    { name: 'inventory', public: true },
    { name: 'vendors', public: true }
  ];

  for (const bucket of buckets) {
    const { data, error } = await supabase.storage.createBucket(bucket.name, {
      public: bucket.public,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    });

    if (error) {
      if (error.message.includes('already exists')) {
        console.log(`ℹ️ Bucket "${bucket.name}" already exists.`);
      } else {
        console.error(`❌ Error creating bucket "${bucket.name}":`, error.message);
      }
    } else {
      console.log(`✅ Bucket "${bucket.name}" created successfully.`);
    }
  }

  console.log("🏁 Storage setup complete.");
}

setupStorage();
