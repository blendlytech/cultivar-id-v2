'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { Download, ExternalLink, Printer } from 'lucide-react';

interface Passport {
  id: string;
  specimen_name: string;
  propagation_method: string;
  mother_plant_origin: string | null;
  verification_hash: string;
  issued_at: string;
  inventory?: { variety: string | null };
}

interface VendorInfo {
  name: string;
  logo_url: string | null;
  tier: string;
}

const TIER_LIMITS: Record<string, number> = { seedling: 0, verified: 5, pro: 20, elite: Infinity };

export default function PassportsDashboard() {
  const [passports, setPassports] = useState<Passport[]>([]);
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState<VendorInfo | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    specimen_name: '',
    propagation_method: 'Tissue Culture',
    mother_plant_origin: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { window.location.href = '/login'; return; }

    const { data: vendorData } = await supabase
      .from('vendors')
      .select('name, logo_url, tier')
      .eq('contact_email', session.user.email)
      .single();

    if (vendorData) {
      setVendor({
        name: vendorData.name,
        logo_url: vendorData.logo_url,
        tier: vendorData.tier || 'seedling'
      });
    }

    try {
      const res = await fetch('/api/passports', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      const data = await res.json();
      if (data.passports) setPassports(data.passports);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  const vendorTier = vendor?.tier || 'seedling';
  const limit = TIER_LIMITS[vendorTier] || 0;
  
  // Calculate current month's usage
  const currentMonthPassports = passports.filter(p => {
    const issued = new Date(p.issued_at);
    const now = new Date();
    return issued.getMonth() === now.getMonth() && issued.getFullYear() === now.getFullYear();
  }).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const res = await fetch('/api/passports', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(formData)
      });
      const result = await res.json();

      if (res.ok) {
        setSuccess('Digital Passport issued successfully!');
        setFormData({ specimen_name: '', propagation_method: 'Tissue Culture', mother_plant_origin: '' });
        setShowForm(false);
        loadData(); // Reload list
      } else {
        setError(result.error || 'Failed to issue passport.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setIsSubmitting(false);
  };

  const navItems = [
    { href: '/dashboard', label: '⚡ Overview' },
    { href: '/dashboard/inventory', label: '🌿 Inventory' },
    { href: '/dashboard/leads', label: '🎯 Leads' },
    { href: '/dashboard/passports', label: '📜 Passports', active: true },
    { href: '/dashboard/analytics', label: '📊 Analytics' },
    { href: '/dashboard/settings', label: '⚙️ Settings' },
  ];

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Loading...</p></div>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '240px', flexShrink: 0, background: 'var(--bg-surface)', borderRight: '1px solid var(--glass-border)', padding: '7rem 1.5rem 2rem', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Vendor Portal
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Provenance Records
          </div>
        </div>
        {navItems.map(item => (
          <Link key={item.href} href={item.href} style={{
            display: 'block', padding: '0.65rem 1rem', borderRadius: '8px', textDecoration: 'none',
            fontSize: '0.88rem', fontWeight: item.active ? 700 : 500,
            color: item.active ? 'var(--text-primary)' : 'var(--text-secondary)',
            background: item.active ? 'rgba(255,255,255,0.07)' : 'transparent',
            marginBottom: '0.25rem',
            transition: 'all 0.15s ease',
          }}>
            {item.label}
          </Link>
        ))}
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '7rem 3rem 4rem', maxWidth: '900px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.4rem' }}>
              Provenance & Authentication
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', margin: 0, color: 'var(--text-primary)' }}>Digital Passports</h1>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="btn-primary"
            disabled={limit > 0 && currentMonthPassports >= limit}
            style={{ opacity: (limit > 0 && currentMonthPassports >= limit) ? 0.5 : 1 }}
          >
            {showForm ? 'Cancel' : 'Issue New Passport'}
          </button>
        </div>

        {/* Tier Stats */}
        <div style={{ background: 'var(--bg-surface)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Current Tier: </span>
            <span style={{ textTransform: 'capitalize', fontWeight: 600, color: vendorTier === 'elite' ? 'var(--gold)' : 'var(--emerald)' }}>{vendorTier}</span>
          </div>
          <div style={{ fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Monthly Limit: </span>
            <span style={{ fontWeight: 600 }}>
              {limit === 0 ? '0' : limit === Infinity ? 'Unlimited' : `${currentMonthPassports} / ${limit}`}
            </span>
          </div>
        </div>

        {error && <div style={{ padding: '1rem', background: 'rgba(231,76,60,0.1)', color: '#e74c3c', border: '1px solid rgba(231,76,60,0.2)', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
        {success && <div style={{ padding: '1rem', background: 'rgba(46,204,113,0.1)', color: '#2ecc71', border: '1px solid rgba(46,204,113,0.2)', borderRadius: '8px', marginBottom: '1rem' }}>{success}</div>}

        {/* Issue Form */}
        {showForm && limit > 0 && (
          <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--gold)', marginBottom: '2rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', margin: '0 0 1.5rem', color: 'var(--gold)' }}>Create Authenticity Record</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Specimen/Species Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.specimen_name}
                  onChange={e => setFormData({...formData, specimen_name: e.target.value})}
                  placeholder="e.g. Monstera Obliqua Peru"
                  className="newsletter-input" 
                  style={{ width: '100%', maxWidth: 'none', background: 'rgba(0,0,0,0.2)' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Propagation Method</label>
                  <select 
                    value={formData.propagation_method}
                    onChange={e => setFormData({...formData, propagation_method: e.target.value})}
                    style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '30px', color: 'white' }}
                  >
                    <option value="Tissue Culture">Tissue Culture (TC)</option>
                    <option value="Stem Cutting">Stem Cutting</option>
                    <option value="Seed Grown">Seed Grown</option>
                    <option value="Division">Division</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Mother Plant Origin (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.mother_plant_origin}
                    onChange={e => setFormData({...formData, mother_plant_origin: e.target.value})}
                    placeholder="e.g. NSE Tropicals 2021"
                    className="newsletter-input" 
                    style={{ width: '100%', maxWidth: 'none', background: 'rgba(0,0,0,0.2)' }}
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
                {isSubmitting ? 'Issuing...' : 'Issue Digital Passport'}
              </button>
            </form>
          </div>
        )}

        {/* Passports List */}
        {passports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '1px dashed var(--glass-border)', borderRadius: '12px', color: 'var(--text-secondary)' }}>
            <p>You haven't issued any Digital Passports yet.</p>
            {limit === 0 && <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>Upgrade to Verified to start issuing passports.</p>}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {passports.map(p => (
              <div key={p.id} className="onboarding-card" style={{ 
                padding: '0', 
                overflow: 'hidden', 
                border: '1px solid rgba(212,175,55,0.3)', 
                background: 'linear-gradient(145deg, rgba(20,20,20,0.95), rgba(11,61,46,0.2))',
                position: 'relative'
              }}>
                <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1, display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {/* QR Code Section */}
                    <div style={{ background: 'white', padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <QRCodeSVG 
                        value={`${window.location.origin}/verify/${p.verification_hash}`} 
                        size={80}
                        level="H"
                        includeMargin={false}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', margin: 0, color: 'var(--text-primary)' }}>{p.specimen_name}</h3>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.75rem' }}>
                        <div style={{ fontSize: '0.75rem' }}>
                          <span style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Origin:</span>
                          <span style={{ color: 'var(--text-primary)', marginLeft: '0.4rem', fontWeight: 500 }}>{p.mother_plant_origin || 'Unknown'}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem' }}>
                          <span style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Method:</span>
                          <span style={{ color: 'var(--text-primary)', marginLeft: '0.4rem', fontWeight: 500 }}>{p.propagation_method}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.8rem' }}>
                    <div style={{ 
                      fontFamily: 'monospace', 
                      fontSize: '0.9rem',
                      color: 'var(--gold)', 
                      background: 'rgba(212,175,55,0.1)', 
                      padding: '0.4rem 0.75rem', 
                      borderRadius: '4px',
                      border: '1px solid rgba(212,175,55,0.2)',
                    }}>
                      {p.verification_hash.toUpperCase()}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link 
                        href={`/verify/${p.verification_hash}`} 
                        target="_blank"
                        className="btn-ghost" 
                        style={{ padding: '0.4rem', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
                        title="View Showcase"
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <button 
                        className="btn-ghost" 
                        style={{ padding: '0.4rem', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
                        title="Print QR"
                        onClick={() => {
                          const win = window.open('', '_blank');
                          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${window.location.origin}/verify/${p.verification_hash}`)}`;
                          const vendorLogo = vendor?.logo_url || '';
                          const vendorName = vendor?.name || 'Rare Plant Vendors';
                          
                          win?.document.write(`
                            <html>
                              <head>
                                <title>Print Tag - ${p.specimen_name}</title>
                                <style>
                                  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600;700&display=swap');
                                  body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fff; font-family: 'Inter', sans-serif; }
                                  .tag { width: 350px; border: 3px solid #c9a84c; padding: 2.5rem; border-radius: 24px; text-align: center; position: relative; background: #fafaf8; box-sizing: border-box; }
                                  .header { display: flex; align-items: center; justify-content: center; gap: 0.8rem; margin-bottom: 1.5rem; }
                                  .nursery-logo { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid #c9a84c; }
                                  .nursery-name { font-size: 0.9rem; font-weight: 700; color: #0a1a0f; text-transform: uppercase; letter-spacing: 0.05em; }
                                  .specimen-name { font-family: 'Playfair Display', serif; font-size: 1.8rem; color: #0a1a0f; margin: 0 0 0.2rem; }
                                  .variety { font-size: 1rem; color: #c9a84c; font-weight: 600; margin-bottom: 1.5rem; }
                                  .qr-container { background: white; padding: 1rem; border-radius: 12px; display: inline-block; border: 1px solid #eee; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                                  .qr-image { width: 180px; height: 180px; display: block; }
                                  .footer { margin-top: 1.5rem; }
                                  .seal-text { font-size: 0.7rem; font-weight: 800; color: #c9a84c; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.5rem; }
                                  .hash { font-family: monospace; font-size: 1.1rem; color: #333; letter-spacing: 0.1em; background: #f0f0f0; padding: 0.3rem 0.6rem; border-radius: 4px; display: inline-block; }
                                  .instruction { font-size: 0.75rem; color: #666; margin-top: 1rem; font-weight: 600; }
                                  @media print { body { background: none; } .tag { border-color: #000; } }
                                </style>
                              </head>
                              <body>
                                <div class="tag">
                                  <div class="header">
                                    ${vendorLogo ? `<img src="${vendorLogo}" class="nursery-logo" />` : ''}
                                    <span class="nursery-name">${vendorName}</span>
                                  </div>
                                  <h2 class="specimen-name">${p.specimen_name}</h2>
                                  <div class="variety">${p.inventory?.variety || 'Authentic Specimen'}</div>
                                  <div class="qr-container">
                                    <img src="${qrUrl}" class="qr-image" />
                                  </div>
                                  <div class="footer">
                                    <div class="seal-text">Verified Provenance</div>
                                    <div class="hash">${p.verification_hash.toUpperCase()}</div>
                                    <p class="instruction">SCAN TO VERIFY REGISTRY RECORD</p>
                                  </div>
                                </div>
                                <script>
                                  window.onload = () => {
                                    setTimeout(() => { 
                                      window.print(); 
                                      window.close(); 
                                    }, 800);
                                  };
                                </script>
                              </body>
                            </html>
                          `);
                        }}
                      >
                        <Printer size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                <div style={{ 
                  padding: '0.75rem 1.5rem', 
                  background: 'rgba(0,0,0,0.3)', 
                  borderTop: '1px solid var(--glass-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)'
                }}>
                  <span>Issued on {new Date(p.issued_at).toLocaleDateString()}</span>
                  <Link href={`/verify/${p.verification_hash}`} style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>Public Verification Page →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
