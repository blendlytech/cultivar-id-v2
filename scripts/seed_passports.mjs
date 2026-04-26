import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const passportSeeds = [
  {
    vendor_slug: "nse-tropicals",
    item_name: "Philodendron 'Spiritus Sancti'",
    propagation_method: "Stem Cutting",
    mother_plant_origin: "Private Collection (Brazil Lineage)"
  },
  {
    vendor_slug: "rare-plant-fairy",
    item_name: "Monstera deliciosa Albo Variegata",
    propagation_method: "Tissue Culture",
    mother_plant_origin: "RPF Mother Block #04"
  },
  {
    vendor_slug: "orange-lake-nursery",
    item_name: "Variegated Philodendron billietiae",
    propagation_method: "Tissue Culture",
    mother_plant_origin: "Lab Clone ID-X88"
  }
];

async function seedPassports() {
  console.log("📜 Seeding Digital Passports...");

  // 1. Get vendors and their inventory
  const { data: vendors } = await supabase.from('vendors').select('id, slug');
  const { data: inventory } = await supabase.from('inventory').select('id, vendor_id, species_name');

  const vendorMap = vendors.reduce((acc, v) => { acc[v.slug] = v.id; return acc; }, {});
  
  const passportsToInsert = passportSeeds.map(seed => {
    const vendorId = vendorMap[seed.vendor_slug];
    const invItem = inventory.find(i => i.vendor_id === vendorId && i.species_name === seed.item_name);
    
    return {
      vendor_id: vendorId,
      inventory_id: invItem?.id || null,
      specimen_name: seed.item_name,
      propagation_method: seed.propagation_method,
      mother_plant_origin: seed.mother_plant_origin,
      verification_hash: crypto.randomBytes(4).toString('hex')
    };
  });

  const { data, error } = await supabase
    .from('digital_passports')
    .insert(passportsToInsert)
    .select();

  if (error) {
    console.error("❌ Error seeding passports:", error);
  } else {
    console.log(`✅ Successfully seeded ${data.length} Digital Passports.`);
    data.forEach(p => {
      console.log(`   - ${p.specimen_name}: /verify/${p.verification_hash}`);
    });
  }
}

seedPassports();
