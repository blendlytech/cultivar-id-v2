const supabaseUrl = 'https://dkdrvfemtyuapzuwyrgt.supabase.co'
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZHJ2ZmVtdHl1YXp1d3lyZ3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcxMzYyNTM3OSwiZXhwIjoyMDI5MTkzNzc5fQ.fHRxRdGVPfSWgdD8RgAPG638XVstsCrrsfGi2x6gfis'

async function checkTables() {
  const res = await fetch(`${supabaseUrl}/rest/v1/vendors?select=id&limit=1`, {
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`
    }
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error fetching vendors:', res.status, errorText);
    process.exit(1);
  }
  
  const data = await res.json();
  console.log('Vendors table exists. Data:', data);
}

checkTables()
