'use client';

import { useState } from "react";
import { ShieldCheck, Zap, Star, Lock, ChevronRight, Globe, TrendingUp, MapPin, AlertCircle, Check } from 'lucide-react';
import Link from 'next/link';

export default function PricingToggle() {
  const [isAnnual, setIsAnnual] = useState(true);

  const tiers = [
    {
      name: "Sprout",
      planId: "sprout",
      badge: "Starter",
      icon: <Lock size={24} />,
      priceMonthly: 14.99,
      priceAnnual: 144,
      period: isAnnual ? "/yr" : "/mo",
      desc: "Perfect for weekend market hobbyists.",
      features: [
        { title: "1 Showcase Plant Profile", desc: "A dedicated public web page for your absolute best specimen.", included: true },
        { title: "Mobile Linkpage", desc: "A beautiful mobile-first profile page listing your nursery info.", included: true },
        { title: "1 Standard Plant QR", desc: "Print a QR code that links directly to your showcase plant.", included: true },
        { title: "Direct Email Inquiries", desc: "Allow collectors to contact you directly from your profile.", included: true },
        { title: "Priority Directory Placement", desc: "Appear higher in regional searches.", included: false },
        { title: "Detailed Analytics", desc: "Track profile and plant page views.", included: false },
      ],
      cta: "Get Sprout",
      highlight: false,
    },
    {
      name: "Bloom",
      planId: "bloom",
      badge: "Most Popular",
      icon: <TrendingUp size={24} />,
      priceMonthly: 39.99,
      priceAnnual: 384,
      period: isAnnual ? "/yr" : "/mo",
      desc: "The choice for established vendors.",
      features: [
        { title: "5 Showcase Plant Profiles", desc: "Highlight your top 5 most valuable rare plants with dedicated pages.", included: true },
        { title: "Priority Directory Placement", desc: "Appear higher when collectors search for vendors in your region.", included: true },
        { title: "5 Standard Plant QRs", desc: "Individual QR codes for your 5 featured plants.", included: true },
        { title: "Basic Scan Analytics", desc: "See how many times your profile and plant pages are viewed.", included: true },
        { title: "Featured Homepage Spot", desc: "Get rotated in the 'Featured Vendors' section.", included: false },
      ],
      cta: "Grow with Bloom",
      highlight: true,
      tag: "Recommended",
    },
    {
      name: "Canopy",
      planId: "canopy",
      badge: "Scale",
      icon: <Globe size={24} />,
      priceMonthly: 129.99,
      priceAnnual: 1248,
      period: isAnnual ? "/yr" : "/mo",
      desc: "Enterprise infrastructure for large nurseries.",
      features: [
        { title: "15 Showcase Plant Profiles", desc: "Showcase a wide variety of your premium specimens.", included: true },
        { title: "15 Standard Plant QRs", desc: "Individual QR codes for all your showcase plants.", included: true },
        { title: "Advanced Scan Analytics", desc: "See detailed geographic and temporal data on your QR scans.", included: true },
        { title: "Featured Homepage Spot", desc: "Get rotated in the 'Featured Vendors' section on the homepage.", included: true },
        { title: "Zero Platform Fees", desc: "Direct sales/inquiries with no platform cuts, ever.", included: false },
      ],
      cta: "Scale with Canopy",
      highlight: false,
    },
    {
      name: "Elite Founder",
      planId: "elite",
      badge: "Lifetime Access",
      icon: <Star size={24} />,
      priceMonthly: 497,
      priceAnnual: 497,
      period: "once",
      desc: "One-time investment. Owned forever.",
      features: [
        { title: "Unlimited Plant Profiles", desc: "Create beautiful digital pages for any premium plant you sell.", included: true },
        { title: "Permanent 'Founder' Badge", desc: "A special badge on your profile showing you were here from the start.", included: true },
        { title: "Zero Platform Fees", desc: "Direct sales/inquiries with no platform cuts, ever.", included: true },
        { title: "Concierge Onboarding", desc: "We manually input your first 10 plants and optimize your profile for you.", included: true },
      ],
      cta: "Claim Lifetime Seat",
      highlight: false,
      tag: "17 Seats Left",
      isElite: true,
    },
  ];

  const styles = {
    card: (highlight: boolean, isElite: boolean) => ({
      position: 'relative' as const,
      padding: '3rem 2rem',
      borderRadius: '24px',
      background: highlight ? 'var(--emerald)' : isElite ? 'var(--charcoal)' : 'var(--bg-card)',
      border: highlight ? '2px solid var(--gold)' : isElite ? '2px solid var(--gold)' : '1px solid var(--glass-border)',
      color: highlight ? 'white' : isElite ? 'white' : 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column' as const,
      transition: 'all 0.3s ease',
      boxShadow: highlight ? '0 20px 50px rgba(11,61,46,0.2)' : isElite ? '0 0 40px var(--gold-dim)' : 'var(--card-shadow)',
      scale: highlight ? '1.05' : '1',
      zIndex: highlight ? 2 : 1,
    }),
    toggle: {
      display: 'inline-flex',
      alignItems: 'center',
      background: 'var(--bg-surface)',
      padding: '0.4rem',
      borderRadius: '50px',
      border: '1px solid var(--glass-border)',
      marginBottom: '4rem',
    },
    toggleBtn: (active: boolean) => ({
      padding: '0.6rem 1.5rem',
      borderRadius: '50px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.75rem',
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase' as const,
      background: active ? 'var(--gold)' : 'transparent',
      color: active ? 'var(--charcoal)' : 'var(--text-secondary)',
      transition: 'all 0.2s ease',
    }),
    fomo: {
      maxWidth: '700px',
      margin: '0 auto 4rem',
      padding: '2.5rem',
      background: 'var(--gold-dim)',
      border: '1px solid var(--gold)',
      borderRadius: '20px',
      textAlign: 'center' as const,
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
      
      {/* FOMO Section */}
      <div style={styles.fomo}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--gold)' }}>
          <AlertCircle size={24} />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: 0, fontWeight: 700 }}>Don&apos;t Lose Sales to the Booth Next Door</h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
          The cost of <strong>Sprout</strong> is less than printing a single batch of flyers. 
          The real cost? The thousands in lost revenue because your neighbor booth has <strong>CultivarID</strong> to capture leads, and you don&apos;t.
        </p>
      </div>

      {/* Toggle */}
      <div style={{ textAlign: 'center' }}>
        <div style={styles.toggle}>
          <button onClick={() => setIsAnnual(false)} style={styles.toggleBtn(!isAnnual)}>Monthly</button>
          <button onClick={() => setIsAnnual(true)} style={styles.toggleBtn(isAnnual)}>
            Annually <span style={{ marginLeft: '0.5rem', opacity: 0.8, fontSize: '0.6rem' }}>Save 20%</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
        gap: '2rem', 
        alignItems: 'stretch',
        paddingBottom: '4rem'
      }}>
        {tiers.map((tier) => {
          const price = isAnnual ? tier.priceAnnual : tier.priceMonthly;
          const isElite = !!tier.isElite;
          
          return (
            <div key={tier.name} style={styles.card(tier.highlight, isElite)}>
              {tier.tag && (
                <div style={{ 
                  position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                  background: tier.highlight ? 'var(--gold)' : 'var(--emerald)',
                  color: tier.highlight ? 'var(--charcoal)' : 'white',
                  padding: '0.3rem 1rem', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 800,
                  letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap'
                }}>
                  {tier.tag}
                </div>
              )}

              <div style={{ marginBottom: '2rem' }}>
                <div style={{ color: tier.highlight ? 'var(--gold)' : 'var(--gold)', marginBottom: '1rem' }}>
                  {tier.icon}
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', margin: '0 0 0.5rem' }}>{tier.name}</h3>
                <p style={{ fontSize: '0.8rem', opacity: 0.8, lineHeight: 1.4 }}>{tier.desc}</p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>$</span>
                  <span style={{ fontSize: '3rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                    {Math.floor(price)}
                  </span>
                  <span style={{ fontSize: '1rem', opacity: 0.7 }}>{tier.period}</span>
                </div>
                {isAnnual && tier.period !== "once" && (
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: (tier.highlight || isElite) ? 'white' : 'var(--emerald)', marginTop: '0.5rem' }}>
                    Billed Annually
                  </div>
                )}
              </div>

              <Link 
                href={`/onboarding?plan=${tier.planId}`}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  padding: '1rem', borderRadius: '12px', background: tier.highlight ? 'var(--gold)' : isElite ? 'var(--gold)' : 'var(--emerald)',
                  color: tier.highlight ? 'var(--charcoal)' : isElite ? 'var(--charcoal)' : 'white',
                  textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem', marginBottom: '2rem',
                  transition: 'all 0.2s ease', textAlign: 'center'
                }}
              >
                {tier.cta} <ChevronRight size={16} />
              </Link>

              <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, marginBottom: '1rem' }}>
                What&apos;s included:
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {tier.features.map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.82rem', opacity: f.included ? 1 : 0.4 }}>
                    <div style={{ 
                      width: '18px', height: '18px', borderRadius: '50%', background: f.included ? ((tier.highlight || isElite) ? 'rgba(255,255,255,0.2)' : 'var(--gold-dim)') : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: (tier.highlight || isElite) ? 'white' : 'var(--gold)', flexShrink: 0, marginTop: '2px'
                    }}>
                      {f.included ? <Check size={12} strokeWidth={3} /> : <div style={{ width: '4px', height: '4px', background: 'currentColor', borderRadius: '50%' }} />}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600 }}>{f.title}</span>
                      <span style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '2px', lineHeight: 1.3 }}>{f.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
