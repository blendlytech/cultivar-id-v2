import Image from "next/image";
import Link from "next/link";
import { Leaf, ShieldCheck, Heart, Users, Sparkles, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="page-wrapper" style={{ overflow: "hidden" }}>
      {/* ─── HERO SECTION ─── */}
      <section className="hero" style={{ 
        paddingTop: "12rem", 
        paddingBottom: "8rem",
        position: "relative",
        background: "var(--hero-bg)"
      }}>
        <div className="hero-grid-overlay" style={{ opacity: 0.1 }}></div>
        
        <div style={{ position: "relative", zIndex: 2, maxWidth: "1200px", margin: "0 auto", padding: "0 5%" }}>
          <div className="hero-eyebrow" style={{ margin: "0 0 2.5rem" }}>
            <div className="hero-eyebrow-dot"></div>
            <span>Our Origin Story</span>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            <div>
              <h1 style={{ 
                fontSize: "clamp(3rem, 6vw, 5rem)", 
                marginBottom: "2rem",
                lineHeight: 1.1,
                fontWeight: 700
              }}>
                Born from <em style={{ 
                  display: "inline-block",
                  background: "linear-gradient(135deg, var(--gold) 0%, #F2D681 50%, var(--gold) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontStyle: "italic",
                  animation: "shimmer 4s linear infinite"
                }}>Obsession.</em>
              </h1>
              <p className="hero-sub" style={{ fontSize: "1.2rem", opacity: 0.9, margin: 0, textAlign: "left" }}>
                We aren't just another directory. We are a collective of growers, collectors, and conservationists who believe that the rarest specimens deserve a platform as exceptional as they are.
              </p>
            </div>
            
            <div style={{ position: "relative" }}>
              <div style={{
                position: "relative",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
                border: "1px solid var(--glass-border)"
              }}>
                <Image 
                  src="/rare_plant_about_hero_1776881885168.png" 
                  alt="Rare Plant Vibe" 
                  width={600} 
                  height={700} 
                  style={{ objectFit: "cover", width: "100%", height: "auto" }}
                />
              </div>
              {/* Decorative Gold Frame Offset */}
              <div style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                right: "-20px",
                bottom: "-20px",
                border: "1px solid var(--gold)",
                borderRadius: "20px",
                zIndex: -1,
                opacity: 0.3
              }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MANIFESTO: ENTHUSIASTS FIRST ─── */}
      <section className="section section-dark" style={{ padding: "8rem 5%" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
          <div className="section-eyebrow">Enthusiasts First</div>
          <h2 className="section-title">A Platform Built by <em>Collectors</em></h2>
          <p className="section-desc" style={{ maxWidth: "800px", fontSize: "1.25rem", marginTop: "2rem" }}>
            We started Rare Plant Vendors because we were tired of "invisibility." We were tired of missing the plants we loved because of poor logistics and fragmented information. 
            <br /><br />
            Our goal is to solve "logistical anxiety" for the botanical elite. When you use RPV, you're using a tool designed to protect the integrity of the hobby and the success of the growers.
          </p>
          
          <div className="features-grid" style={{ marginTop: "6rem", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
            <div className="feature-card">
              <div className="feature-icon"><Heart color="var(--gold)" /></div>
              <h3 className="feature-title">Pure Passion</h3>
              <p className="feature-desc">Every line of code is written with the same care we give our rarest Albo Monstera.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><ShieldCheck color="var(--gold)" /></div>
              <h3 className="feature-title">Verified Trust</h3>
              <p className="feature-desc">We only partner with growers who share our commitment to specimen health and provenance.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Users color="var(--gold)" /></div>
              <h3 className="feature-title">Global Community</h3>
              <p className="feature-desc">Connecting the world's most serious collectors with the most authoritative growers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── THE RPV DIFFERENCE (The "Ad") ─── */}
      <section className="section" style={{ padding: "8rem 5%", background: "var(--bg-surface)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", maxWidth: "1200px", margin: "0 auto", alignItems: "center" }}>
           <div style={{ order: 2 }}>
            <div className="section-eyebrow">The RPV Difference</div>
            <h2 className="section-title" style={{ textAlign: "left" }}>Ending the <em>Visibility</em> Gap</h2>
            <p className="section-desc" style={{ textAlign: "left", margin: "2rem 0" }}>
              Most directories are static lists. RPV is a dynamic ecosystem. We provide:
            </p>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {[
                { title: "Pinpoint Routing", desc: "Know exactly where your favorite vendor is located before the event starts." },
                { title: "Real-Time Inventory", desc: "Browse verified specimens and claim them before they hit the floor." },
                { title: "CultivarID™ Traceability", desc: "Digital provenance that travels with your plant for life." }
              ].map((item, i) => (
                <li key={i} style={{ marginBottom: "2rem", display: "flex", gap: "1.5rem" }}>
                  <div style={{ 
                    width: "40px", 
                    height: "40px", 
                    borderRadius: "50%", 
                    background: "var(--gold-dim)", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <Sparkles size={18} color="var(--gold)" />
                  </div>
                  <div>
                    <h4 style={{ color: "var(--gold)", marginBottom: "0.25rem" }}>{item.title}</h4>
                    <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div style={{ 
            position: "relative",
            height: "600px",
            borderRadius: "30px",
            background: "linear-gradient(45deg, var(--emerald), var(--forest))",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <Leaf size={100} color="var(--gold)" style={{ marginBottom: "2rem", opacity: 0.5 }} />
              <h3 style={{ color: "white", fontSize: "2rem", fontFamily: "var(--font-heading)" }}>Botanical <br />Authority</h3>
              <p style={{ color: "var(--gold)", marginTop: "1rem", fontWeight: 600 }}>EST. 2026</p>
            </div>
            {/* Glass Overlay Effect */}
            <div style={{
              position: "absolute",
              inset: "20px",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              pointerEvents: "none"
            }}></div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section style={{ 
        padding: "10rem 5%", 
        textAlign: "center",
        background: "var(--charcoal)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "relative", zIndex: 2 }}>
          <h2 style={{ fontSize: "3rem", color: "white", marginBottom: "2rem" }}>Join the Elite Registry</h2>
          <p style={{ color: "var(--gold)", fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto 4rem" }}>
            Whether you are a master grower or a dedicated collector, there is a place for you in our greenhouse.
          </p>
          <Link href="/onboarding" className="btn-primary" style={{ padding: "1.25rem 3.5rem", fontSize: "1.1rem" }}>
            List Your Booth Today
            <ArrowRight size={20} style={{ marginLeft: "0.75rem" }} />
          </Link>
        </div>
        
        {/* Background Decorative Element */}
        <div style={{ 
          position: "absolute", 
          top: "50%", 
          left: "50%", 
          transform: "translate(-50%, -50%)",
          width: "120%",
          height: "120%",
          background: "radial-gradient(circle, rgba(11,61,46,0.3) 0%, transparent 70%)",
          zIndex: 1
        }}></div>
      </section>
    </div>
  );
}
