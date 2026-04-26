import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const eventSeeds = [
  {
    title: "International Aroid Society Show & Sale",
    slug: "ias-show-2026",
    start_date: "2026-09-15T09:00:00",
    end_date: "2026-09-16T17:00:00",
    location_name: "Fairchild Tropical Botanic Garden",
    location_address: "10901 Old Cutler Rd, Coral Gables, FL 33156",
    description: "The world's largest gathering of aroid enthusiasts. Featuring rare Philodendrons, Anthuriums, and Monsteras from global growers.",
    lat: 25.6766,
    lng: -80.2736,
    event_type: "Expo",
    is_featured: true
  },
  {
    title: "Rare Plant Fairy Pop-up Expo",
    slug: "rpf-popup-detroit",
    start_date: "2026-05-20T10:00:00",
    end_date: "2026-05-20T16:00:00",
    location_name: "The Eastern Detroit",
    location_address: "3434 Russell St, Detroit, MI 48207",
    description: "A high-end rare plant event in the heart of Detroit featuring local and guest vendors.",
    lat: 42.3486,
    lng: -83.0396,
    event_type: "Pop-up",
    is_featured: false
  },
  {
    title: "TPIE (Tropical Plant International Expo)",
    slug: "tpie-2026",
    start_date: "2026-01-21T09:00:00",
    end_date: "2026-01-23T15:00:00",
    location_name: "Tampa Convention Center",
    location_address: "333 S Franklin St, Tampa, FL 33602",
    description: "The trade event showcasing tropical and indoor plants with exhibitors from across the globe.",
    lat: 27.9416,
    lng: -82.4536,
    event_type: "Trade Show",
    is_featured: true
  }
];

async function seedEvents() {
  console.log("📍 Seeding Botanical Events...");

  // 1. Insert Events
  const { data: insertedEvents, error: eventError } = await supabase
    .from('events')
    .upsert(eventSeeds, { onConflict: 'slug' })
    .select();

  if (eventError) {
    console.error("❌ Error seeding events:", eventError);
    return;
  }

  console.log(`✅ Successfully seeded ${insertedEvents.length} events.`);

  // 2. Map Vendors to Events
  const { data: vendors } = await supabase.from('vendors').select('id, slug');
  
  const eventVendorMappings = [];
  
  // IAS Show (Miami) -> NSE Tropicals, Ecuagenera
  const ias = insertedEvents.find(e => e.slug === 'ias-show-2026');
  const nse = vendors.find(v => v.slug === 'nse-tropicals');
  const ecua = vendors.find(v => v.slug === 'ecuagenera-usa');
  
  if (ias && nse) eventVendorMappings.push({ event_id: ias.id, vendor_id: nse.id });
  if (ias && ecua) eventVendorMappings.push({ event_id: ias.id, vendor_id: ecua.id });

  // RPF Pop-up -> Rare Plant Fairy
  const rpfPop = insertedEvents.find(e => e.slug === 'rpf-popup-detroit');
  const rpf = vendors.find(v => v.slug === 'rare-plant-fairy');
  if (rpfPop && rpf) eventVendorMappings.push({ event_id: rpfPop.id, vendor_id: rpf.id });

  const { error: mappingError } = await supabase
    .from('event_vendors')
    .upsert(eventVendorMappings, { onConflict: 'event_id,vendor_id' });

  if (mappingError) {
    console.error("❌ Error mapping vendors to events:", mappingError);
  } else {
    console.log(`✅ Successfully mapped vendors to events.`);
  }
}

seedEvents();
