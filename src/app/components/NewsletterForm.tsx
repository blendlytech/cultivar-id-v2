'use client';
import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || "You're on the list!");
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div>
      {status === 'success' ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem 1.5rem',
          background: 'rgba(46,204,113,0.08)',
          border: '1px solid rgba(46,204,113,0.3)',
          borderRadius: '12px',
          color: '#2ecc71',
          fontSize: '0.95rem',
          fontWeight: 600,
        }}>
          <span style={{ fontSize: '1.3rem' }}>✓</span>
          {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="newsletter-form" style={{ position: 'relative' }}>
          <input
            id="newsletter-email-input"
            type="email"
            className="newsletter-input"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            className="btn-primary"
            id="newsletter-submit-btn"
            disabled={status === 'loading'}
            style={{ opacity: status === 'loading' ? 0.6 : 1 }}
          >
            {status === 'loading' ? 'Joining...' : 'Subscribe'}
          </button>
        </form>
      )}
      {status === 'error' && (
        <div style={{
          marginTop: '0.75rem',
          fontSize: '0.8rem',
          color: '#e74c3c',
          fontWeight: 500,
        }}>
          {message}
        </div>
      )}
    </div>
  );
}
