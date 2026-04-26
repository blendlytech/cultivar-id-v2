import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { ShieldCheck, Star, Zap, Globe, MapPin, CheckCircle2, Lock, ArrowRight, TrendingUp } from 'lucide-react';
import PayPalButton from '../../components/PayPalButton';
import Image from 'next/image';

export default async function ClaimPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  // 1. Fetch vendor data
  const { data: vendor, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (error || !vendor) {
    notFound();
  }

  // If already verified, redirect or show "Already Claimed"
  const isAlreadyElite = vendor.is_elite || vendor.tier === 'elite';

  return (
    <main className="page-wrapper" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      
      {/* ─── SCARCITY BAR ─── */}
      <div style={{ 
        background: 'var(--charcoal)', 
        color: 'var(--gold)', 
        padding: '0.75rem 5%', 
        textAlign: 'center', 
        fontSize: '0.7rem', 
        fontWeight: 800, 
        letterSpacing: '0.15em', 
        textTransform: 'uppercase',
        borderBottom: '1px solid var(--gold-dim)',
        position: 'fixed',
        top: '80px',
        left: 0,
        right: 0,
        zIndex: 100
      }}>
        🔥 Priority Enrollment: Only 17 Founding Elite Seats Remaining
      </div>

      <section className="hero" style={{ paddingTop: '12rem', paddingBottom: '4rem' }}>
        <div className="hero-grid-overlay"></div>
        
        <div className="hero-eyebrow">
          <div className="hero-eyebrow-dot"></div>
          <span>Founders Circle · Pre-Authenticated Profile</span>
        </div>
        
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', marginBottom: '1.5rem' }}>
          Welcome, <em>{vendor.name}.</em>
        </h1>
        
        <p className="hero-sub" style={{ maxWidth: '700px' }}>
          We have pre-established your authority profile for the 2026 botanical season. 
          Claim your seat in the **Elite Founders Circle** to unlock digital provenance, 
          AI lead matching, and priority expo routing.
        </p>

        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div className="stat-item" style={{ border: 'none', background: 'var(--glass)', borderRadius: '16px', padding: '1.5rem 2.5rem' }}>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, marginBottom: '0.5rem' }}>Status</div>
                <div style={{ color: '#e07a5f', fontWeight: 800, fontSize: '1.2rem' }}>UNCLAIMED</div>
            </div>
            <div className="stat-item" style={{ border: 'none', background: 'var(--glass)', borderRadius: '16px', padding: '1.5rem 2.5rem' }}>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, marginBottom: '0.5rem' }}>Location</div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{vendor.location_city || 'Verified Vendor'}</div>
            </div>
        </div>
      </section>

      {/* ─── THE TRANSFORMATION ─── */}
      <section className="section" style={{ background: 'var(--bg-surface)' }}>
        <div className="section-header">
            <h2 className="section-title">From Merchant to <em>Authority.</em></h2>
            <p className="section-desc">See how your brand evolves when you join the Elite tier.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', maxWidth: '1200px', margin: '4rem auto' }}>
            
            {/* CURRENT STATUS */}
            <div style={{ opacity: 0.6, filter: 'grayscale(1)' }}>
                <div style={{ marginBottom: '1rem', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>CURRENT VIEW (RESTRICTED)</div>
                <div className="vendor-card" style={{ height: '400px' }}>
                    <div className="vendor-avatar" style={{ background: '#ccc' }}>{vendor.name.charAt(0)}</div>
                    <h3 className="vendor-name">{vendor.name}</h3>
                    <p className="vendor-specialty">{vendor.specialty?.[0] || 'Rare Plants'}</p>
                    <div style={{ marginTop: 'auto', padding: '1rem', border: '1px dashed #ccc', borderRadius: '8px', textAlign: 'center', fontSize: '0.7rem' }}>
                        DATA LOCKED
                    </div>
                </div>
            </div>

            {/* ELITE STATUS */}
            <div style={{ transform: 'scale(1.05)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-1.5rem', right: '1rem', background: 'var(--gold)', color: 'var(--charcoal)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 900, zIndex: 10, boxShadow: '0 10px 20px var(--gold-dim)' }}>
                    FOUNDER UPGRADE
                </div>
                <div style={{ marginBottom: '1rem', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--gold)' }}>ELITE PREVIEW (UNLOCKED)</div>
                <div className="vendor-card is-verified" style={{ height: '400px', borderColor: 'var(--gold)', background: 'var(--charcoal)', color: 'white' }}>
                    <div className="vendor-avatar" style={{ boxShadow: '0 0 20px var(--gold-dim)' }}>{vendor.name.charAt(0)}</div>
                    <h3 className="vendor-name" style={{ color: 'white' }}>{vendor.name}</h3>
                    <p className="vendor-specialty" style={{ color: 'var(--gold)' }}>{vendor.specialty?.[0] || 'Rare Plants'}</p>
                    
                    <div className="elite-badge" style={{ marginTop: '1rem', width: 'fit-content' }}>
                        <Star size={12} fill="var(--gold)" /> ELITE FOUNDER
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', opacity: 0.9 }}>
                            <CheckCircle2 size={14} color="var(--gold)" /> Digital Passport Enabled
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', opacity: 0.9 }}>
                            <CheckCircle2 size={14} color="var(--gold)" /> Priority Event Map Routing
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', opacity: 0.9 }}>
                            <CheckCircle2 size={14} color="var(--gold)" /> Featured Marketplace Spot
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto', padding: '1rem', background: 'var(--gold-dim)', border: '1px solid var(--gold)', borderRadius: '8px', textAlign: 'center', fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 800 }}>
                        CULTIVAR ID: ACTIVE
                    </div>
                </div>
            </div>

        </div>
      </section>

      {/* ─── THE OFFER ─── */}
      <section className="section" id="claim">
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div className="section-eyebrow">Exclusive Founder Invitation</div>
            <h2 className="section-title">Secure Your <em>Lifetime</em> Status.</h2>
            <p className="section-desc" style={{ marginBottom: '4rem' }}>
                Standard Elite access will be $998/year. As a pre-authenticated vendor, 
                you can secure **Lifetime Elite Status** today for a single payment of **$498**.
            </p>

            {isAlreadyElite ? (
                <div style={{ padding: '3rem', background: 'var(--glass)', borderRadius: '24px', border: '1px solid var(--gold)' }}>
                    <h3 style={{ color: 'var(--gold)', marginBottom: '1rem' }}>Profile Already Elite</h3>
                    <p>This profile has already been upgraded to Elite Status. Please log in to your dashboard.</p>
                </div>
            ) : (
                <div style={{ 
                    background: 'var(--bg-card)', 
                    border: '1px solid var(--gold)', 
                    borderRadius: '32px', 
                    padding: '4rem',
                    boxShadow: '0 40px 80px var(--gold-dim)',
                    textAlign: 'left'
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Elite Founders Package</h3>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none', padding: 0 }}>
                                <li style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                                    <Zap size={20} color="var(--gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                    <span><strong>Permanent</strong> Gold Pin on all event maps.</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                                    <Globe size={20} color="var(--gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                    <span><strong>CultivarID</strong> integration for your top 10 specimens.</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                                    <TrendingUp size={20} color="var(--gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                    <span><strong>AI Lead Matching</strong> direct to your inbox.</span>
                                </li>
                            </ul>
                        </div>
                        <div style={{ borderLeft: '1px solid var(--glass-border)', paddingLeft: '4rem' }}>
                            <div style={{ marginBottom: '2rem' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', textDecoration: 'line-through' }}>$998 USD / YEAR</div>
                                <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--gold)' }}>$498</div>
                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.1em' }}>ONE-TIME · LIFETIME ACCESS</div>
                            </div>
                            
                            <PayPalButton amount="497" vendorId={vendor.id} />
                            
                            <p style={{ marginTop: '1.5rem', fontSize: '0.65rem', opacity: 0.6, textAlign: 'center' }}>
                                Secure payment via PayPal · Instant Activation
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </section>

      {/* ─── FOOTER QUOTE ─── */}
      <section className="section" style={{ textAlign: 'center', opacity: 0.5 }}>
        <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontStyle: 'italic' }}>
            &ldquo;The rare plant market is moving to digital provenance. Don&apos;t be the booth left behind.&rdquo;
        </p>
      </section>

    </main>
  );
}
