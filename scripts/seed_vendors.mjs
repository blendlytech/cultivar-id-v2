import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const vendors = [
  {
    name: "Logee's Greenhouses",
    slug: "logees-greenhouses",
    specialty: ["Tropicals", "Rare Houseplants", "Fruiting Plants"],
    website_url: "https://logees.com",
    contact_email: "info@logees.com",
    location_city: "Danielson",
    location_state: "CT",
    location_country: "USA",
    bio: "Known for an extensive collection of rare, exotic, and tropical houseplants, begonias, and fruiting plants."
  },
  {
    name: "NSE Tropicals",
    slug: "nse-tropicals",
    specialty: ["Aroids", "Rare Tropicals", "Philodendrons"],
    website_url: "https://nsetropicals.com",
    contact_email: "enid@nsetropicals.com",
    location_city: "Plantation",
    location_state: "FL",
    location_country: "USA",
    bio: "A highly regarded source for rare and unusual tropical foliage plants."
  },
  {
    name: "Ecuagenera USA",
    slug: "ecuagenera-usa",
    specialty: ["Anthuriums", "Philodendrons", "Orchids"],
    website_url: "https://ecuageneraus.com",
    contact_email: "info@ecuageneraus.com",
    location_city: "Apopka",
    location_state: "FL",
    location_country: "USA",
    bio: "Extensive collection of rare aroids and orchids from South America."
  },
  {
    name: "Rare Plant Fairy",
    slug: "rare-plant-fairy",
    specialty: ["Rare Aroids", "Hoyas", "Exotic Tropicals"],
    website_url: "https://rareplantfairy.com",
    contact_email: "hello@rareplantfairy.com",
    location_city: "Detroit",
    location_state: "MI",
    location_country: "USA",
    bio: "Specializing in rare aroids, Hoyas, and exotic tropicals with a focus on variegated specimens."
  },
  {
    name: "Steve's Leaves",
    slug: "steves-leaves",
    specialty: ["Begonias", "Rare Tropicals", "Aroids"],
    website_url: "https://stevesleaves.com",
    contact_email: "support@stevesleaves.com",
    location_city: "Lewisville",
    location_state: "TX",
    location_country: "USA",
    bio: "Propagated rare tropical houseplants, including aroids and exotic foliage."
  },
  {
    name: "Orange Lake Nursery",
    slug: "orange-lake-nursery",
    specialty: ["Rare Aroids", "Hoyas", "Tissue Culture"],
    website_url: "https://orangelakenursery.com",
    contact_email: "info@orangelakenursery.com",
    location_city: "Orange Lake",
    location_state: "FL",
    location_country: "USA",
    bio: "A Florida-based nursery popular for tropical exotics like Philodendrons and Alocasias."
  },
  {
    name: "Canopy Plant Co.",
    slug: "canopy-plant-co",
    specialty: ["Rare Houseplants", "Tropicals", "Philodendrons"],
    website_url: "https://canopyplantco.com",
    contact_email: "info@canopyplantco.com",
    location_city: "New Orleans",
    location_state: "LA",
    location_country: "USA",
    bio: "Unique tropical houseplants and rare aroids curated for plant enthusiasts."
  },
  {
    name: "The Rare Plant Haus",
    slug: "rare-plant-haus",
    specialty: ["Rare Aroids", "Hoyas", "Orchids"],
    website_url: "https://therareplanthaus.com",
    contact_email: "therareplanthaus@hotmail.com",
    location_city: "Miami",
    location_state: "FL",
    location_country: "USA",
    bio: "Rare, uncommon, and hard-to-find aroids, Hoyas, and orchids."
  },
  {
    name: "Aroid Greenhouses",
    slug: "aroid-greenhouses",
    specialty: ["Rare Aroids", "Variegated Plants", "Hoyas"],
    website_url: "https://aroidgreenhouses.com",
    contact_email: "info@aroidgreenhouses.com",
    location_city: "Southwest Ranches",
    location_state: "FL",
    location_country: "USA",
    bio: "Specializing in rare aroids and variegated tropical plants."
  },
  {
    name: "RareFind Nursery",
    slug: "rarefind-nursery",
    specialty: ["Woody Plants", "Rare Perennials", "Variegated Trees"],
    website_url: "https://rarefindnursery.com",
    contact_email: "support@rarefindnursery.com",
    location_city: "Jackson",
    location_state: "NJ",
    location_country: "USA",
    bio: "Unusual hardy plants, including variegated plants, shade plants, and rare trees/shrubs."
  },
  {
    name: "Woodlanders",
    slug: "woodlanders",
    specialty: ["Native Plants", "Rare Trees", "Heirloom Plants"],
    website_url: "https://woodlanders.net",
    contact_email: "info@woodlanders.net",
    location_city: "Aiken",
    location_state: "SC",
    location_country: "USA",
    bio: "Long-standing nursery specializing in rare, heirloom, native, and hard-to-find woody plants."
  },
  {
    name: "Ed's Plant Shop",
    slug: "eds-plant-shop",
    specialty: ["Indoor Rare Plants", "Tropicals"],
    website_url: "https://edsplantshop.com",
    contact_email: "hello@edsplantshop.com",
    location_city: "Brooklyn",
    location_state: "NY",
    location_country: "USA",
    bio: "A curated shop for indoor rare plants with nationwide shipping."
  },
  {
    name: "Aloha Tropicals",
    slug: "aloha-tropicals",
    specialty: ["Exotic Trees", "Flowering Plants", "Gingers"],
    website_url: "https://alohatropicals.com",
    contact_email: "info@alohatropicals.com",
    location_city: "Vista",
    location_state: "CA",
    location_country: "USA",
    bio: "Exotic tropical trees, flowering plants, gingers, bananas, and vines."
  },
  {
    name: "Perfect Choice Nursery",
    slug: "perfect-choice-nursery",
    specialty: ["Rare Aroids", "Tropical Landscapes"],
    website_url: "https://perfectchoicenursery.com",
    contact_email: "info@perfectchoicenursery.com",
    location_city: "Southwest Ranches",
    location_state: "FL",
    location_country: "USA",
    bio: "Nursery specializing in rare tropical plants and landscaping specimens."
  },
  {
    name: "Glasshouse Works",
    slug: "glasshouse-works",
    specialty: ["Succulents", "Variegated Plants", "Caudiciforms"],
    website_url: "https://glasshouseworks.com",
    contact_email: "plants@glasshouseworks.com",
    location_city: "Stewart",
    location_state: "OH",
    location_country: "USA",
    bio: "Specializing in variegated plants, succulents, and unusual botanical curiosities."
  }
];

async function seedVendors() {
  console.log("🌱 Seeding vendors into database...");

  const { data, error } = await supabase
    .from('vendors')
    .upsert(vendors, { onConflict: 'slug' });

  if (error) {
    console.error("❌ Error seeding vendors:", error);
  } else {
    console.log("✅ Successfully seeded 15 premium vendors.");
  }
}

seedVendors();
