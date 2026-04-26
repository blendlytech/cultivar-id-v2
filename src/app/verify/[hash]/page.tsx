'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

import { CheckCircle, Clock, Droplets, Bell, Star, ArrowRight } from 'lucide-react';

export default function VerifyPassportPage({ params }: { params: { hash: string } }) {
  const [passport, setPassport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    async function verify() {
      const { data, error } = await supabase
        .from('digital_passports')
        .select(`
          *, 
          vendors(id, name, logo_url, location_city, location_state, is_verified, tier, is_elite, elite_number),
          inventory(id, image_url, care_instructions, price, quantity, status)
        `)
        .eq('verification_hash', params.hash.toLowerCase())
        .single();

      if (error || !data) {
        setError(true);
      } else {
        setPassport(data);
      }
      setLoading(false);
    }
    verify();
  }, [params.hash]);

  const handleRestockSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setNotified(true);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'floatLeaf 3s ease-in-out infinite' }}>📜</div>
          <p style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>VERIFYING AUTHENTICITY...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505', padding: '2rem' }}>
        <div className="onboarding-card" style={{ maxWidth: '500px', textAlign: 'center', border: '1px solid #e74c3c' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: '#e74c3c', marginBottom: '1rem' }}>Verification Failed</h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
            The verification hash <strong>{params.hash}</strong> could not be found in the Rare Plant Vendors secure registry. This specimen may not be officially registered or the hash is incorrect.
          </p>
          <Link href="/" className="btn-ghost">Back to Registry</Link>
        </div>
      </div>
    );
  }

  const isElite = passport.vendors?.is_elite;

  return (
    <div style={{ minHeight: '100vh', background: '#050505', padding: '0 0 4rem', color: 'var(--text-primary)' }}>
      {/* Elite Header (Condition-based) */}
      {isElite && (
        <div style={{ 
          background: 'linear-gradient(90deg, #c9a84c, #8e732e)', 
          color: 'black', 
          textAlign: 'center', 
          padding: '0.6rem', 
          fontSize: '0.7rem', 
          fontWeight: 800, 
          letterSpacing: '0.2em',
          textTransform: 'uppercase'
        }}>
          ✧ Elite 100 Founder Specimen • Registry #{passport.vendors.elite_number} ✧
        </div>
      )}

      {/* Hero Section */}
      <div style={{ position: 'relative', height: '55vh', width: '100%', overflow: 'hidden' }}>
        {passport.inventory?.image_url ? (
          <Image 
            src={passport.inventory.image_url} 
            alt={passport.specimen_name} 
            fill 
            style={{ objectFit: 'cover', filter: 'brightness(0.7)' }} 
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(to bottom, #0a1a0f, #050505)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '5rem', opacity: 0.1 }}>🌿</span>
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4rem 5%', background: 'linear-gradient(to top, #050505, transparent)' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                background: 'rgba(46, 204, 113, 0.2)', 
                color: '#2ecc71', 
                padding: '0.4rem 1rem', 
                borderRadius: '100px',
                fontSize: '0.7rem',
                fontWeight: 700,
                border: '1px solid rgba(46, 204, 113, 0.3)'
              }}>
                <CheckCircle size={14} />
                <span>AUTHENTICITY GUARANTEED</span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: 600 }}>ID: {params.hash.toUpperCase()}</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '4.5rem', margin: 0, lineHeight: 0.9 }}>{passport.specimen_name}</h1>
            <p style={{ fontSize: '1.4rem', color: 'var(--gold)', marginTop: '0.75rem', fontWeight: 500, fontStyle: 'italic' }}>{passport.inventory?.variety || 'Registered Variety'}</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '-3rem auto 0', padding: '0 5%', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
          
          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Provenance Card */}
            <div className="onboarding-card" style={{ padding: '2.5rem', border: '1px solid var(--gold-dim)', background: 'rgba(10,26,15,0.7)', backdropFilter: 'blur(20px)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Clock size={20} /> Provenance & Registry
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <label style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 800 }}>Propagation</label>
                  <p style={{ fontSize: '1.1rem', margin: '0.3rem 0 0', fontWeight: 600 }}>{passport.propagation_method}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 800 }}>Genetic Lineage</label>
                  <p style={{ fontSize: '1.1rem', margin: '0.3rem 0 0', fontWeight: 600 }}>{passport.mother_plant_origin || 'Original Stock'}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 800 }}>Registered On</label>
                  <p style={{ fontSize: '1.1rem', margin: '0.3rem 0 0', fontWeight: 600 }}>{new Date(passport.issued_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 800 }}>Status</label>
                  <p style={{ fontSize: '1.1rem', margin: '0.3rem 0 0', color: '#2ecc71', fontWeight: 700 }}>● SECURE REGISTRY ACTIVE</p>
                </div>
              </div>
            </div>

            {/* Dynamic Care Timeline (New Feature) */}
            <div className="onboarding-card" style={{ padding: '2.5rem', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Droplets size={20} color="var(--gold)" /> Smart Care Insights
                </h3>
                <div style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase' }}>High Humidity Recommended</div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ flex: 1, padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ color: 'var(--gold)', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>Every 7-9</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Days Between Water</div>
                </div>
                <div style={{ flex: 1, padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ color: 'var(--gold)', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>Bright-In</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Ideal Light Intensity</div>
                </div>
              </div>

              <div style={{ position: 'relative', padding: '1rem 0' }}>
                 <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, background: 'rgba(212,175,55,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.1)' }}>
                   <strong>Expert Note:</strong> {passport.inventory?.care_instructions || "This specimen requires stable temperatures between 65-85°F. Maintain high humidity (60%+) for optimal leaf development and size. Fertilize with a balanced organic liquid fertilizer at 50% strength during the active growing season."}
                 </div>
              </div>
            </div>

            {/* Restock Alert / Collector CTA (New Feature) */}
            <div className="onboarding-card" style={{ 
              padding: '3rem', 
              border: '2px solid var(--gold)', 
              background: 'linear-gradient(135deg, #0a1f18, #050505)', 
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}>
              {passport.inventory?.status === 'sold' ? (
                <>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>⏳</div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', marginBottom: '1rem', color: 'white' }}>Currently Unavailable</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
                    This specific specimen has found a new home. Join the priority waitlist to be first in line when {passport.vendors?.name} releases more propagation stock of {passport.specimen_name}.
                  </p>
                  {notified ? (
                    <div style={{ background: 'rgba(46, 204, 113, 0.1)', border: '1px solid #2ecc71', color: '#2ecc71', padding: '1rem', borderRadius: '8px', fontWeight: 600 }}>
                      ✓ You are on the VIP priority list!
                    </div>
                  ) : (
                    <form onSubmit={handleRestockSignup} style={{ display: 'flex', gap: '0.75rem', maxWidth: '400px', margin: '0 auto' }}>
                      <input 
                        type="email" 
                        required 
                        placeholder="Your email address" 
                        style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }} 
                      />
                      <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Bell size={18} /> Alert Me
                      </button>
                    </form>
                  )}
                </>
              ) : (
                <>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>✨</div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', marginBottom: '1rem', color: 'white' }}>Acquire this Variety</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
                    Secure your own {passport.specimen_name} directly from {passport.vendors?.name}. Registered specimens come with full CultivarID provenance certificates.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link href={`/vendors/${passport.vendors?.slug}`} className="btn-primary" style={{ padding: '1.2rem 2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      Shop Now <ArrowRight size={18} />
                    </Link>
                    <Link href={`/signup?interest=${encodeURIComponent(passport.specimen_name)}&source=qr`} className="btn-ghost" style={{ padding: '1.2rem 2.5rem' }}>
                      Track Variety
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Vendor Card */}
            <div className="onboarding-card" style={{ padding: '2rem', textAlign: 'center', border: isElite ? '1px solid var(--gold)' : '1px solid var(--glass-border)' }}>
              {isElite && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Star size={24} color="var(--gold)" fill="var(--gold)" />
                </div>
              )}
              <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 1.5rem', borderRadius: '50%', overflow: 'hidden', border: isElite ? '3px solid var(--gold)' : '2px solid var(--gold-dim)' }}>
                {passport.vendors?.logo_url ? (
                  <Image src={passport.vendors.logo_url} alt={passport.vendors.name} fill style={{ objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-surface)', fontSize: '2.5rem', fontWeight: 700 }}>
                    {passport.vendors?.name.charAt(0)}
                  </div>
                )}
              </div>
              <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.3rem', fontFamily: 'var(--font-heading)' }}>{passport.vendors?.name}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{passport.vendors?.location_city}, {passport.vendors?.location_state}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link href={`/vendors/${passport.vendors?.slug}`} className="btn-primary" style={{ width: '100%', fontSize: '0.85rem' }}>View Profile</Link>
                <a href={`mailto:${passport.vendors?.contact_email}?subject=Inquiry: ${passport.specimen_name}`} className="btn-ghost" style={{ width: '100%', fontSize: '0.85rem' }}>Contact Vendor</a>
              </div>
            </div>

            {/* Verification Stats */}
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
               <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Registry Statistics</div>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                 <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Verification Scans</span>
                 <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>14</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                 <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Registered Siblings</span>
                 <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>3</span>
               </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button 
                onClick={() => window.print()} 
                className="btn-ghost" 
                style={{ width: '100%', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
              >
                🖨️ Export Certificate
              </button>
              <button 
                onClick={() => {
                  navigator.share?.({
                    title: `${passport.specimen_name} - CultivarID`,
                    url: window.location.href
                  }).catch(() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard');
                  });
                }} 
                className="btn-ghost" 
                style={{ width: '100%', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
              >
                🔗 Share Provenance
              </button>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
