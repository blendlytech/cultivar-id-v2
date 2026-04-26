import { NextResponse } from 'next/server';
import { wishlistMatchService } from '@/lib/services/wishlistMatchService';

export async function GET(request: Request) {
  try {
    // Basic security check (could be an API key in production)
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    if (process.env.CRON_SECRET && key !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const releasedCount = await wishlistMatchService.releaseDelayedLeads();
    
    return NextResponse.json({ 
      success: true, 
      released: releasedCount,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
