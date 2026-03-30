import { NextRequest, NextResponse } from 'next/server';
import { jobQueue } from '@/lib/scheduler';
import { JobPriority } from '@/lib/scheduler/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, postId, companyId, accountId, scheduledFor, priority } = body;

    if (!type || !scheduledFor) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: type and scheduledFor are required',
          data: null 
        },
        { status: 400 }
      );
    }

    const scheduledDate = new Date(scheduledFor);
    if (isNaN(scheduledDate.getTime())) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid scheduledFor date',
          data: null 
        },
        { status: 400 }
      );
    }

    let jobId: string;

    switch (type) {
      case 'publish_post':
        if (!postId || !companyId) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Missing required fields for publish_post: postId and companyId',
              data: null 
            },
            { status: 400 }
          );
        }
        jobId = await jobQueue.addPostPublishJob({
          postId,
          companyId,
          scheduledFor: scheduledDate,
          priority: priority as JobPriority,
        });
        break;

      case 'sync_analytics':
        if (!companyId || !accountId) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Missing required fields for sync_analytics: companyId and accountId',
              data: null 
            },
            { status: 400 }
          );
        }
        jobId = await jobQueue.addAnalyticsSyncJob({
          companyId,
          accountId,
          scheduledFor: scheduledDate,
        });
        break;

      default:
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid job type. Must be "publish_post" or "sync_analytics"',
            data: null 
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: {
        jobId,
        type,
        scheduledFor: scheduledDate.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create job',
        data: null 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    if (status) {
      const jobs = await jobQueue.getJobsByStatus(status as any);
      return NextResponse.json({
        success: true,
        data: jobs,
      });
    }

    const stats = await jobQueue.getQueueStats();
    return NextResponse.json({
      success: true,
      data: {
        stats,
      },
    });
  } catch (error) {
    console.error('Error getting jobs:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get jobs',
        data: null 
      },
      { status: 500 }
    );
  }
}
