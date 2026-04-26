'use client';
import { useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/login/reset-password`,
      });

      if (resetError) throw resetError;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link');
      window.alert('Error: ' + (err.message || 'Failed to send reset link'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 5%' }}>
        <div style={{ maxWidth: '440px', width: '100%', background: 'var(--bg-surface)', padding: '3rem 2.5rem', borderRadius: '24px', border: '1px solid var(--gold)', boxShadow: '0 20px 60px var(--gold-dim)', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', background: 'var(--gold-dim)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', border: '1px solid var(--gold)' }}>
             <CheckCircle2 size={40} color="var(--gold)" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', marginBottom: '1rem' }}>Check Your <em>Email</em></h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
          </p>
          <Link href="/login" className="btn-primary" style={{ width: '100%', display: 'block', padding: '1rem' }}>
            Return to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 5%' }}>
      <div className="hero-grid-overlay"></div>
      
      <div style={{ maxWidth: '440px', width: '100%', background: 'var(--glass)', backdropFilter: 'blur(20px)', padding: '3rem 2.5rem', borderRadius: '24px', border: '1px solid var(--glass-border)', boxShadow: 'var(--card-shadow)', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <Link href="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Login
        </Link>

        <Image src="/brand-seal.png" alt="RPV Seal" width={64} height={64} style={{ filter: 'drop-shadow(0 0 15px rgba(212,175,55,0.4))', marginBottom: '1.5rem' }} />
        
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', margin: '0 0 1rem', color: 'var(--text-primary)' }}>Reset <em>Password</em></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>Enter your email address and we'll send you a link to restore access to your Authority Suite.</p>
        
        {error && (
          <div style={{ padding: '0.75rem', background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: '8px', color: '#e74c3c', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold)', opacity: 0.6 }} />
              <input 
                type="email" 
                className="form-input" 
                placeholder="vendor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '3rem' }}
              />
            </div>
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem', padding: '1.25rem', fontSize: '0.9rem' }}>
            {loading ? 'Sending Link...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </main>
  );
}
