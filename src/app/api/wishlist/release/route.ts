import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

/**
 * POST — Cron handler: release leads that have passed the 24hr Elite window.
 * Secured via a shared secret in the Authorization header.
 */
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Find matches created >24h ago that haven't been released to general vendors
    const { data: pending } = await supabase
      .from('wishlist_matches')
      .select('id')
      .is('general_notified_at', null)
      .lt('created_at', twentyFourHoursAgo);

    if (pending && pending.length > 0) {
      const ids = pending.map(m => m.id);
      await supabase
        .from('wishlist_matches')
        .update({ general_notified_at: new Date().toISOString() })
        .in('id', ids);
    }

    return NextResponse.json({
      success: true,
      released: pending?.length || 0,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
