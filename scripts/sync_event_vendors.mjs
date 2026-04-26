import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const data = [
  {
    eventSlug: 'the-big-plant-expo',
    vendors: [
      'Chaparral Nursery', 'Dover Design Co.', 'Hunter Flytraps', 'Monstera Etc.', 'Root Nerds', 
      'Growth Technology', 'Rare Plant Fairy', 'The Plant Hall', 'Tropics @ Home', 'Botanicaz', 
      'Canopy Plant Co.', 'Peace Love & Happiness Club', 'BWH Plant Co.', 'The Jungle Collective', 
      'Planterina', 'Bloomscape', 'The Sill', 'Gabriella Plants', 'Steve\'s Leaves', 'Logee\'s', 
      'Glasshouse Works', 'Kartuz Greenhouses', 'Accents for Home and Garden', 'Botanical Haven', 
      'Plant Proper', 'Aroid Market', 'Backyard Blooms', 'Bello Tropicals'
    ]
  },
  {
    eventSlug: 'rare-plant-and-orchid-festival-miami-',
    vendors: [
      'Brain Wave Superfood Mushrooms', 'Green Barn Supply', 'Hang a Pot', 'Migel Bode Honey', 
      'OFE International', 'Thryve Roots', 'Vina Planters', 'Krull-Smith', 'Motes Orchids', 
      'R.F. Orchids', 'Soroa Orchids', 'Whimsy Orchids', 'Bredren Orchids', 'Odom\'s Orchids', 
      'Palmer Orchids', 'Quest Orchids', 'Ritter Orchids', 'Smiley\'s Orchids', 'So Orchids', 
      'St. Germain Orchids', 'Water Orchids', 'PC Orchids', 'Amazonia Orchids', 'Mac\'s Orchids', 'Hamlyn Orchids'
    ]
  },
  {
    eventSlug: 'rhs-chelsea-flower-show',
    vendors: [
      'Raymond Evison Clematis', 'David Austin Roses', 'Peter Beales Roses', 'Hillier Nurseries', 
      'Burncoose Nurseries', 'Kelways Plants', 'Hare Spring Cottage Plants', 'Mendip Bonsai Studio', 
      'Blackmore & Langdon', 'Bowden Hostas', 'Dibleys Nurseries', 'Every Picture Tells a Story', 
      'Fibrex Nurseries', 'Hardy\'s Cottage Garden Plants', 'Jacques Amand International', 
      'Pheasant Acre Plants', 'South West Ferns', 'Tushaus', 'Walkers Bulbs', 'Warmenhoven'
    ]
  },
  {
    eventSlug: 'cultivate-26',
    vendors: [
      'A.M.A. Horticulture Inc.', 'Abbott-IPCO Inc', 'Acorn Farms Inc', 'Eason Horticultural Resources', 
      'SBI Software', 'Alpha Nursery Inc', 'Allied Potting Co', 'Altis Nursery', 'Amigos Nursery', 
      'Angel\'s Nursery', 'Aris Horticulture Inc', 'Argos Software', 'Atticus LLC', 'Bailey Nurseries', 
      'BASF', 'Ball Horticultural Company', 'Dummen Orange', 'Syngenta Flowers', 'Selecta One', 
      'PanAmerican Seed', 'Darwin Perennials', 'Kieft Seed', 'Star Roses and Plants', 'Monrovia', 'Spring Meadow Nursery'
    ]
  },
  {
    eventSlug: 'ias-show-2026',
    vendors: [
      'Ecuagenera', 'Ecuagenera USA', 'NSE Tropicals', 'Tezula Plants', 'Rare Plant Fairy', 
      'Botanicaz', 'Tropicals @ Home', 'Steve\'s Leaves', 'Logee\'s', 'Glasshouse Works', 
      'Kartuz Greenhouses', 'Accents for Home and Garden', 'Botanical Haven', 'Plant Proper', 
      'Aroid Market', 'Backyard Blooms', 'Bello Tropicals', 'Monstera Etc', 'Root Nerds', 
      'Hunter Flytraps', 'Chaparral Nursery', 'Dover Design Co.'
    ]
  },
  {
    eventSlug: 'plantcon-houston',
    vendors: [
      'Rare Plant Fairy', 'The Plant Hall', 'Tropics @ Home', 'NSE Tropicals', 'Tezula Plants', 
      'Ecuagenera', 'Ecuagenera USA', 'Steve\'s Leaves', 'Logee\'s', 'Glasshouse Works', 
      'Kartuz Greenhouses', 'Accents for Home and Garden', 'Botanical Haven', 'Plant Proper', 
      'Canopy Plants', 'Botanicaz', 'Peace Love & Happiness Club', 'BWH Plant Co.', 'The Jungle Collective'
    ]
  }
];

async function syncVendors() {
  for (const item of data) {
    console.log(`Processing event: ${item.eventSlug}`);
    
    // Get event ID
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id')
      .eq('slug', item.eventSlug)
      .single();
    
    if (eventError || !event) {
      console.error(`Error finding event ${item.eventSlug}:`, eventError);
      continue;
    }

    for (const vendorName of item.vendors) {
      const slug = vendorName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      // Upsert vendor
      const { data: vendor, error: vendorError } = await supabase
        .from('vendors')
        .upsert({ name: vendorName, slug: slug }, { onConflict: 'slug' })
        .select('id')
        .single();
      
      if (vendorError) {
        console.error(`Error upserting vendor ${vendorName}:`, vendorError);
        continue;
      }

      // Link vendor to event
      const { error: linkError } = await supabase
        .from('event_vendors')
        .upsert({ event_id: event.id, vendor_id: vendor.id }, { onConflict: 'event_id,vendor_id' });
      
      if (linkError) {
        console.error(`Error linking ${vendorName} to ${item.eventSlug}:`, linkError);
      } else {
        console.log(`✅ Linked ${vendorName} to ${item.eventSlug}`);
      }
    }
  }
  console.log('Sync complete.');
}

syncVendors();
