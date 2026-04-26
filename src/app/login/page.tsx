'use client';
import { useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 5%' }}>
      <div style={{ maxWidth: '440px', width: '100%', background: 'var(--bg-surface)', padding: '3rem 2.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', textAlign: 'center' }}>
        <Image src="/brand-seal.png" alt="RPV Seal" width={64} height={64} style={{ filter: 'drop-shadow(0 0 15px rgba(212,175,55,0.4))', marginBottom: '1.5rem' }} />
        
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>Vendor Login</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2.5rem' }}>Access your vendor portal, inventory, and wishlist leads.</p>
        
        {error && (
          <div style={{ padding: '0.75rem', background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: '8px', color: '#e74c3c', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="vendor@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <Link href="/login/forgot-password" style={{ fontSize: '0.75rem', color: 'var(--gold)', textDecoration: 'none' }}>Forgot Password?</Link>
            </div>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem', padding: '1rem' }}>
            {loading ? 'Signing In...' : 'Sign In to Portal'}
          </button>
        </form>
        
        <div style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            Not a vendor yet? <a href="/for-vendors" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>Apply Here</a>
          </div>
          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
            Are you a Collector? <a href="/collector/login" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>Access Collector Portal</a>
          </div>
        </div>
      </div>
    </main>
  );
}
