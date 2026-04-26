import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 1. Generate Link
    const { data: linkData, error: authError } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.name,
          interest: data.interest,
          role: 'collector'
        }
      }
    });

    if (authError) {
      console.error('Auth creation error:', authError);
      return NextResponse.json({ error: `Auth Error: ${authError.message}` }, { status: 500 });
    }

    const userId = linkData.user.id;
    const actionLink = linkData.properties.action_link;

    // 2. Insert into collectors table
    const { error: dbError } = await supabase
      .from('collectors')
      .insert({
        user_id: userId,
        full_name: data.name
      });

    if (dbError) {
      console.error('Supabase insert error:', dbError);
      // Optional: rollback user
      await supabase.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // 3. Send Verification Email via Spaceship SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'mail.spacemail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    try {
      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'Rare Plant Vendors'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
        replyTo: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
        to: data.email,
        subject: "Verify Your Collector Access - Rare Plant Vendors",
        text: `Welcome to the Inner Circle, ${data.name || 'Collector'}!\n\nThank you for joining Rare Plant Vendors. Please verify your email to access your collector portal, save wishlists, and track provenance.\n\nPlease copy and paste the following link into your browser to verify your email:\n${actionLink}\n\nIf you did not request this, please safely ignore this email.\n\n— The Rare Plant Vendors Team`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #1a2a1a; border-radius: 8px; padding: 30px; background-color: #0a1a0f; color: #f5f5f5;">
            <h1 style="color: #c9a84c; text-align: center;">Welcome to the Inner Circle!</h1>
            <p>Hi ${data.name || 'Collector'},</p>
            <p>Thank you for creating an account on Rare Plant Vendors. To secure your access to the Collector Portal, start saving wishlists, and track botanical provenance, please verify your email address.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${actionLink}" style="background-color: #c9a84c; color: #0a1a0f; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Verify Email & Login</a>
            </div>
            <p>If you did not request this, please safely ignore this email.</p>
            <p style="font-size: 0.8em; color: #888; margin-top: 30px;">— The Rare Plant Vendors Team</p>
          </div>
        `,
      });
    } catch (mailError) {
      console.error('Failed to send verification email:', mailError);
      return NextResponse.json({ success: true, email_sent: false, message: 'Account created but failed to send verification email.' });
    }

    return NextResponse.json({ success: true, email_sent: true });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
