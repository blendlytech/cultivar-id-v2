import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { wishlistMatchService } from '@/lib/services/wishlistMatchService';

/**
 * POST — Add a wishlist item and trigger matching engine.
 * Body: { species_name: string, notes?: string }
 * Auth: Supabase JWT required
 */
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { species_name, notes } = await request.json();
    if (!species_name?.trim()) {
      return NextResponse.json({ error: 'species_name is required' }, { status: 400 });
    }

    // 1. Insert wishlist item
    const { data: wishlistItem, error: insertErr } = await supabase
      .from('wishlists')
      .insert({ user_id: user.id, species_name: species_name.trim(), notes: notes || null })
      .select()
      .single();

    if (insertErr) throw insertErr;

    // 2. Trigger the Matching Engine (Centralized in wishlistMatchService)
    const matchCount = await wishlistMatchService.processNewWishlistItem(
      wishlistItem.id,
      species_name.trim()
    );

    return NextResponse.json({
      success: true,
      wishlist_id: wishlistItem.id,
      matches_found: matchCount,
    });
  } catch (error: any) {
    console.error('Wishlist error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

/**
 * GET — Fetch current user's wishlist items.
 */
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { data } = await supabase
      .from('wishlists')
      .select('id, species_name, notes, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return NextResponse.json({ items: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
