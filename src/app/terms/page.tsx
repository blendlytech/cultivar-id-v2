import React from 'react';

export default function TermsPage() {
  return (
    <main className="page-wrapper" style={{ paddingTop: '10rem', paddingBottom: '6rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 5%' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3.5rem', marginBottom: '2rem' }}>Terms of <em>Service</em></h1>
        
        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem' }}>
          <p style={{ marginBottom: '2rem' }}>Welcome to Rare Plant Vendors. By accessing our platform, you agree to the following terms and conditions.</p>
          
          <h2 style={{ color: 'var(--text-primary)', marginTop: '3rem', marginBottom: '1rem' }}>1. Membership & Access</h2>
          <p>Founding Lifetime Membership is a one-time payment for perpetual access to the Elite features of the RPV platform as they exist today and in the future. This status is non-transferable and subject to our community standards.</p>

          <h2 style={{ color: 'var(--text-primary)', marginTop: '3rem', marginBottom: '1rem' }}>2. Vendor Responsibilities</h2>
          <p>Vendors are responsible for the accuracy of their inventory, provenance data, and customer interactions. Rare Plant Vendors acts as a directory and verification service, not a direct party to transactions between collectors and vendors.</p>

          <h2 style={{ color: 'var(--text-primary)', marginTop: '3rem', marginBottom: '1rem' }}>3. Digital Provenance (CultivarID)</h2>
          <p>The CultivarID system is a digital record. While we verify nursery identity and location, the genetic claims made about specimens are provided by the vendor. Fraudulent claims will result in immediate termination of Elite status without refund.</p>

          <h2 style={{ color: 'var(--text-primary)', marginTop: '3rem', marginBottom: '1rem' }}>4. Payments & Refunds</h2>
          <p>Due to the immediate activation of managed services (24h backend setup) and lifetime digital benefits, all sales of Founding Member passes are final. Refunds are only issued in the event of documented technical failure to provide the service.</p>
          
          <p style={{ marginTop: '4rem', fontSize: '0.8rem', opacity: 0.6 }}>Last Updated: April 2026</p>
        </div>
      </div>
    </main>
  );
}
