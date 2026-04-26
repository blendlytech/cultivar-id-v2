import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import sharp from 'sharp';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Define paths
const TEMPLATE_PATH = path.resolve('./Media Assets/Brand Identity/Art Assets/Directory Branding Art/elite_grower_badge_template.png');
const OUTPUT_DIR = path.resolve('./public/generated-badges');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Brand Colors (Deep Forest Luxe Palette)
const COLORS = {
  GOLD: '#D4AF37',
  WHITE: '#FFFFFF',
  WARM_SAND: '#D7C7A1',
  EMERALD: '#0B3D2E'
};

async function generateBadges() {
  try {
    const templateImage = await loadImage(TEMPLATE_PATH);
    const width = templateImage.width;
    const height = templateImage.height;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    console.log('--- Elite Badge Generation Protocol ---');
    
    // Fetch Elite/Authority Vendors from Supabase
    const { data: vendors, error } = await supabase
      .from('vendors')
      .select('name, location_city, location_state, elite_number, slug')
      .order('elite_number', { ascending: true });

    if (error) throw error;

    console.log(`Fetched ${vendors.length} vendors from database.`);

    // If no elite vendors exist, we'll use the user's requested range (46-100) with mock data
    const startNum = 46;
    const endNum = Math.max(100, vendors.length + 45); 

    console.log(`Starting execution from Badge No. ${String(startNum).padStart(3, '0')}...`);

    for (let i = startNum - 1; i < endNum; i++) {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(templateImage, 0, 0, width, height);

      const dbVendor = vendors.find(v => v.elite_number === i + 1);
      
      const vendor = dbVendor ? {
        companyName: dbVendor.name,
        city: dbVendor.location_city || 'Global',
        state: dbVendor.location_state || 'HQ',
        uniqueId: `CULTIVAR-${dbVendor.slug?.toUpperCase().slice(0, 6) || Math.random().toString(36).substr(2, 6).toUpperCase()}`
      } : { 
        companyName: `Elite Botanical Vendor ${i + 1}`, 
        city: "Classified", 
        state: "XX", 
        uniqueId: `CULTIVAR-${Math.random().toString(36).substr(2, 6).toUpperCase()}` 
      };

      const badgeNumber = String(i + 1).padStart(3, '0');

      // --- PIXEL COORDINATES CONTROL PANEL ---
      const badgeX = 250;       
      const badgeY = height / 2; 
      const textStartX = 450;   
      const nameY = 320;        
      const locationY = 420;    
      const idY = 520;          
      // ---------------------------------------

      // 1. Badge Number (Yellow Circle on the Left)
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 52px serif';
      ctx.fillStyle = COLORS.GOLD; 
      ctx.fillText(badgeNumber, badgeX, badgeY);

      // Reset alignment to left for the stacked information
      ctx.textAlign = 'left';

      // 2. Business Name (Top Line)
      ctx.font = 'bold 64px serif';
      ctx.fillStyle = COLORS.WHITE;
      ctx.fillText(vendor.companyName.toUpperCase(), textStartX, nameY);

      // 3. City & State (2nd Line)
      ctx.font = '32px sans-serif';
      ctx.fillStyle = COLORS.WARM_SAND;
      ctx.fillText(`${vendor.city}, ${vendor.state}`, textStartX, locationY);

      // 4. Unique ID (3rd Line)
      ctx.font = '24px monospace';
      ctx.fillStyle = COLORS.EMERALD; 
      ctx.fillText(`ID: ${vendor.uniqueId}`, textStartX, idY);

      // --- COMPRESSION PIPELINE ---
      const buffer = canvas.toBuffer('image/png');
      const filename = `elite_badge_${badgeNumber}.png`;
      
      await sharp(buffer)
        .png({ palette: true, quality: 80, compressionLevel: 9 })
        .toFile(path.join(OUTPUT_DIR, filename));
      
      process.stdout.write(`[+] Optimized: ${filename}\r`);
    }

    console.log('\nDeployment Complete: Optimized badges rendered in public/generated-badges/');
  } catch (error) {
    console.error('\nFatal error during badge generation:', error);
  }
}

generateBadges();
