'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: '⚡ Overview' },
  { href: '/dashboard/inventory', label: '🌿 Inventory' },
  { href: '/dashboard/leads', label: '🎯 Leads' },
  { href: '/dashboard/passports', label: '📜 Passports' },
  { href: '/dashboard/analytics', label: '📊 Analytics' },
  { href: '/dashboard/settings', label: '⚙️ Settings' },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside style={{ 
      width: '240px', 
      flexShrink: 0, 
      background: 'var(--bg-surface)', 
      borderRight: '1px solid var(--glass-border)', 
      padding: '7rem 1.5rem 2rem', 
      position: 'sticky', 
      top: 0, 
      height: '100vh', 
      overflowY: 'auto' 
    }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ 
          fontSize: '0.65rem', 
          fontWeight: 700, 
          letterSpacing: '0.12em', 
          textTransform: 'uppercase', 
          color: 'var(--text-secondary)', 
          marginBottom: '0.5rem' 
        }}>
          Vendor Portal
        </div>
        <div style={{ 
          fontSize: '0.9rem', 
          fontWeight: 600, 
          color: 'var(--text-primary)' 
        }}>
          Market Intelligence
        </div>
      </div>
      
      <nav>
        {navItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'block', 
              padding: '0.65rem 1rem', 
              borderRadius: '8px', 
              textDecoration: 'none',
              fontSize: '0.88rem', 
              fontWeight: isActive ? 700 : 500,
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(255,255,255,0.07)' : 'transparent',
              marginBottom: '0.25rem',
              transition: 'all 0.15s ease',
            }}>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
        <Link href="/" style={{ 
          display: 'block', 
          padding: '0.65rem 1rem', 
          textDecoration: 'none', 
          fontSize: '0.85rem', 
          color: 'var(--text-secondary)' 
        }}>
          ← Directory
        </Link>
      </div>
    </aside>
  );
}
