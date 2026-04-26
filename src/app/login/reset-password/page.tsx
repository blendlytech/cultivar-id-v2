'use client';
import { useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 5%' }}>
        <div style={{ maxWidth: '440px', width: '100%', background: 'var(--bg-surface)', padding: '3rem 2.5rem', borderRadius: '24px', border: '1px solid var(--gold)', boxShadow: '0 20px 60px var(--gold-dim)', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', background: 'var(--gold-dim)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', border: '1px solid var(--gold)' }}>
             <ShieldCheck size={40} color="var(--gold)" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', marginBottom: '1rem' }}>Success!</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Your password has been updated. Redirecting you to login...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 5%' }}>
      <div className="hero-grid-overlay"></div>
      
      <div style={{ maxWidth: '440px', width: '100%', background: 'var(--glass)', backdropFilter: 'blur(20px)', padding: '3rem 2.5rem', borderRadius: '24px', border: '1px solid var(--glass-border)', boxShadow: 'var(--card-shadow)', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <Image src="/brand-seal.png" alt="RPV Seal" width={64} height={64} style={{ filter: 'drop-shadow(0 0 15px rgba(212,175,55,0.4))', marginBottom: '1.5rem' }} />
        
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', margin: '0 0 1rem', color: 'var(--text-primary)' }}>Secure <em>Account</em></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>Please enter your new password below to regain access to your portal.</p>
        
        {error && (
          <div style={{ padding: '0.75rem', background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: '8px', color: '#e74c3c', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">New Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold)', opacity: 0.6 }} />
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-input" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold)', opacity: 0.6 }} />
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-input" 
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ paddingLeft: '3rem' }}
              />
            </div>
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem', padding: '1.25rem', fontSize: '0.9rem' }}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </main>
  );
}
