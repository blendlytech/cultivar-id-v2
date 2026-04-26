'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import ImageUpload from '@/app/components/ImageUpload';

interface VendorProfile {
  id: string;
  name: string;
  owner_name: string | null;
  bio: string | null;
  logo_url: string | null;
  contact_email: string | null;
  phone_number: string | null;
  website_url: string | null;
  instagram: string | null;
  facebook: string | null;
  location_city: string | null;
  location_state: string | null;
  location_country: string | null;
  specialty: string[] | null;
}

const specialtyOptions = [
  'Rare Aroids', 'Monstera & Variegates', 'Philodendrons', 'Hoya', 'Anthuriums',
  'Alocasia', 'Orchids', 'Epiphytes', 'Carnivorous Plants', 'Caudiciforms',
  'Ferns & Selaginella', 'Rare Tropicals', 'Succulents & Cacti', 'Tillandsia',
];

export default function SettingsPage() {
  const [profile, setProfile] = useState<Partial<VendorProfile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }

      const { data } = await supabase
        .from('vendors')
        .select('id, name, owner_name, bio, logo_url, contact_email, phone_number, website_url, instagram, facebook, location_city, location_state, location_country, specialty')
        .eq('contact_email', user.email)
        .single();

      if (data) setProfile(data);
      setLoading(false);
    }
    load();
  }, []);

  const update = (key: keyof VendorProfile, value: string | string[]) =>
    setProfile(p => ({ ...p, [key]: value }));

  const toggleSpecialty = (s: string) => {
    const current = profile.specialty || [];
    const next = current.includes(s) ? current.filter(x => x !== s) : [...current, s];
    update('specialty', next);
  };

  const handleSave = async () => {
    if (!profile.id) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('vendors').update({
      name: profile.name,
      owner_name: profile.owner_name,
      bio: profile.bio,
      logo_url: profile.logo_url,
      phone_number: profile.phone_number,
      website_url: profile.website_url,
      instagram: profile.instagram,
      facebook: profile.facebook,
      location_city: profile.location_city,
      location_state: profile.location_state,
      location_country: profile.location_country,
      specialty: profile.specialty,
    }).eq('id', profile.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading settings...</p>
      </div>
    );
  }

  const navItems = [
    { href: '/dashboard', label: '⚡ Overview' },
    { href: '/dashboard/inventory', label: '🌿 Inventory' },
    { href: '/dashboard/leads', label: '🎯 Leads' },
    { href: '/dashboard/passports', label: '📜 Passports' },
    { href: '/dashboard/analytics', label: '📊 Analytics' },
    { href: '/dashboard/settings', label: '⚙️ Settings', active: true },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '240px', flexShrink: 0, background: 'var(--bg-surface)', borderRight: '1px solid var(--glass-border)', padding: '7rem 1.5rem 2rem', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Vendor Portal
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Nursery Settings
          </div>
        </div>
        {navItems.map(item => (
          <Link key={item.href} href={item.href} style={{
            display: 'block', padding: '0.65rem 1rem', borderRadius: '8px', textDecoration: 'none',
            fontSize: '0.88rem', fontWeight: item.active ? 700 : 500,
            color: item.active ? 'var(--text-primary)' : 'var(--text-secondary)',
            background: item.active ? 'rgba(255,255,255,0.07)' : 'transparent',
            marginBottom: '0.25rem',
            transition: 'all 0.15s ease',
          }}>
            {item.label}
          </Link>
        ))}
        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <Link href="/" style={{ display: 'block', padding: '0.65rem 1rem', textDecoration: 'none', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            ← Directory
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '7rem 3rem 4rem', maxWidth: '800px' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.4rem' }}>
            Account Settings
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', margin: 0, color: 'var(--text-primary)' }}>Edit Profile</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
            Changes are instantly reflected on your public vendor profile.
          </p>
        </div>

        {/* Business Info */}
        <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '2rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
            Business Information
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <ImageUpload 
                bucket="vendors" 
                label="Nursery Logo / Branding"
                currentImageUrl={profile.logo_url}
                onUploadComplete={(url) => update('logo_url', url)}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Business / Nursery Name</label>
                <input className="form-input" value={profile.name || ''} onChange={e => update('name', e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Owner Name</label>
                <input className="form-input" value={profile.owner_name || ''} onChange={e => update('owner_name', e.target.value)} />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">About Me / Bio</label>
              <textarea className="form-textarea" value={profile.bio || ''} onChange={e => update('bio', e.target.value)} rows={5} />
            </div>
          </div>
        </section>

        {/* Contact & Social */}
        <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '2rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
            Contact & Social
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Phone</label>
                <input className="form-input" type="tel" value={profile.phone_number || ''} onChange={e => update('phone_number', e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Website</label>
                <input className="form-input" type="url" placeholder="https://" value={profile.website_url || ''} onChange={e => update('website_url', e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Instagram</label>
                <input className="form-input" placeholder="@handle" value={profile.instagram || ''} onChange={e => update('instagram', e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Facebook</label>
                <input className="form-input" placeholder="Page name or URL" value={profile.facebook || ''} onChange={e => update('facebook', e.target.value)} />
              </div>
            </div>
          </div>
        </section>

        {/* Location */}
        <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '2rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
            Location
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">City</label>
              <input className="form-input" value={profile.location_city || ''} onChange={e => update('location_city', e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">State / Province</label>
              <input className="form-input" value={profile.location_state || ''} onChange={e => update('location_state', e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Country</label>
              <input className="form-input" value={profile.location_country || ''} onChange={e => update('location_country', e.target.value)} />
            </div>
          </div>
        </section>

        {/* Specialties */}
        <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '2rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
            Specialties
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {specialtyOptions.map(s => {
              const selected = (profile.specialty || []).includes(s);
              return (
                <button key={s} onClick={() => toggleSpecialty(s)} style={{
                  padding: '0.4rem 0.9rem', borderRadius: '20px', fontSize: '0.78rem', cursor: 'pointer',
                  border: `1px solid ${selected ? 'var(--gold)' : 'var(--glass-border)'}`,
                  background: selected ? 'rgba(212,175,55,0.1)' : 'transparent',
                  color: selected ? 'var(--gold)' : 'var(--sand)',
                  fontFamily: 'var(--font-body)', transition: 'all 0.2s ease',
                }}>
                  {selected ? '✓ ' : ''}{s}
                </button>
              );
            })}
          </div>
        </section>

        {/* Save */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ padding: '1rem 2.5rem', opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {saved && (
            <span style={{ color: '#2ecc71', fontSize: '0.9rem', fontWeight: 600 }}>
              ✓ Profile updated!
            </span>
          )}
        </div>
      </main>
    </div>
  );
}
