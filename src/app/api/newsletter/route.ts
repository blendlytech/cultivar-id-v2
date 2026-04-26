import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: email.toLowerCase().trim() });

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ message: "You're already subscribed!" }, { status: 200 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, message: "You're on the list!" });
  } catch (error: any) {
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
