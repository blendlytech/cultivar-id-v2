import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const body = await request.json();
    const { verification_hash } = body;

    if (!verification_hash) {
      return NextResponse.json({ error: 'Missing verification hash' }, { status: 400 });
    }

    // 1. Get collector ID
    const { data: collector } = await supabase
      .from('collectors')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!collector) {
      return NextResponse.json({ error: 'Collector profile not found' }, { status: 404 });
    }

    // 2. Find passport by hash
    const { data: passport, error: passportError } = await supabase
      .from('digital_passports')
      .select('id, vendor_id, current_owner_id, specimen_name')
      .eq('verification_hash', verification_hash)
      .single();

    if (passportError || !passport) {
      return NextResponse.json({ error: 'Invalid passport code' }, { status: 404 });
    }

    // 3. Check if already claimed by someone else
    if (passport.current_owner_id) {
        if (passport.current_owner_id === collector.id) {
            return NextResponse.json({ error: 'You already own this passport' }, { status: 400 });
        }
        return NextResponse.json({ error: 'This passport has already been claimed by another collector' }, { status: 403 });
    }

    // 4. Perform the transfer (Atomic update)
    const { error: updateError } = await supabase
      .from('digital_passports')
      .update({ current_owner_id: collector.id })
      .eq('id', passport.id);

    if (updateError) throw updateError;

    // 5. Record the history
    await supabase
      .from('passport_ownership_history')
      .insert({
        passport_id: passport.id,
        new_owner_id: collector.id,
        vendor_id: passport.vendor_id
      });

    // 6. Record transaction
    await supabase
      .from('transactions')
      .insert({
        digital_passport_id: passport.id,
        vendor_id: passport.vendor_id,
        buyer_id: collector.id
      });

    return NextResponse.json({ 
        success: true, 
        message: `Successfully claimed ${passport.specimen_name}!`,
        passport_id: passport.id 
    });

  } catch (error: any) {
    console.error('Claim error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
