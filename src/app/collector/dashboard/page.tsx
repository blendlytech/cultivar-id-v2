'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Sprout, History, Search, Plus } from 'lucide-react';

export default function CollectorDashboard() {
  const [passports, setPassports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [collector, setCollector] = useState<any>(null);

  useEffect(() => {
    loadCollection();
  }, []);

  async function loadCollection() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { window.location.href = '/login'; return; }

    const { data: col } = await supabase
      .from('collectors')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    setCollector(col);

    if (col) {
      const { data: pData } = await supabase
        .from('digital_passports')
        .select('*, vendors(name, logo_url), inventory(image_url, variety)')
        .eq('current_owner_id', col.id)
        .order('issued_at', { ascending: false });

      setPassports(pData || []);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505' }}>
        <p style={{ color: 'var(--gold)', letterSpacing: '0.2em', fontWeight: 600 }}>AUTHENTICATING COLLECTION...</p>
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: 'white', padding: '8rem 5% 4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.2em', color: 'var(--gold)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Collector Portal
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3.5rem', margin: 0 }}>My Private Collection</h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>{passports.length}</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.25rem' }}>Verified Specimens</div>
          </div>
        </div>

        {/* Collection Grid */}
        {passports.length === 0 ? (
          <div style={{ padding: '6rem 2rem', textAlign: 'center', border: '1px dashed rgba(212,175,55,0.2)', borderRadius: '16px', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🌿</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', marginBottom: '1rem' }}>Your Gallery is Empty</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '450px', margin: '0 auto 2.5rem', lineHeight: 1.6, fontSize: '1.1rem' }}>
              Claim ownership of your rare plants by scanning their CultivarID QR codes. Start building your digital provenance today.
            </p>
            <Link href="/scan" className="btn-primary" style={{ padding: '1.2rem 3rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
              <Plus size={20} /> Claim First Specimen
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2.5rem' }}>
            {passports.map(p => (
              <div key={p.id} className="onboarding-card" style={{ 
                padding: 0, 
                overflow: 'hidden', 
                border: '1px solid var(--glass-border)', 
                transition: 'all 0.3s ease',
                background: 'rgba(255,255,255,0.03)'
              }}>
                <div style={{ position: 'relative', height: '240px', width: '100%' }}>
                  {p.inventory?.image_url ? (
                    <Image src={p.inventory.image_url} alt={p.specimen_name} fill style={{ objectFit: 'cover' }} />
                  ) : (
                    <div style={{ height: '100%', background: 'linear-gradient(to bottom, #0a1a0f, #050505)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '4rem', opacity: 0.1 }}>🌿</span>
                    </div>
                  )}
                  <div style={{ 
                    position: 'absolute', 
                    top: '1rem', 
                    right: '1rem', 
                    background: 'rgba(0,0,0,0.7)', 
                    backdropFilter: 'blur(10px)', 
                    padding: '0.4rem 0.8rem', 
                    borderRadius: '4px', 
                    fontSize: '0.65rem', 
                    fontWeight: 800, 
                    color: 'var(--gold)', 
                    border: '1px solid rgba(212,175,55,0.3)',
                    letterSpacing: '0.1em'
                  }}>
                    ID: {p.verification_hash.toUpperCase()}
                  </div>
                </div>
                
                <div style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', margin: 0 }}>{p.specimen_name}</h3>
                    <Shield size={20} color="#2ecc71" fill="rgba(46, 204, 113, 0.2)" />
                  </div>
                  <p style={{ fontSize: '0.95rem', color: 'var(--gold)', marginBottom: '1.5rem', fontStyle: 'italic', fontWeight: 500 }}>
                    {p.inventory?.variety || 'Registered Authentic Variety'}
                  </p>
                  
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ position: 'relative', width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--gold-dim)' }}>
                            {p.vendors?.logo_url ? (
                              <Image src={p.vendors.logo_url} alt={p.vendors.name} fill style={{ objectFit: 'cover' }} />
                            ) : (
                              <div style={{ background: '#222', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem' }}>
                                {p.vendors?.name?.charAt(0)}
                              </div>
                            )}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{p.vendors?.name}</span>
                    </div>
                    <Link href={`/verify/${p.verification_hash}`} className="btn-ghost" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '6px' }}>View Passport</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions / Future Roadmap */}
        <div style={{ marginTop: '6rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="onboarding-card" style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}>
             <Sprout size={28} color="var(--gold)" style={{ marginBottom: '1.25rem' }} />
             <h4 style={{ margin: '0 0 0.75rem', fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>Wishlist Alerts</h4>
             <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>Track varieties you are hunting for and get direct alerts from vendors before they hit the general market.</p>
          </div>
          <div className="onboarding-card" style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}>
             <History size={28} color="var(--gold)" style={{ marginBottom: '1.25rem' }} />
             <h4 style={{ margin: '0 0 0.75rem', fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>Secure Trade</h4>
             <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>Transfer ownership of your specimens to other collectors while maintaining the verified provenance chain.</p>
          </div>
          <div className="onboarding-card" style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}>
             <Search size={28} color="var(--gold)" style={{ marginBottom: '1.25rem' }} />
             <h4 style={{ margin: '0 0 0.75rem', fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>Global Registry</h4>
             <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>Browse verified vendors and upcoming botanical events to find your next investment-grade specimen.</p>
          </div>
        </div>

      </div>
    </main>
  );
}
