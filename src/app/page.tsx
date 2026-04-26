import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ShieldCheck, MapPin, TrendingUp, ChevronRight, Star, ArrowRight, Zap, Lock, Map } from 'lucide-react';

export const revalidate = 60;

export default async function Home() {
  const supabase = createClient();

  const { data: dbEvents } = await supabase
    .from('events')
    .select('id, title, slug, description, event_type, is_featured, location_name, date_start')
    .order('date_start', { ascending: true })
    .limit(3);

  const { data: dbVendors } = await supabase
    .from('vendors')
    .select('id, name, slug, specialty, is_verified, account_tier')
    .order('account_tier', { ascending: false })
    .limit(6);

  const events = dbEvents || [];
  const vendors = dbVendors || [];

  return (
    <div className="page-wrapper" style={{ overflow: 'hidden' }}>
      
      {/* ─── MIAMI FESTIVAL EMERGENCY ALERT ─── */}
      <div style={{ 
        background: 'var(--gold)', 
        color: 'black', 
        padding: '0.75rem 5%', 
        textAlign: 'center', 
        fontSize: '0.8rem', 
        fontWeight: 800, 
        letterSpacing: '0.15em',
        position: 'sticky',
        top: '80px',
        zIndex: 900,
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem'
      }}>
        <span>MIAMI FESTIVAL PUSH: 37/66 VENDORS SECURED</span>
        <Link href="/miami" style={{ 
          background: 'black', 
          color: 'white', 
          padding: '0.3rem 1rem', 
          borderRadius: '4px',
          textDecoration: 'none',
          fontSize: '0.7rem'
        }}>
          CLAIM YOUR 24H SETUP →
        </Link>
      </div>
      
      {/* ─── HERO SECTION: CULTIVAR ID RELEASE ─── */}
      <section className="hero" style={{ 
        paddingTop: '10rem', 
        paddingBottom: '6rem',
        position: 'relative' 
      }}>
        <div className="hero-grid-overlay" style={{ opacity: 0.15 }}></div>
        
        {/* Decorative Luxury Accents */}
        <div style={{ 
          position: 'absolute', 
          top: '15%', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          width: '80vw', 
          height: '40vh', 
          background: 'radial-gradient(circle, var(--gold-dim) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0
        }}></div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <div className="hero-eyebrow" style={{ margin: '0 auto 2.5rem' }}>
            <div className="hero-eyebrow-dot"></div>
            <span>Official Release</span>
          </div>
          
          <h1 style={{ 
            fontSize: 'clamp(3rem, 8vw, 6.5rem)', 
            marginBottom: '1.5rem',
            letterSpacing: '-0.03em',
            fontWeight: 700,
            lineHeight: 1.1
          }}>
            Introducing <br />
            <em style={{ 
              display: 'inline-block',
              background: 'linear-gradient(135deg, var(--gold) 0%, #F2D681 50%, var(--gold) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontStyle: 'italic',
              animation: 'shimmer 4s linear infinite'
            }}>CultivarID</em>
          </h1>
          
          <p className="hero-sub" style={{ 
            maxWidth: '700px', 
            margin: '0 auto 4rem',
            fontSize: '1.25rem', 
            opacity: 0.9,
            lineHeight: 1.6
          }}>
            The definitive digital passport for botanical provenance. 
            Secure your legacy, verify your specimens, and connect directly with serious collectors.
          </p>
        </div>
      </section>

      {/* ─── PRICING / SIGNUP FOCUS ─── */}
      <section className="section" id="pricing" style={{ padding: '4rem 5% 10rem', position: 'relative' }}>
        {/* Background Accent */}
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: '60vw', 
          height: '60vh', 
          background: 'radial-gradient(circle, var(--gold-dim) 0%, transparent 70%)',
          filter: 'blur(120px)',
          opacity: 0.4,
          zIndex: -1 
        }}></div>

        <div className="section-header" style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div className="hero-eyebrow" style={{ margin: '0 auto 1.5rem' }}>
            <div className="hero-eyebrow-dot"></div>
            <span>Limited Availability</span>
          </div>
          <h2 className="section-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>Choose Your <em>Botanical Legacy</em></h2>
          <p style={{ opacity: 0.8, maxWidth: '650px', margin: '1.5rem auto 0', fontSize: '1.1rem' }}>
            Secure your market position with our flexible tiers or join the elite founding circle.
          </p>
        </div>

        {/* ── ELITE FOUNDER PROMO ── */}
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto 5rem', 
          background: 'linear-gradient(135deg, #0B3D2E 0%, #040806 100%)',
          border: '4px solid var(--gold)',
          borderRadius: '40px',
          padding: '4rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '4rem',
          boxShadow: '0 30px 100px rgba(212,175,55,0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ flex: '1 1 500px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="scarcity-pill" style={{ background: 'var(--gold)', color: '#0B3D2E' }}>Elite Founder Pass</div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.1em' }}>17 SEATS REMAINING</span>
             </div>
             <h3 style={{ fontSize: '3rem', color: 'white', marginBottom: '1.5rem' }}>Lifetime Authority <br /> <em style={{ color: 'var(--gold)' }}>For a One-Time Fee.</em></h3>
             <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
               Skip the subscriptions. Secure everything in the **Canopy Tier** plus exclusive Founder-only perks for life. No renewals. No future fees.
             </p>
             <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', fontSize: '0.9rem', fontWeight: 600 }}>
                   <Star color="var(--gold)" /> Unlimited Plant Showcases
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', fontSize: '0.9rem', fontWeight: 600 }}>
                   <ShieldCheck color="var(--gold)" /> Permanent Founder Badge
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', fontSize: '0.9rem', fontWeight: 600 }}>
                   <Zap color="var(--gold)" /> Zero Platform Fees
                </div>
             </div>

             {/* 2026 Roadmap Lock-in */}
             <div style={{ 
               background: 'rgba(212,175,55,0.1)', 
               border: '1px dashed rgba(212,175,55,0.4)', 
               borderRadius: '16px', 
               padding: '1.5rem',
               display: 'flex',
               gap: '1rem',
               alignItems: 'flex-start'
             }}>
               <MapPin color="var(--gold)" size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
               <div>
                 <div style={{ color: 'var(--gold)', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '0.05em', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                   Included: 2026 Product Roadmap
                 </div>
                 <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                   Founders automatically unlock our upcoming <strong>Geo-Location Routing</strong> & Local Pickup Matchmaking algorithms. Never pay for future enterprise upgrades.
                 </div>
               </div>
             </div>
          </div>
          <div style={{ flex: '0 0 auto', textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '3rem', borderRadius: '32px', border: '1px solid rgba(212,175,55,0.2)' }}>
             <div style={{ textDecoration: 'line-through', opacity: 0.4, color: 'white', fontSize: '1.2rem', marginBottom: '0.5rem' }}>$1,248/yr</div>
             <div style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--gold)', lineHeight: 1 }}>$497</div>
             <div style={{ fontSize: '0.8rem', color: 'white', opacity: 0.6, marginTop: '0.5rem', letterSpacing: '0.1em' }}>PAID ONCE, OWNED FOREVER</div>
             <Link href="/onboarding?type=vendor&plan=elite" className="btn-primary" style={{ marginTop: '2.5rem', width: '100%', padding: '1.25rem', borderRadius: '16px', display: 'block' }}>
                Claim Lifetime Access
             </Link>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
          gap: '2.5rem',
          maxWidth: '1200px',
          margin: '0 auto',
          alignItems: 'stretch'
        }}>
          
          {/* Sprout Tier */}
          <div className="pricing-card pricing-card-glass" style={{ 
            padding: '4rem 2.5rem',
            borderRadius: '32px'
          }}>
            <div className="free-tier-badge" style={{ marginBottom: '1.5rem' }}>Starter</div>
            <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--text-primary)', fontWeight: 600 }}>Sprout</h3>
            <div className="pricing-price-display" style={{ color: 'var(--text-primary)' }}>$14.99<span style={{ fontSize: '1.2rem', opacity: 0.4 }}>/mo</span></div>
            <p style={{ color: 'var(--text-secondary)', opacity: 0.8, marginBottom: '2.5rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Digitize your booth in 5 minutes. Perfect for local markets and hobbyists.
            </p>
            <ul className="pricing-feature-list">
              <li className="pricing-feature-item" style={{ alignItems: 'flex-start' }}>
                <Star size={20} color="var(--gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>1 Plant Showcase</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '2px' }}>A dedicated digital page for your absolute best specimen.</div>
                </div>
              </li>
              <li className="pricing-feature-item" style={{ alignItems: 'flex-start' }}>
                <Map size={20} color="var(--gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>Vendor Linkpage</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '2px' }}>A mobile-first profile listing your nursery info and showcase.</div>
                </div>
              </li>
              <li className="pricing-feature-item" style={{ alignItems: 'flex-start' }}>
                <ShieldCheck size={20} color="var(--gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>Direct Inquiries</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '2px' }}>Allow collectors to email you directly from your profile.</div>
                </div>
              </li>
            </ul>
            <Link href="/onboarding?type=vendor&plan=sprout" className="btn-ghost" style={{ marginTop: 'auto', textAlign: 'center', width: '100%', padding: '1.25rem', borderRadius: '16px', fontSize: '0.85rem' }}>
              Start Growing
            </Link>
          </div>

          {/* Bloom Tier (Highlighted) */}
          <div className="pricing-card" style={{ 
            padding: '4rem 2.5rem',
            borderRadius: '32px',
            background: '#0B3D2E',
            border: '4px solid var(--gold)',
            transform: 'scale(1.05)',
            boxShadow: '0 20px 80px rgba(0,0,0,0.5)',
            color: 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div className="scarcity-pill" style={{ background: 'var(--gold)', color: '#0B3D2E' }}>Vendor Favorite</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.05em' }}>
                MOST POPULAR
              </div>
            </div>
            
            <h3 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', color: 'white', fontWeight: 700 }}>Bloom</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div className="pricing-price-display" style={{ color: 'var(--gold)', fontSize: '4.5rem' }}>$39</div>
              <div style={{ opacity: 0.6, fontSize: '1.2rem', color: 'white' }}>.99/mo</div>
            </div>
            
            <p style={{ color: 'white', opacity: 0.9, marginBottom: '2.5rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Advanced analytics and lead capture for established professionals.
            </p>

            <div style={{ 
              background: 'rgba(212, 175, 55, 0.05)', 
              border: '1px solid var(--gold-dim)', 
              borderRadius: '16px', 
              padding: '1.5rem',
              marginBottom: '2.5rem'
            }}>
              <ul className="pricing-feature-list" style={{ margin: 0, gap: '1.25rem' }}>
                <li className="pricing-feature-item highlight" style={{ alignItems: 'flex-start' }}>
                  <Star size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 700 }}>5 Plant Showcases</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '2px', color: 'white', fontWeight: 400 }}>Highlight your top 5 most valuable rare plants with dedicated pages.</div>
                  </div>
                </li>
                <li className="pricing-feature-item highlight" style={{ alignItems: 'flex-start' }}>
                  <TrendingUp size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 700 }}>Priority Directory</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '2px', color: 'white', fontWeight: 400 }}>Appear higher when collectors search for vendors in your region.</div>
                  </div>
                </li>
                <li className="pricing-feature-item highlight" style={{ alignItems: 'flex-start' }}>
                  <Zap size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 700 }}>5 Plant QRs</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '2px', color: 'white', fontWeight: 400 }}>Individual QR codes to display next to your featured plants.</div>
                  </div>
                </li>
                <li className="pricing-feature-item highlight" style={{ alignItems: 'flex-start' }}>
                  <Lock size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 700 }}>Basic Analytics</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '2px', color: 'white', fontWeight: 400 }}>Track how many times your profile and plant pages are viewed.</div>
                  </div>
                </li>
              </ul>
            </div>

            <Link href="/onboarding?type=vendor&plan=bloom" className="btn-primary" style={{ 
              marginTop: 'auto', 
              textAlign: 'center', 
              width: '100%', 
              padding: '1.25rem', 
              borderRadius: '16px', 
              fontSize: '0.9rem',
              letterSpacing: '0.1em'
            }}>
              Scale Your Nursery
            </Link>
          </div>

          {/* Canopy Tier */}
          <div className="pricing-card pricing-card-glass" style={{ 
            padding: '4rem 2.5rem',
            borderRadius: '32px'
          }}>
            <div style={{ marginBottom: '1.5rem', color: 'var(--sand)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Enterprise</div>
            <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--text-primary)', fontWeight: 600 }}>Canopy</h3>
            <div className="pricing-price-display" style={{ color: 'var(--text-primary)' }}>$129<span style={{ fontSize: '1.2rem', opacity: 0.4 }}>.99/mo</span></div>
            <p style={{ color: 'var(--text-secondary)', opacity: 0.8, marginBottom: '2.5rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
              White-label infrastructure for massive greenhouse operations.
            </p>
            <ul className="pricing-feature-list">
              <li className="pricing-feature-item" style={{ alignItems: 'flex-start' }}>
                <Star size={20} color="var(--gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>15 Plant Showcases</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '2px' }}>Showcase a wider variety of your premium specimens.</div>
                </div>
              </li>
              <li className="pricing-feature-item" style={{ alignItems: 'flex-start' }}>
                <MapPin size={20} color="var(--gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>Featured Spot</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '2px' }}>Get rotated in the "Featured Vendors" section on the homepage.</div>
                </div>
              </li>
              <li className="pricing-feature-item" style={{ alignItems: 'flex-start' }}>
                <Zap size={20} color="var(--gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>Advanced Analytics</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '2px' }}>See detailed geographic and temporal data on your page views.</div>
                </div>
              </li>
            </ul>
            <Link href="/onboarding?type=vendor&plan=canopy" className="btn-ghost" style={{ marginTop: 'auto', textAlign: 'center', width: '100%', padding: '1.25rem', borderRadius: '16px', fontSize: '0.85rem' }}>
              Request Enterprise Access
            </Link>
          </div>

        </div>
      </section>

      {/* ─── TICKER BAR ─── */}
      <div className="ticker-bar" style={{ padding: '1.25rem 0', background: 'var(--charcoal)', borderTop: '1px solid var(--gold-dim)' }}>
        <div className="ticker-track" style={{ animationDuration: '40s' }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="ticker-item" style={{ fontSize: '0.8rem', letterSpacing: '0.2em' }}>
              <span style={{ color: 'var(--gold)' }}>CultivarID</span> Release <div className="ticker-dot"></div>
              <span style={{ color: 'var(--gold)' }}>50</span> Lifetime Access Passes <div className="ticker-dot"></div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── CTA SECTION: THE CLOSER ─── */}
      <section className="cta-section" style={{ padding: '10rem 5%', textAlign: 'center', background: 'radial-gradient(circle at center, #0B3D2E 0%, #040806 100%)' }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ marginBottom: '3rem', position: 'relative', display: 'inline-block' }}>
            <div style={{ 
              position: 'absolute', 
              inset: '-20px', 
              background: 'var(--gold-dim)', 
              filter: 'blur(30px)', 
              borderRadius: '50%',
              zIndex: -1 
            }}></div>
            <Image 
              src="/brand-seal.png" 
              alt="Rare Plant Vendors Official Seal" 
              width={140} 
              height={140} 
              style={{ filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.4))' }}
            />
          </div>
          
          <h2 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
            lineHeight: 1.1, 
            marginBottom: '1.5rem',
            color: 'white'
          }}>
            Secure Your <br />
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Founding Legacy</em>
          </h2>
          
          <p style={{ 
            opacity: 0.9, 
            marginBottom: '3.5rem', 
            fontSize: '1.2rem', 
            maxWidth: '600px', 
            margin: '0 auto 3.5rem',
            color: 'var(--cream)'
          }}>
            Only <span style={{ color: 'var(--gold)', fontWeight: 700 }}>17</span> Founding Seats remain. <br />
            Join the elite circle of verified plant professionals today.
          </p>
          
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/onboarding?type=vendor&plan=founder" className="btn-primary" style={{ 
              padding: '1.25rem 3.5rem', 
              borderRadius: '16px', 
              fontSize: '1rem',
              boxShadow: '0 10px 40px rgba(212,175,55,0.3)'
            }}>
              Claim Lifetime Access
            </Link>
            <Link href="/about" className="btn-ghost" style={{ 
              padding: '1.25rem 3.5rem', 
              borderRadius: '16px', 
              fontSize: '1rem'
            }}>
              View Full Benefits
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
