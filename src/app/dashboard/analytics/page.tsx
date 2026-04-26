'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

interface AnalyticsData {
  totalViews: number;
  recentViews: number;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [vendorName, setVendorName] = useState('');

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }

      const { data: vendor } = await supabase
        .from('vendors')
        .select('id, name')
        .eq('contact_email', user.email)
        .single();

      if (!vendor) { setLoading(false); return; }
      setVendorName(vendor.name);

      // Get all views
      const { count: totalViews } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('vendor_id', vendor.id)
        .eq('event_type', 'profile_view');

      // Get recent views (last 7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { count: recentViews } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('vendor_id', vendor.id)
        .eq('event_type', 'profile_view')
        .gte('created_at', sevenDaysAgo);

      setData({
        totalViews: totalViews || 0,
        recentViews: recentViews || 0
      });
      setLoading(false);
    }
    load();
  }, []);

  const navItems = [
    { href: '/dashboard', label: '⚡ Overview' },
    { href: '/dashboard/inventory', label: '🌿 Inventory' },
    { href: '/dashboard/leads', label: '🎯 Leads' },
    { href: '/dashboard/passports', label: '📜 Passports' },
    { href: '/dashboard/analytics', label: '📊 Analytics', active: true },
    { href: '/dashboard/settings', label: '⚙️ Settings' },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem', animation: 'floatLeaf 2s ease-in-out infinite' }}>📊</div>
          <p style={{ fontSize: '0.9rem' }}>Analyzing performance...</p>
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
            Growth Metrics
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
            Performance Metrics
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', margin: 0, color: 'var(--text-primary)' }}>Profile Analytics</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
            Track how collectors are discovering and engaging with {vendorName}.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {/* Main Stat Card */}
          <div className="onboarding-card" style={{ 
            padding: '2rem', 
            background: 'linear-gradient(145deg, rgba(20,20,20,0.9), rgba(46,204,113,0.1))',
            border: '1px solid rgba(46,204,113,0.3)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '2rem' }}>👁️</div>
              <div style={{ padding: '0.2rem 0.6rem', background: 'rgba(46,204,113,0.15)', color: '#2ecc71', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>+{(data?.recentViews || 0) > 0 ? 'Active' : 'Steady'}</div>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', color: 'var(--text-primary)', marginBottom: '0.25rem', lineHeight: 1 }}>
              {data?.totalViews || 0}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Profile Views</div>
          </div>

          {/* Activity Card */}
          <div className="onboarding-card" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>7-Day Activity</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '80px', marginBottom: '1rem' }}>
              {/* Mocking a small bar chart for visual flair */}
              {[30, 45, 25, 60, 40, 75, 90].map((h, i) => (
                <div key={i} style={{ 
                  flex: 1, 
                  height: `${h}%`, 
                  background: i === 6 ? 'var(--gold)' : 'rgba(255,255,255,0.1)', 
                  borderRadius: '2px',
                  transition: 'height 1s ease'
                }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{data?.recentViews || 0}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Views this week</div>
            </div>
          </div>
        </div>

        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Advanced Insights</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div className="onboarding-card" style={{ padding: '1.5rem', opacity: 0.6 }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>🔍</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Search Impressions</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>How many times you appeared in search results.</p>
            <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 700 }}>AVAILABLE FOR PRO TIER</div>
          </div>
          <div className="onboarding-card" style={{ padding: '1.5rem', opacity: 0.6 }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>❤️</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Wishlist Additions</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Collectors who added your plants to their wishlist.</p>
            <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 700 }}>AVAILABLE FOR ELITE TIER</div>
          </div>
        </div>
      </main>
    </div>
  );
}
