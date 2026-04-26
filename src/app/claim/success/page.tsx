import Link from 'next/link';
import { CheckCircle2, Star, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ClaimSuccessPage({ searchParams }: { searchParams: { vendorId?: string } }) {
  return (
    <main className="hero" style={{ minHeight: '100vh', padding: '0' }}>
      <div className="hero-grid-overlay"></div>
      
      <div style={{ 
        maxWidth: '600px', 
        width: '90%', 
        background: 'var(--bg-card)', 
        border: '1px solid var(--gold)', 
        borderRadius: '32px', 
        padding: '5rem 4rem', 
        textAlign: 'center',
        boxShadow: '0 40px 100px var(--gold-dim)',
        position: 'relative',
        zIndex: 10,
        animation: 'fadeUp 0.8s ease both'
      }}>
        <div style={{ 
          width: '100px', 
          height: '100px', 
          background: 'var(--gold-dim)', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 2.5rem',
          border: '1px solid var(--gold)'
        }}>
           <CheckCircle2 size={50} color="var(--gold)" />
        </div>
        
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '1.5rem' }}>
          Welcome to the <br /> <em>Elite Circle.</em>
        </h1>
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: '3.5rem', lineHeight: 1.8, fontSize: '1.1rem' }}>
          Your payment has been verified. Your profile is now <strong>Elite Verified</strong> and your <strong>Lifetime Founding Member</strong> status is active.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '4rem' }}>
            <div style={{ padding: '1.5rem', background: 'var(--bg-surface)', borderRadius: '16px', textAlign: 'left' }}>
                <Star size={20} color="var(--gold)" style={{ marginBottom: '1rem' }} />
                <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.6 }}>Membership</div>
                <div style={{ fontWeight: 800 }}>LIFETIME ELITE</div>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--bg-surface)', borderRadius: '16px', textAlign: 'left' }}>
                <Zap size={20} color="var(--gold)" style={{ marginBottom: '1rem' }} />
                <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.6 }}>CultivarID</div>
                <div style={{ fontWeight: 800 }}>ACTIVATED</div>
            </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Link href="/dashboard" className="btn-primary" style={{ padding: '1.25rem', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
                Enter Your Authority Dashboard
                <ArrowRight size={20} />
            </Link>
            <Link href="/" className="btn-ghost" style={{ padding: '1rem' }}>
                View Public Directory
            </Link>
        </div>

        <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: 0.5 }}>
            <ShieldCheck size={14} />
            <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Transaction Secured by RPV Authority Engine
            </span>
        </div>
      </div>
    </main>
  );
}
