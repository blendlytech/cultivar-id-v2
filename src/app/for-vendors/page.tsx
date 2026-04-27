import PricingToggle from '../components/PricingToggle';
import { ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

export default function ForVendorsPage() {
  return (
    <main style={{ minHeight: '100vh', padding: '120px 5% 80px', background: 'var(--bg-default)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', marginBottom: '4rem' }}>
        <div className="hero-eyebrow" style={{ margin: '0 auto 1.5rem' }}>
          <div className="hero-eyebrow-dot"></div>
          <span>Vendor Directory & Toolkit</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
          Elevate Your <em>Nursery</em>
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
          Join the elite network of rare plant vendors. Get verified, issue Digital Passports, and unlock AI-powered collector matching.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold)' }}>
            <ShieldCheck size={20} /> <span style={{ fontWeight: 600 }}>Verified Badges</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--emerald)' }}>
            <TrendingUp size={20} /> <span style={{ fontWeight: 600 }}>Collector Leads</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold)' }}>
            <Sparkles size={20} /> <span style={{ fontWeight: 600 }}>CultivarID Tools</span>
          </div>
        </div>
      </div>

      <PricingToggle />
    </main>
  );
}
