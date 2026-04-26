'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

interface Lead {
  id: string;
  created_at: string;
  general_notified_at: string | null;
  elite_notified_at: string | null;
  wishlists: { species_name: string; user_id: string } | null;
  inventory: { species_name: string; variety: string | null; price: number | null } | null;
}

export default function LeadsDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [vendorTier, setVendorTier] = useState('seedling');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }

      const { data: vendor } = await supabase
        .from('vendors')
        .select('id, account_tier')
        .eq('user_id', user.id)
        .single();

      if (!vendor) { setLoading(false); return; }
      setVendorTier(vendor.account_tier || 'seedling');

      // Build leads query — non-elite vendors only see leads after 24hr window
      let query = supabase
        .from('wishlist_matches')
        .select(`
          id, created_at, general_notified_at, elite_notified_at,
          wishlists(species_name, user_id),
          inventory(species_name, variety, price)
        `)
        .eq('vendor_id', vendor.id)
        .order('created_at', { ascending: false })
        .limit(50);

      // Non-elite: only show leads that have passed the 24hr elite window
      if (vendor.account_tier !== 'elite') {
        query = query.not('general_notified_at', 'is', null);
      }

      const { data } = await query;

      setLeads((data as any) || []);
      setLoading(false);
    }
    load();
  }, []);

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const hrs = Math.floor(diff / 3600000);
    if (hrs < 1) return 'Just now';
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const navItems = [
    { href: '/dashboard', label: '⚡ Overview' },
    { href: '/dashboard/inventory', label: '🌿 Inventory' },
    { href: '/dashboard/leads', label: '🎯 Leads', active: true },
    { href: '/dashboard/passports', label: '📜 Passports' },
    { href: '/dashboard/analytics', label: '📊 Analytics' },
    { href: '/dashboard/settings', label: '⚙️ Settings' },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem', animation: 'floatLeaf 2s ease-in-out infinite' }}>🎯</div>
          <p style={{ fontSize: '0.9rem' }}>Scanning for matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '240px', flexShrink: 0, background: 'var(--bg-surface)', borderRight: '1px solid var(--glass-border)', padding: '7rem 1.5rem 2rem', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Vendor Portal
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Market Intelligence
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
      <main style={{ flex: 1, padding: '7rem 3rem 4rem', maxWidth: '900px' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.4rem' }}>
            Market Intelligence
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', margin: 0, color: 'var(--text-primary)' }}>Wishlist Leads</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
            Real-time matches from the collector wishlist network.
            {vendorTier === 'elite' && <span style={{ color: 'var(--gold)', fontWeight: 600 }}> · Elite 24hr priority active</span>}
          </p>
        </div>

        {leads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px dashed var(--glass-border)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>🎯</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>No leads yet</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
              When collectors add plants to their wishlist that match your inventory, leads will appear here automatically.
            </p>
            <Link href="/dashboard/inventory" className="btn-primary" style={{ textDecoration: 'none' }}>
              Add Inventory to Get Matched
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {leads.map(lead => {
              const isEliteLead = lead.elite_notified_at && !lead.general_notified_at;
              const species = lead.inventory?.species_name || lead.wishlists?.species_name || 'Unknown';
              const variety = lead.inventory?.variety;
              const price = lead.inventory?.price;

              return (
                <div key={lead.id} style={{
                  background: isEliteLead ? 'rgba(212,175,55,0.04)' : 'var(--bg-surface)',
                  border: `1px solid ${isEliteLead ? 'rgba(212,175,55,0.25)' : 'var(--glass-border)'}`,
                  borderRadius: '10px', padding: '1.25rem 1.5rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                      {isEliteLead && <span className="elite-badge" style={{ fontSize: '0.6rem' }}>✦ Elite Lead</span>}
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{timeAgo(lead.created_at)}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                      {species}
                      {variety && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>var. {variety}</span>}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Collector wishlist match · {lead.wishlists?.user_id ? `User ${lead.wishlists.user_id.substring(0, 8)}` : 'Anonymous'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {price && (
                      <div style={{ fontSize: '1.1rem', color: 'var(--gold)', fontWeight: 700, marginBottom: '0.4rem' }}>
                        ${price.toFixed(2)}
                      </div>
                    )}
                    <span style={{ fontSize: '0.72rem', color: isEliteLead ? 'var(--gold)' : '#2ecc71', fontWeight: 600 }}>
                      {isEliteLead ? '✦ Exclusive window' : '● Available'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
