'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Leaf, ShieldCheck, Mail } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

function OnboardingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get('plan') || 'sprout';
  const supabase = createClient();

  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    password: '',
    phone: '',
    locationCity: '',
    locationState: '',
    tier: initialPlan,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // Auto-login!
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (loginError) {
        throw new Error(loginError.message || 'Failed to log in automatically');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: 'var(--bg-surface)', padding: '3rem', borderRadius: '24px', border: '1px solid var(--glass-border)', boxShadow: 'var(--card-shadow)' }}>
      {error && (
        <div style={{ padding: '1rem', background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', borderRadius: '8px', marginBottom: '2rem', fontSize: '0.9rem', border: '1px solid rgba(231, 76, 60, 0.3)' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Business Name</label>
          <input 
            type="text" name="businessName" value={formData.businessName} onChange={handleChange} required
            style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-default)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem' }}
            placeholder="Monstera Co."
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Name</label>
          <input 
            type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} required
            style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-default)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem' }}
            placeholder="Jane Doe"
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
          <input 
            type="email" name="email" value={formData.email} onChange={handleChange} required
            style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-default)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem' }}
            placeholder="jane@example.com"
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
          <input 
            type="password" name="password" value={formData.password} onChange={handleChange} required minLength={8}
            style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-default)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem' }}
            placeholder="••••••••"
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>City</label>
          <input 
            type="text" name="locationCity" value={formData.locationCity} onChange={handleChange}
            style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-default)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem' }}
            placeholder="Miami"
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>State</label>
          <input 
            type="text" name="locationState" value={formData.locationState} onChange={handleChange}
            style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-default)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem' }}
            placeholder="FL"
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plan Tier</label>
          <select 
            name="tier" value={formData.tier} onChange={handleChange}
            style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-default)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem', appearance: 'none' }}
          >
            <option value="sprout">Sprout</option>
            <option value="bloom">Bloom</option>
            <option value="canopy">Canopy</option>
            <option value="elite">Elite Founder</option>
          </select>
        </div>
      </div>

      <button 
        type="submit" 
        className="btn-primary" 
        disabled={loading}
        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1 }}
      >
        {loading ? 'Creating Account...' : 'Continue to Dashboard'} <ArrowRight size={20} />
      </button>
      
      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        By continuing, you agree to our <Link href="/terms" style={{ color: 'var(--gold)' }}>Terms of Service</Link>.
      </p>
    </form>
  );
}

export default function OnboardingPage() {
  return (
    <main style={{ minHeight: '100vh', padding: '120px 5% 80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Vendor Registration
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Complete your profile to secure your position in the directory.
          </p>
        </div>
        
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading registration...</div>}>
          <OnboardingForm />
        </Suspense>
      </div>
    </main>
  );
}
