import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { prisma } from '@/lib/db';
import { getAdapter } from '@/lib/modules/social-accounts/factory';
import type { PublishJobData } from '@/lib/queue';
import { Platform } from '@prisma/client';

const connection = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? {
      host: process.env.UPSTASH_REDIS_REST_URL.replace('https://', '').split(':')[0],
      port: parseInt(process.env.UPSTASH_REDIS_REST_URL.split(':').pop() || '6379'),
      password: process.env.UPSTASH_REDIS_REST_TOKEN,
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
    }
  : new Redis({
      host: 'localhost',
      port: 6379,
    });

const worker = new Worker<PublishJobData>(
  'post-publishing',
  async (job: Job<PublishJobData>) => {
    const { postId, platformAccountId, platform, content, mediaUrls } = job.data;

    console.log(`Processing publish job ${job.id} for post ${postId} on ${platform}`);

    const account = await prisma.socialAccount.findUnique({
      where: { id: platformAccountId },
    });

    if (!account) {
      throw new Error(`Account ${platformAccountId} not found`);
    }

    if (account.status !== 'ACTIVE') {
      throw new Error(`Account ${platformAccountId} is not active`);
    }

    const adapter = getAdapter(platform as Platform);

    const result = await adapter.publishPost(account.accessTokenEncrypted, {
      text: content,
      mediaUrls,
    });

    if (!result.success) {
      throw new Error(result.error || 'Publish failed');
    }

    await prisma.postPlatform.updateMany({
      where: {
        postId,
        socialAccountId: platformAccountId,
      },
      data: {
        status: 'PUBLISHED',
        platformPostId: result.platformPostId,
        publishedAt: new Date(),
      },
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { platforms: true },
    });

    if (post) {
      const allPublished = post.platforms.every(p => p.status === 'PUBLISHED');
      const anyFailed = post.platforms.some(p => p.status === 'FAILED');
      
      await prisma.post.update({
        where: { id: postId },
        data: {
          status: allPublished ? 'PUBLISHED' : anyFailed ? 'FAILED' : 'PUBLISHING',
          publishedAt: allPublished ? new Date() : undefined,
        },
      });
    }

    console.log(`Successfully published post ${postId} to ${platform}: ${result.platformPostId}`);

    return {
      success: true,
      platformPostId: result.platformPostId,
      postUrl: result.postUrl,
    };
  },
  {
    connection,
    concurrency: 5,
    limiter: {
      max: 10,
      duration: 1000,
    },
  }
);

worker.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed:`, result);
});

worker.on('failed', async (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);

  if (job?.data.postId && job?.data.platformAccountId) {
    await prisma.postPlatform.updateMany({
      where: {
        postId: job.data.postId,
        socialAccountId: job.data.platformAccountId,
      },
      data: {
        status: 'FAILED',
        errorMessage: err.message,
        retryCount: job.attemptsMade,
      },
    });

    const post = await prisma.post.findUnique({
      where: { id: job.data.postId },
      include: { platforms: true },
    });

    if (post) {
      const allFailed = post.platforms.every(p => p.status === 'FAILED');
      
      if (allFailed) {
        await prisma.post.update({
          where: { id: job.data.postId },
          data: { status: 'FAILED' },
        });
      }
    }
  }
});

worker.on('error', (err) => {
  console.error('Worker error:', err);
});

export { worker };
