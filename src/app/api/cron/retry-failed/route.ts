import { NextResponse } from 'next/server';
import { retryFailed } from '@/lib/queue';

export async function POST() {
  try {
    const retried = await retryFailed();
    return NextResponse.json({ retried });
  } catch (error) {
    console.error('Retry failed jobs error:', error);
    return NextResponse.json({ error: 'Error retrying jobs' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
