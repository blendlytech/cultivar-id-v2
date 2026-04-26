import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const inventoryData = [
  {
    vendor_slug: "logees-greenhouses",
    items: [
      { species_name: "Begonia 'Maurice Amey'", variety: "Cane-like", price: 29.95, quantity: 5, image_url: "https://images.unsplash.com/photo-1599591144933-7764724a1b0b?q=80&w=1000&auto=format&fit=crop" },
      { species_name: "Monstera adansonii", variety: "Archipelago", price: 450.00, quantity: 2, image_url: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=1000&auto=format&fit=crop" }
    ]
  },
  {
    vendor_slug: "nse-tropicals",
    items: [
      { species_name: "Philodendron 'Spiritus Sancti'", variety: "Established", price: 1250.00, quantity: 1, image_url: "https://images.unsplash.com/photo-1637967886160-fd78dc3ce3f5?q=80&w=1000&auto=format&fit=crop" },
      { species_name: "Anthurium 'Queen of Hearts'", variety: "Dark Form", price: 325.00, quantity: 3, image_url: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=1000&auto=format&fit=crop" }
    ]
  },
  {
    vendor_slug: "ecuagenera-usa",
    items: [
      { species_name: "Anthurium warocqueanum", variety: "Dark Narrow Form", price: 185.00, quantity: 10, image_url: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=1000&auto=format&fit=crop" },
      { species_name: "Monstera esqueleto", variety: "Juvenile", price: 95.00, quantity: 15, image_url: "https://images.unsplash.com/photo-1597055181300-e3633a207519?q=80&w=1000&auto=format&fit=crop" }
    ]
  },
  {
    vendor_slug: "rare-plant-fairy",
    items: [
      { species_name: "Monstera deliciosa", variety: "Albo Variegata", price: 850.00, quantity: 2, image_url: "https://images.unsplash.com/photo-1617173948498-4c92b41b7c0b?q=80&w=1000&auto=format&fit=crop" },
      { species_name: "Philodendron 'Pink Princess'", variety: "High Variegation", price: 150.00, quantity: 5, image_url: "https://images.unsplash.com/photo-1637500142429-45543666d9d0?q=80&w=1000&auto=format&fit=crop" }
    ]
  },
  {
    vendor_slug: "orange-lake-nursery",
    items: [
      { species_name: "Philodendron billietiae", variety: "Variegated", price: 2500.00, quantity: 1, image_url: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=1000&auto=format&fit=crop" },
      { species_name: "Alocasia 'Frydek'", variety: "Variegated", price: 120.00, quantity: 8, image_url: "https://images.unsplash.com/photo-1597055181300-e3633a207519?q=80&w=1000&auto=format&fit=crop" }
    ]
  },
  {
    vendor_slug: "glasshouse-works",
    items: [
      { species_name: "Ariocarpus fissuratus", variety: "Mature", price: 450.00, quantity: 2, image_url: "https://images.unsplash.com/photo-1520302630591-fd1c66ed1163?q=80&w=1000&auto=format&fit=crop" },
      { species_name: "Dudleya brittonii", variety: "Powdery Liveforever", price: 75.00, quantity: 4, image_url: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=1000&auto=format&fit=crop" }
    ]
  }
];

async function seedInventory() {
  console.log("🪴 Seeding inventory items...");

  // 1. Get all vendors to map slugs to IDs
  const { data: vendors, error: vendorError } = await supabase
    .from('vendors')
    .select('id, slug');

  if (vendorError) {
    console.error("❌ Error fetching vendors:", vendorError);
    return;
  }

  const vendorMap = vendors.reduce((acc, v) => {
    acc[v.slug] = v.id;
    return acc;
  }, {});

  // 2. Prepare items with vendor IDs
  const itemsToInsert = [];
  inventoryData.forEach(group => {
    const vendorId = vendorMap[group.vendor_slug];
    if (vendorId) {
      group.items.forEach(item => {
        itemsToInsert.push({
          ...item,
          vendor_id: vendorId,
          status: 'available'
        });
      });
    }
  });

  // 3. Clear existing inventory (optional, for clean seed)
  // await supabase.from('inventory').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // 4. Insert items
  const { data, error } = await supabase
    .from('inventory')
    .insert(itemsToInsert);

  if (error) {
    console.error("❌ Error seeding inventory:", error);
  } else {
    console.log(`✅ Successfully seeded ${itemsToInsert.length} inventory items.`);
  }
}

seedInventory();
