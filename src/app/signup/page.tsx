'use client';

import React from 'react';
import { User, Store, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <main className="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 5% 60px' }}>
      <div className="hero-grid-overlay"></div>
      
      <div style={{ maxWidth: '1000px', width: '100%', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="hero-eyebrow" style={{ margin: '0 auto 1.5rem' }}>
            <div className="hero-eyebrow-dot"></div>
            <span>Elite Botanical Network</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1rem' }}>
            Join the <em>Global Registry</em>
          </h1>
          <p className="hero-sub" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Select your role to access specialized tools for the 2026 Rare Plant Season.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2.5rem',
          perspective: '1000px'
        }}>
          
          {/* COLLECTOR CARD */}
          <Link href="/collector/login" style={{ textDecoration: 'none' }}>
            <div className="role-card" style={{
              background: 'var(--glass)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--glass-border)',
              borderRadius: '24px',
              padding: '3rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: 'var(--card-shadow)'
            }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: 'var(--emerald-dim)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '2rem',
                border: '1px solid var(--emerald-border)'
              }}>
                <User size={40} color="var(--emerald)" />
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '1rem' }}>I am a <em>Collector</em></h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2.5rem', flexGrow: 1 }}>
                Track rare specimens, verify provenance via Digital Passports, and get exclusive access to verified vendor drops.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                Enter Portal <ArrowRight size={16} />
              </div>
            </div>
          </Link>

          {/* VENDOR CARD */}
          <Link href="/for-vendors" style={{ textDecoration: 'none' }}>
            <div className="role-card" style={{
              background: 'var(--glass)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--gold)',
              borderRadius: '24px',
              padding: '3rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 20px 40px var(--gold-dim)'
            }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: 'var(--gold-dim)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '2rem',
                border: '1px solid var(--gold)'
              }}>
                <Store size={40} color="var(--gold)" />
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '1rem' }}>I am a <em>Vendor</em></h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2.5rem', flexGrow: 1 }}>
                Scale your nursery with AI lead matching, interactive event maps, and the industry-standard Elite Authority Badge.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                Join the Network <ArrowRight size={16} />
              </div>
            </div>
          </Link>

        </div>

        <div style={{ marginTop: '5rem', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '3rem', opacity: 0.6 }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <ShieldCheck size={16} color="var(--gold)" /> Secure Registry
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <Sparkles size={16} color="var(--gold)" /> AI Lead Matching
           </div>
        </div>
      </div>
    </main>
  );
}
