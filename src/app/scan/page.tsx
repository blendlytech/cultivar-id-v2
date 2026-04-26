'use client';

import { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { useRouter } from 'next/navigation';
import { Camera, ShieldCheck, X, RefreshCw, Zap } from 'lucide-react';
import Link from 'next/link';

export default function QRScannerPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;
        setIsScanning(true);

        const config = { 
          fps: 10, 
          qrbox: { width: 280, height: 280 },
          aspectRatio: 1.0
        };

        await html5QrCode.start(
          { facingMode: "environment" }, 
          config,
          (decodedText) => {
            handleScanSuccess(decodedText);
          },
          (errorMessage) => {
            // Silently ignore scan errors (they happen every frame if no QR found)
          }
        );
      } catch (err: any) {
        console.error("Scanner Error:", err);
        setError("Camera access denied or not available. Please ensure you've granted camera permissions.");
        setIsScanning(false);
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => console.error("Stop Error:", err));
      }
    };
  }, []);

  const handleScanSuccess = (decodedText: string) => {
    // Check if the decoded text is a valid RPV verify URL or just a hash
    let hash = "";
    
    if (decodedText.includes('rareplantvendors.com/verify/')) {
      const parts = decodedText.split('/verify/');
      hash = parts[parts.length - 1].split('?')[0].split('#')[0];
    } else if (decodedText.length === 8 || decodedText.length === 12) {
      // Direct hash scan (e.g. "A1B2C3D4")
      hash = decodedText;
    }

    if (hash) {
      if (scannerRef.current) {
        scannerRef.current.stop().then(() => {
          router.push(`/verify/${hash}`);
        });
      } else {
        router.push(`/verify/${hash}`);
      }
    } else {
      // Not a valid RPV code, maybe show a temporary warning?
      console.log("Invalid QR Code detected:", decodedText);
    }
  };

  return (
    <main className="hero" style={{ minHeight: '100vh', padding: '6rem 5% 4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="hero-grid-overlay" style={{ opacity: 0.1 }}></div>
      
      <div style={{ maxWidth: '600px', width: '100%', position: 'relative', zIndex: 10 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="hero-eyebrow" style={{ margin: '0 auto 1.5rem' }}>
            <div className="hero-eyebrow-dot"></div>
            <span>CultivarID Authentication</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '1rem' }}>
            Specimen <em>Scanner</em>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
            Point your camera at a CultivarID QR code to verify the provenance and authenticity of this specimen.
          </p>
        </div>

        {/* Scanner Container */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          aspectRatio: '1', 
          background: '#000', 
          borderRadius: '32px', 
          overflow: 'hidden',
          border: '1px solid var(--glass-border)',
          boxShadow: '0 0 50px rgba(0,0,0,0.5)'
        }}>
          {/* The Actual Reader Div */}
          <div id="reader" style={{ width: '100%', height: '100%' }}></div>

          {/* Viewfinder Overlay (Custom UI) */}
          <div style={{ 
            position: 'absolute', 
            top: 0, left: 0, right: 0, bottom: 0, 
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ 
              width: '280px', 
              height: '280px', 
              border: '2px solid rgba(212,175,55,0.3)',
              borderRadius: '24px',
              position: 'relative'
            }}>
              {/* Corner Accents */}
              <div style={{ position: 'absolute', top: '-2px', left: '-2px', width: '30px', height: '30px', borderTop: '4px solid var(--gold)', borderLeft: '4px solid var(--gold)', borderTopLeftRadius: '24px' }}></div>
              <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '30px', height: '30px', borderTop: '4px solid var(--gold)', borderRight: '4px solid var(--gold)', borderTopRightRadius: '24px' }}></div>
              <div style={{ position: 'absolute', bottom: '-2px', left: '-2px', width: '30px', height: '30px', borderBottom: '4px solid var(--gold)', borderLeft: '4px solid var(--gold)', borderBottomLeftRadius: '24px' }}></div>
              <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '30px', height: '30px', borderBottom: '4px solid var(--gold)', borderRight: '4px solid var(--gold)', borderBottomRightRadius: '24px' }}></div>

              {/* Scanning Animation Line */}
              {isScanning && (
                <div style={{ 
                  position: 'absolute', 
                  top: '0', 
                  left: '10%', 
                  right: '10%', 
                  height: '2px', 
                  background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
                  boxShadow: '0 0 15px var(--gold)',
                  animation: 'scanLine 3s linear infinite'
                }}></div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ 
              position: 'absolute', 
              top: 0, left: 0, right: 0, bottom: 0, 
              background: 'rgba(0,0,0,0.8)', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <X size={48} color="#e74c3c" style={{ marginBottom: '1.5rem' }} />
              <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Camera Error</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '2rem' }}>{error}</p>
              <button onClick={() => window.location.reload()} className="btn-primary" style={{ padding: '0.8rem 2rem' }}>
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            background: 'var(--gold-dim)', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '100px',
            border: '1px solid rgba(212,175,55,0.2)'
          }}>
             <ShieldCheck size={18} color="var(--gold)" />
             <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)' }}>
               Secure Registry Authentication
             </span>
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <Link href="/" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>
              ← Return to Marketplace
            </Link>
          </div>
        </div>

      </div>

      <style jsx global>{`
        @keyframes scanLine {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        #reader__dashboard_section_csr button {
          background: var(--gold) !important;
          color: var(--charcoal) !important;
          border: none !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          font-weight: 700 !important;
          cursor: pointer !important;
        }
        #reader__scan_region {
          background: transparent !important;
        }
        #reader video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
          border-radius: 32px !important;
        }
      `}</style>
    </main>
  );
}
