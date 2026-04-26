import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedLeads() {
  console.log("🎯 Seeding Wishlist Leads...");

  // 1. Get vendors and their inventory
  const { data: vendors } = await supabase.from('vendors').select('id, slug');
  const { data: inventory } = await supabase.from('inventory').select('id, vendor_id, species_name');

  const wishlistToInsert = [];
  const matchesToInsert = [];

  // Create some common wishlists
  const species = ["Monstera deliciosa Albo Variegata", "Philodendron 'Spiritus Sancti'", "Anthurium warocqueanum", "Alocasia 'Frydek' Variegated"];
  
  species.forEach(name => {
    wishlistToInsert.push({
      species_name: name,
      notes: "Looking for high variegation and healthy roots.",
      user_id: "00000000-0000-0000-0000-000000000000" // Mock user
    });
  });

  const { data: wishlists, error: wishError } = await supabase
    .from('wishlists')
    .insert(wishlistToInsert)
    .select();

  if (wishError) {
    console.error("❌ Error seeding wishlists:", wishError);
    return;
  }

  // 2. Create matches
  wishlists.forEach(wish => {
    // Find inventory that matches this species
    const matchingInventory = inventory.filter(inv => inv.species_name === wish.species_name);
    
    matchingInventory.forEach(inv => {
      const isEliteMatch = Math.random() > 0.5;
      matchesToInsert.push({
        wishlist_id: wish.id,
        inventory_id: inv.id,
        vendor_id: inv.vendor_id,
        elite_notified_at: isEliteMatch ? new Date().toISOString() : null,
        general_notified_at: isEliteMatch ? null : new Date().toISOString(),
        created_at: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString()
      });
    });
  });

  const { data: matches, error: matchError } = await supabase
    .from('wishlist_matches')
    .insert(matchesToInsert)
    .select();

  if (matchError) {
    console.error("❌ Error seeding matches:", matchError);
  } else {
    console.log(`✅ Successfully seeded ${wishlists.length} wishlists and ${matches.length} leads.`);
  }
}

seedLeads();
