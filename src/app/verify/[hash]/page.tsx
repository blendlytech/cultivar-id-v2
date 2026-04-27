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
  const [user, setUser] = useState<any>(null);
  const [collector, setCollector] = useState<any>(null);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: col } = await supabase
          .from('collectors')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        setCollector(col);
      }
    }
    getUser();
  }, []);

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

  const handleClaim = async () => {
    if (!user) {
      window.location.href = `/signup?redirect=/verify/${params.hash}&interest=${encodeURIComponent(passport.specimen_name)}`;
      return;
    }

    setClaimLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/passports/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ verification_hash: params.hash })
      });

      const result = await response.json();

      if (result.success) {
        setClaimSuccess(true);
        // Update local passport state
        setPassport({ ...passport, current_owner_id: collector.id });
      } else {
        alert(result.error || "Failed to claim specimen");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while claiming.");
    } finally {
      setClaimLoading(false);
    }
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

            {/* Claim Specimen Section (The Moment of Transfer) */}
            <div className="onboarding-card" style={{ 
              padding: '3rem', 
              border: passport.current_owner_id ? '1px solid var(--glass-border)' : '2px solid var(--gold)', 
              background: 'linear-gradient(135deg, #0a1f18, #050505)', 
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}>
              {passport.current_owner_id ? (
                <>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>🛡️</div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', marginBottom: '1rem', color: 'white' }}>Specimen Claimed</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
                    This specimen is officially registered to a private collection. Its provenance is secured and tracked on the CultivarID ledger.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <div style={{ background: 'rgba(46, 204, 113, 0.1)', border: '1px solid #2ecc71', color: '#2ecc71', padding: '0.8rem 2rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                      ✓ VERIFIED OWNERSHIP
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>✨</div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', marginBottom: '1rem', color: 'white' }}>Claim Ownership</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
                    Did you acquire this specimen? Claim it now to add it to your official digital collection, unlock growth tracking, and secure its provenance.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button 
                      onClick={handleClaim} 
                      disabled={claimLoading}
                      className="btn-primary" 
                      style={{ padding: '1.2rem 3rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem' }}
                    >
                      {claimLoading ? 'Processing...' : claimSuccess ? 'Success!' : 'Claim this Specimen'} <CheckCircle size={18} />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Restock Alert Section (Only if not claimed and status is sold) */}
            {!passport.current_owner_id && passport.inventory?.status === 'sold' && (
                <div className="onboarding-card" style={{ padding: '2rem', border: '1px solid var(--glass-border)', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                  <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Not your plant? Join the waitlist for more stock.
                  </p>
                  <form onSubmit={handleRestockSignup} style={{ display: 'flex', gap: '0.75rem', maxWidth: '400px', margin: '0 auto' }}>
                    <input type="email" required placeholder="Email address" style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white' }} />
                    <button type="submit" className="btn-ghost" style={{ fontSize: '0.8rem' }}>Notify Me</button>
                  </form>
                </div>
            )}
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
                onClick={() => {
                  const win = window.open('', '_blank');
                  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href)}`;
                  const vendorLogo = passport.vendors?.logo_url || '';
                  const vendorName = passport.vendors?.name || 'Rare Plant Vendors';
                  const dateStr = new Date(passport.issued_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                  
                  win?.document.write(`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <title>Certificate of Authenticity - ${passport.specimen_name}</title>
                        <style>
                          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;600;700&display=swap');
                          body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #e0e0e0; font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                          /* A4 Size */
                          .certificate { width: 210mm; height: 297mm; background: #fafaf8; padding: 20mm; box-sizing: border-box; position: relative; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
                          .border-inner { border: 2px solid #c9a84c; height: 100%; box-sizing: border-box; padding: 15mm; display: flex; flex-direction: column; position: relative; }
                          .border-inner::before { content: ''; position: absolute; top: 4px; left: 4px; right: 4px; bottom: 4px; border: 1px solid rgba(201,168,76,0.4); pointer-events: none; }
                          .header { text-align: center; margin-bottom: 15mm; }
                          .logo { width: 25mm; height: 25mm; border-radius: 50%; object-fit: cover; border: 2px solid #c9a84c; margin-bottom: 5mm; }
                          .brand { font-size: 14pt; font-weight: 700; color: #0a1a0f; text-transform: uppercase; letter-spacing: 0.15em; }
                          .title { font-family: 'Playfair Display', serif; font-size: 36pt; color: #c9a84c; margin: 10mm 0 5mm; font-style: italic; text-align: center; font-weight: 400; }
                          .subtitle { text-align: center; font-size: 11pt; color: #333; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 20mm; }
                          .specimen-name { font-family: 'Playfair Display', serif; font-size: 42pt; color: #0a1a0f; text-align: center; margin: 0 0 5mm; font-weight: 700; line-height: 1.1; }
                          .variety { text-align: center; font-size: 14pt; color: #666; font-style: italic; margin-bottom: 20mm; }
                          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10mm; margin-bottom: 20mm; }
                          .detail-item { border-bottom: 1px solid #e0e0e0; padding-bottom: 3mm; }
                          .detail-label { font-size: 8pt; color: #999; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 2mm; }
                          .detail-value { font-size: 12pt; color: #0a1a0f; font-weight: 600; }
                          .footer-grid { display: grid; grid-template-columns: 1fr auto 1fr; align-items: end; margin-top: auto; }
                          .signature-line { border-top: 1px solid #0a1a0f; width: 100%; margin-bottom: 2mm; }
                          .signature-label { font-size: 9pt; color: #666; text-transform: uppercase; letter-spacing: 0.1em; }
                          .qr-wrapper { text-align: center; }
                          .qr { width: 35mm; height: 35mm; display: block; margin: 0 auto 3mm; }
                          .hash { font-family: monospace; font-size: 12pt; color: #c9a84c; letter-spacing: 0.1em; font-weight: 700; background: #0a1a0f; padding: 2mm 4mm; display: inline-block; color: white; border-radius: 2mm; }
                          @media print {
                            body { background: none; display: block; }
                            .certificate { margin: 0; box-shadow: none; padding: 10mm; width: 100%; height: 100%; }
                            @page { margin: 0; size: A4 portrait; }
                          }
                        </style>
                      </head>
                      <body>
                        <div class="certificate">
                          <div class="border-inner">
                            <div class="header">
                              ${vendorLogo ? `<img src="${vendorLogo}" class="logo" />` : ''}
                              <div class="brand">${vendorName}</div>
                            </div>
                            
                            <h1 class="title">Certificate of Authenticity</h1>
                            <div class="subtitle">Official CultivarID Registry Document</div>
                            
                            <div class="specimen-name">${passport.specimen_name}</div>
                            <div class="variety">${passport.inventory?.variety || 'Registered Specimen'}</div>
                            
                            <div class="details-grid">
                              <div class="detail-item">
                                <div class="detail-label">Propagation Method</div>
                                <div class="detail-value">${passport.propagation_method}</div>
                              </div>
                              <div class="detail-item">
                                <div class="detail-label">Genetic Lineage / Origin</div>
                                <div class="detail-value">${passport.mother_plant_origin || 'Original Stock'}</div>
                              </div>
                              <div class="detail-item">
                                <div class="detail-label">Registration Date</div>
                                <div class="detail-value">${dateStr}</div>
                              </div>
                              <div class="detail-item">
                                <div class="detail-label">Nursery Location</div>
                                <div class="detail-value">${passport.vendors?.location_city || ''}, ${passport.vendors?.location_state || ''}</div>
                              </div>
                            </div>
                            
                            <div class="footer-grid">
                              <div style="padding-right: 20mm;">
                                <div class="signature-line"></div>
                                <div class="signature-label">Authorized Signature</div>
                              </div>
                              <div class="qr-wrapper">
                                <img src="${qrUrl}" class="qr" />
                                <div class="hash">${passport.verification_hash.toUpperCase()}</div>
                                <div style="font-size: 8pt; margin-top: 2mm; color: #666; letter-spacing: 0.1em;">SCAN TO VERIFY</div>
                              </div>
                              <div style="text-align: right; font-size: 9pt; color: #999; line-height: 1.5; padding-left: 10mm;">
                                This document certifies that the botanical specimen described above is authentic and has been registered on the secure CultivarID ledger.
                              </div>
                            </div>
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
                className="btn-ghost" 
                style={{ width: '100%', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', border: '1px solid var(--gold)', color: 'var(--gold)' }}
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
