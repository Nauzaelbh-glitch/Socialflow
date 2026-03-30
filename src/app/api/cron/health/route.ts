import { NextResponse } from 'next/server';
import { getQueueStats } from '@/lib/queue';

export async function GET() {
  try {
    const stats = await getQueueStats();
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      queues: {
        postPublishing: stats,
      },
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
