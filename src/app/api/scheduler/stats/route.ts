import { NextResponse } from 'next/server';
import { jobQueue } from '@/lib/scheduler';

export async function GET() {
  try {
    const stats = await jobQueue.getQueueStats();
    
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error getting scheduler stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get scheduler stats',
        data: null 
      },
      { status: 500 }
    );
  }
}
