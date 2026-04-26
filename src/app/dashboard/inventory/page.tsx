'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import ImageUpload from '@/app/components/ImageUpload';

interface InventoryItem {
  id: string;
  species_name: string;
  variety: string | null;
  price: number | null;
  quantity: number | null;
  status: string;
  image_url: string | null;
  created_at: string;
}

const TIER_LIMITS: Record<string, number | null> = {
  seedling: 1, visibility: 3, authority: 5, elite: 10,
};

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [vendorTier, setVendorTier] = useState<string>('seedling');
  const [vendorSlug, setVendorSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState({ species_name: '', variety: '', price: '', quantity: '1', status: 'available', image_url: '' });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }

      const { data: vendor } = await supabase
        .from('vendors')
        .select('id, tier, account_tier, contact_email, slug')
        .eq('contact_email', user.email)
        .single();

      if (!vendor) { setLoading(false); return; }
      setVendorId(vendor.id);
      setVendorTier(vendor.account_tier || vendor.tier || 'seedling');
      setVendorSlug(vendor.slug);

      const { data } = await supabase
        .from('inventory')
        .select('*')
        .eq('vendor_id', vendor.id)
        .order('created_at', { ascending: false });

      setItems(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const limit = TIER_LIMITS[vendorTier];
  const atLimit = limit !== null && items.length >= limit;

  const openAdd = () => {
    setEditItem(null);
    setForm({ species_name: '', variety: '', price: '', quantity: '1', status: 'available', image_url: '' });
    setShowForm(true);
  };

  const openEdit = (item: InventoryItem) => {
    setEditItem(item);
    setForm({
      species_name: item.species_name,
      variety: item.variety || '',
      price: item.price?.toString() || '',
      quantity: item.quantity?.toString() || '1',
      status: item.status,
      image_url: item.image_url || '',
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!vendorId || !form.species_name.trim()) return;
    setSaving(true);
    const supabase = createClient();

    const payload = {
      vendor_id: vendorId,
      species_name: form.species_name.trim(),
      variety: form.variety.trim() || null,
      price: form.price ? parseFloat(form.price) : null,
      quantity: form.quantity ? parseInt(form.quantity) : 1,
      status: form.status,
      image_url: form.image_url.trim() || null,
    };

    if (editItem) {
      const { data } = await supabase.from('inventory').update(payload).eq('id', editItem.id).select().single();
      if (data) setItems(prev => prev.map(i => i.id === editItem.id ? data : i));
    } else {
      const { data } = await supabase.from('inventory').insert(payload).select().single();
      if (data) setItems(prev => [data, ...prev]);
    }

    setSaving(false);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this item from your inventory?')) return;
    const supabase = createClient();
    await supabase.from('inventory').delete().eq('id', id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const statusColor: Record<string, string> = {
    available: '#2ecc71',
    sold: '#e74c3c',
    reserved: 'var(--gold)',
    hidden: 'var(--text-secondary)',
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading inventory...</p>
      </div>
    );
  }

  const navItems = [
    { href: '/dashboard', label: '⚡ Overview' },
    { href: '/dashboard/inventory', label: '🌿 Inventory', active: true },
    { href: '/dashboard/leads', label: '🎯 Leads' },
    { href: '/dashboard/passports', label: '📜 Passports' },
    { href: '/dashboard/analytics', label: '📊 Analytics' },
    { href: '/dashboard/settings', label: '⚙️ Settings' },
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
            Inventory Management
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
      <main style={{ flex: 1, padding: '7rem 3rem 4rem' }}>
        {/* Public Link Banner */}
        {vendorSlug && (
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Your Public Listing: <span style={{ color: 'var(--gold)', fontWeight: 600 }}>rareplantvendors.com/vendors/{vendorSlug}</span>
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`https://rareplantvendors.com/vendors/${vendorSlug}`);
                alert('Public link copied to clipboard!');
              }}
              style={{ background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Copy Link
            </button>
          </div>
        )}

        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.4rem' }}>
              Inventory Management
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', margin: 0, color: 'var(--text-primary)' }}>
              {vendorTier === 'elite' ? 'Elite Stage' : 'Your Plants'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
              {items.length}{limit ? ` / ${limit}` : ''} {vendorTier === 'elite' ? 'showpieces' : 'items'} listed
              {limit && items.length >= limit * 0.8 && (
                <span style={{ color: 'var(--gold)', marginLeft: '0.5rem', fontWeight: 600 }}>
                  {atLimit ? '— Limit reached' : '— Nearly full'}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={openAdd}
            disabled={atLimit}
            className="btn-primary"
            style={{ opacity: atLimit ? 0.4 : 1, cursor: atLimit ? 'not-allowed' : 'pointer' }}
          >
            + Add Plant
          </button>
        </div>

        {/* Limit upgrade nudge */}
        {atLimit && (
          <div style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '10px', padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--gold)', marginBottom: '0.25rem' }}>Inventory Limit Reached</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Upgrade your tier to list more plants.</div>
            </div>
            <Link href="/for-vendors" className="btn-primary" style={{ textDecoration: 'none', fontSize: '0.8rem' }}>
              Upgrade Tier →
            </Link>
          </div>
        )}

        {/* Item grid */}
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px dashed var(--glass-border)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>🌱</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>No inventory yet</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Add your first plant to appear in collector searches and wishlist matching.
            </p>
            <button onClick={openAdd} className="btn-primary">Add Your First Plant</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {items.map(item => (
              <div key={item.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                    {item.species_name}
                    {item.variety && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>var. {item.variety}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                    <span style={{ color: statusColor[item.status] || 'var(--text-secondary)', fontWeight: 600, textTransform: 'capitalize' }}>● {item.status}</span>
                    {item.price != null && <span style={{ color: 'var(--gold)', fontWeight: 600 }}>${item.price.toFixed(2)}</span>}
                    {item.quantity != null && <span>Qty: {item.quantity}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => openEdit(item)} style={{ padding: '0.4rem 0.9rem', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} style={{ padding: '0.4rem 0.9rem', background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: '6px', color: '#e74c3c', fontSize: '0.8rem', cursor: 'pointer' }}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal form */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
          <div style={{ background: 'var(--bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>
              {editItem ? 'Edit Plant' : 'Add Plant'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '2rem' }}>
              This will appear in collector search and wishlist matching.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Species Name *</label>
                <input className="form-input" placeholder="e.g. Monstera Obliqua Peru" value={form.species_name} onChange={e => setForm(p => ({ ...p, species_name: e.target.value }))} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Variety / Cultivar</label>
                <input className="form-input" placeholder="e.g. Albo Variegata" value={form.variety} onChange={e => setForm(p => ({ ...p, variety: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Price (USD)</label>
                  <input className="form-input" type="number" placeholder="0.00" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Quantity</label>
                  <input className="form-input" type="number" min="1" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Status</label>
                <select className="form-input" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <ImageUpload 
                  bucket="inventory" 
                  label="Specimen Photo"
                  currentImageUrl={form.image_url}
                  onUploadComplete={(url) => setForm(p => ({ ...p, image_url: url }))}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button onClick={() => setShowForm(false)} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
              <button onClick={handleSave} className="btn-primary" disabled={saving || !form.species_name.trim()} style={{ flex: 2, opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Saving...' : editItem ? 'Save Changes' : 'Add to Inventory'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
