import { NextResponse } from 'next/server';
import { processScheduledPosts } from '@/lib/modules/scheduler/actions';

export async function GET() {
  try {
    const result = await processScheduledPosts();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Cron process error:', error);
    return NextResponse.json({ error: 'Error processing scheduled posts' }, { status: 500 });
  }
}

export const maxDuration = 60;
export const dynamic = 'force-dynamic';
