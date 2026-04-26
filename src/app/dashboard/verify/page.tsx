'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function VerifyProfilePage() {
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }

      const { data } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setVendor(data);
        setEmail(data.contact_email || '');
        setPhone(data.phone_number || '');
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from('vendors')
      .update({
        contact_email: email,
        phone_number: phone,
        subscription_status: 'under_review',
      })
      .eq('id', vendor.id);

    if (updateError) {
      setError(updateError.message);
      setSubmitting(false);
    } else {
      setSubmitted(true);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-deep)' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem', animation: 'floatLeaf 2s ease-in-out infinite' }}>🌿</div>
          <p style={{ fontSize: '0.9rem' }}>Loading verification form...</p>
        </div>
      </div>
    );
  }

  if (submitted || vendor?.subscription_status === 'under_review') {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--bg-deep)' }}>
        <div style={{ 
          maxWidth: '500px', width: '100%', padding: '3.5rem', 
          background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', 
          borderRadius: '32px', textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(212,175,55,0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem',
            border: '1px solid var(--gold)'
          }}>
            <span style={{ fontSize: '2.5rem' }}>⏳</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Profile Under Review
          </h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2.5rem', fontSize: '1.05rem' }}>
            Thank you for submitting your credentials. Your profile is now <strong style={{ color: 'var(--gold)' }}>Under Review</strong>. 
            Verification typically takes at least 1 hour as our team manually audits professional details.
          </p>
          <Link href="/dashboard" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', padding: '1rem 2.5rem' }}>
            Return to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const locationStr = [vendor.location_city, vendor.location_state, vendor.location_country].filter(Boolean).join(', ');

  return (
    <main style={{ minHeight: '100vh', padding: '8rem 5% 4rem', display: 'flex', justifyContent: 'center', background: 'var(--bg-deep)' }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <div style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.75rem' }}>
            Trust & Authority
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', color: 'var(--text-primary)', margin: '0 0 1rem', lineHeight: 1.1 }}>
            Verify Your <br /><em>Professional Profile</em>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto' }}>
            Secure your verified badge and join the world&apos;s most trusted rare plant directory.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ 
          background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', 
          borderRadius: '32px', padding: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',
          boxShadow: '0 30px 60px rgba(0,0,0,0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle background decoration */}
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '200px', height: '200px', background: 'var(--emerald)', opacity: 0.05, filter: 'blur(60px)', borderRadius: '50%' }}></div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.7rem', opacity: 0.6 }}>Company Name</label>
              <div style={{ 
                padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', 
                borderRadius: '12px', color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 500
              }}>
                {vendor.name || 'Not Set'}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.7rem', opacity: 0.6 }}>Location</label>
              <div style={{ 
                padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', 
                borderRadius: '12px', color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 500,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
              }}>
                {locationStr || 'Global'}
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontWeight: 600 }}>Professional Email Address</label>
            <input 
              className="form-input" 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. contact@yournursery.com" 
              style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)' }}
            />
            <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.5rem', opacity: 0.6 }}>
              Used for directory inquiries and professional communication.
            </p>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontWeight: 600 }}>Business Phone Number</label>
            <input 
              className="form-input" 
              type="tel" 
              required 
              value={phone} 
              onChange={e => setPhone(e.target.value)}
              placeholder="e.g. +1 (555) 000-0000" 
              style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)' }}
            />
          </div>

          {error && (
            <div style={{ padding: '1rem', background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: '12px', color: '#e74c3c', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={submitting} className="btn-primary" style={{ 
            padding: '1.25rem', marginTop: '1rem', fontSize: '1rem', fontWeight: 700,
            boxShadow: '0 10px 20px rgba(212,175,55,0.15)'
          }}>
            {submitting ? 'Processing Application...' : 'Submit for Manual Review'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem', justifyContent: 'center' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--gold)' }}></div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
              Encrypted & secure verification process
            </p>
          </div>
        </form>
        
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Link href="/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
