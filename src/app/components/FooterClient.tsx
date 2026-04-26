'use client';
import Image from "next/image";
import Link from "next/link";

export default function FooterClient() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", textDecoration: "none", color: "inherit" }}>
            <Image
              src="/brand-seal.png"
              alt="RPV Seal"
              width={44}
              height={44}
              style={{ filter: "drop-shadow(0 0 8px rgba(212,175,55,0.4))" }}
            />
            <span className="logo-text" style={{ fontSize: "1.2rem" }}>Rare Plant Vendors</span>
          </Link>
          <p>The world&apos;s premier directory for rare botanical events, verified growers, and serious collectors. Est. 2026.</p>
        </div>

        <div className="footer-col">
          <h4>Discover</h4>
          <Link href="/events" id="footer-events-link">Upcoming Events</Link>
          <Link href="/vendors" id="footer-vendors-link">Verified Vendors</Link>
          <Link href="/scan" id="footer-cultivar-link">CultivarID™</Link>
          <Link href="/events" id="footer-map-link">Event Map</Link>
        </div>

        <div className="footer-col">
          <h4>For Vendors</h4>
          <Link href="/for-vendors" id="footer-list-booth-link">List Your Booth</Link>
          <Link href="/for-vendors" id="footer-verification-link">Verification Program</Link>
          <Link href="/scan" id="footer-passport-link">Digital Passport</Link>
          <Link href="/for-vendors" id="footer-pricing-link">Pricing</Link>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <Link href="/about" id="footer-about-link">About Us</Link>
          <a href="#" id="footer-blog-link">Blog</a>
          <a href="#" id="footer-contact-link">Contact</a>
          <Link href="/privacy" id="footer-privacy-link">Privacy Policy</Link>
          <Link href="/terms" id="footer-terms-link">Terms of Service</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Rare Plant Vendors. All rights reserved.</span>
        <span style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", color: "var(--gold)", opacity: 1 }}>
          The Rolex of Plant Sites™
        </span>
      </div>
    </footer>
  );
}
