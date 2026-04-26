import React from 'react';

export default function PrivacyPage() {
  return (
    <main className="page-wrapper" style={{ paddingTop: '10rem', paddingBottom: '6rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 5%' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3.5rem', marginBottom: '2rem' }}>Privacy <em>Policy</em></h1>
        
        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem' }}>
          <p style={{ marginBottom: '2rem' }}>At Rare Plant Vendors, we respect your privacy and the sensitive nature of rare botanical data.</p>
          
          <h2 style={{ color: 'var(--text-primary)', marginTop: '3rem', marginBottom: '1rem' }}>1. Data Collection</h2>
          <p>We collect vendor business data, contact information, and botanical specimen history to facilitate the CultivarID registry. For collectors, we collect wishlist preferences to provide targeted lead matching.</p>

          <h2 style={{ color: 'var(--text-primary)', marginTop: '3rem', marginBottom: '1rem' }}>2. Payment Security</h2>
          <p>All financial transactions are handled securely by PayPal. RPV does not store credit card numbers or sensitive financial data on our servers.</p>

          <h2 style={{ color: 'var(--text-primary)', marginTop: '3rem', marginBottom: '1rem' }}>3. Public vs. Private Data</h2>
          <p>Inventory marked as "available" and vendor contact details provided for the directory are public. User passwords, internal analytics, and non-disclosed specimen lineages are kept strictly private.</p>

          <h2 style={{ color: 'var(--text-primary)', marginTop: '3rem', marginBottom: '1rem' }}>4. Third Parties</h2>
          <p>We never sell your data to third-party marketing firms. Your data is used exclusively to facilitate connections within the Rare Plant Vendors network.</p>
          
          <p style={{ marginTop: '4rem', fontSize: '0.8rem', opacity: 0.6 }}>Last Updated: April 2026</p>
        </div>
      </div>
    </main>
  );
}
