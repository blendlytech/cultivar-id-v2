import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'onboarding-debug.log');

function log(message: string, data?: any) {
  try {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message} ${data ? JSON.stringify(data, null, 2) : ''}\n`;
    fs.appendFileSync(LOG_FILE, logMessage);
  } catch (e) {
    console.error('Logging failed', e);
  }
  console.log(message, data);
}

function getInternalTier(tier: string): string {
  const mapping: Record<string, string> = {
    'sprout': 'seedling',
    'bloom': 'visibility',
    'canopy': 'authority',
    'elite': 'elite',
    'free': 'seedling',
    'seedling': 'seedling',
    'visibility': 'visibility',
    'authority': 'authority'
  };
  return mapping[tier.toLowerCase()] || 'seedling';
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    log('Onboarding request received', { email: data.email, businessName: data.businessName });
    
    // 1. Check if user already exists
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users.find(u => u.email === data.email);

    let userId;
    let actionLink;

    if (existingUser) {
      userId = existingUser.id;
      
      // If already verified, just tell them to login
      if (existingUser.email_confirmed_at) {
        return NextResponse.json({ 
          error: "This email is already registered and verified. Please proceed to login.",
          code: 'already_verified'
        }, { status: 400 });
      }

      // If not verified, update password and get a new link
      const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(userId, {
        password: data.password || 'TemporaryPassword123!',
        user_metadata: {
          business_name: data.businessName,
          role: 'vendor'
        }
      });

      if (updateError) {
        console.error('Update user error:', updateError);
        return NextResponse.json({ error: `Update Error: ${updateError.message}` }, { status: 500 });
      }

      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: 'signup',
        email: data.email,
        password: data.password || 'TemporaryPassword123!'
      });

      if (linkError) {
        console.error('Link generation error:', linkError);
        return NextResponse.json({ error: `Link Error: ${linkError.message}` }, { status: 500 });
      }

      actionLink = linkData.properties.action_link;
    } else {
      // Create new user
      const { data: linkData, error: authError } = await supabase.auth.admin.generateLink({
        type: 'signup',
        email: data.email,
        password: data.password || 'TemporaryPassword123!',
        options: {
          data: {
            business_name: data.businessName,
            role: 'vendor'
          }
        }
      });

      if (authError) {
        console.error('Auth creation error:', authError);
        return NextResponse.json({ error: `Auth Error: ${authError.message}` }, { status: 500 });
      }

      userId = linkData.user.id;
      actionLink = linkData.properties.action_link;
    }

    // 2. Generate a simple slug from business name or owner name
    const nameToSlug = data.businessName || data.ownerName || 'vendor';
    const slug = nameToSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // 3. Upsert into vendors
    const { data: newVendor, error } = await supabase
      .from('vendors')
      .upsert({
        user_id: userId,
        name: data.businessName || data.ownerName || data.email?.split('@')[0] || 'New Vendor',
        slug: slug + '-' + Date.now().toString().slice(-4),
        owner_name: data.ownerName,
        contact_email: data.email,
        phone_number: data.phone,
        website_url: data.website,
        instagram: data.instagram,
        facebook: data.facebook,
        bio: data.bio,
        location_city: data.locationCity,
        location_state: data.locationState,
        location_country: data.locationCountry,
        specialty: data.specialties,
        tier: data.tier,
        account_tier: getInternalTier(data.tier) as any,
        subscription_status: (data.tier === 'seedling' || data.tier === 'free') ? 'active' : 'pending_payment',
        is_elite: data.tier === 'elite' || data.tier === 'canopy'
      }, { onConflict: 'contact_email' })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      await supabase.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 4. Send Verification Email via Spaceship SMTP (Nodemailer)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'mail.spacemail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false // Helps with some shared hosting environments
      }
    });

    log('Verifying SMTP connection...');
    try {
      await transporter.verify();
      log('SMTP connection verified');
    } catch (verifyError: any) {
      log('SMTP Verification Failed', { error: verifyError.message });
      // We'll continue anyway, but log the failure
    }

    log('Attempting to send email via SMTP', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
    });

    try {
      const info = await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'Rare Plant Vendors'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
        replyTo: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
        to: data.email,
        subject: "Verify Your Vendor Account - Rare Plant Vendors",
        text: `Welcome to the Authority Suite, ${data.businessName || 'Vendor'}!\n\nThank you for applying for a vendor directory listing on Rare Plant Vendors. To secure your position and access your dashboard, you must verify your email address.\n\nPlease copy and paste the following link into your browser to verify your email:\n${actionLink}\n\nIf you did not request this, please safely ignore this email.\n\n— The Rare Plant Vendors Team`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4c97a; border-radius: 8px; padding: 30px; background-color: #fafaf8; color: #0a1a0f;">
            <h1 style="color: #c9a84c; text-align: center;">Welcome to the Authority Suite!</h1>
            <p>Hi ${data.businessName || 'Vendor'},</p>
            <p>Thank you for applying for a vendor directory listing on Rare Plant Vendors. To secure your position and access your dashboard, you must verify your email address.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${actionLink}" style="background-color: #c9a84c; color: #0a1a0f; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Verify Email & Access Dashboard</a>
            </div>
            <p>If you did not request this, please safely ignore this email.</p>
            <p style="font-size: 0.8em; color: #666; margin-top: 30px;">— The Rare Plant Vendors Team</p>
          </div>
        `,
      });
      log('Email sent successfully', { messageId: info.messageId });
    } catch (mailError: any) {
      log('CRITICAL: Email sending failed', { error: mailError.message, stack: mailError.stack });
      // Log the action link server-side only for manual recovery — NEVER expose to client
      log('Recovery action link (server-only)', { actionLink });
      return NextResponse.json({ 
        success: true, 
        vendor: newVendor, 
        email_sent: false, 
        message: 'Vendor created but verification email could not be sent. Please contact support.' 
      });
    }

    return NextResponse.json({ success: true, vendor: newVendor, email_sent: true });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
