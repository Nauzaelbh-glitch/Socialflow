import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { prisma } from '@/lib/db';
import { getAdapter } from '@/lib/modules/social-accounts/factory';
import type { MetricsJobData } from '@/lib/queue';
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

const worker = new Worker<MetricsJobData>(
  'metrics-collection',
  async (job: Job<MetricsJobData>) => {
    const { accountId, companyId, platform, dateFrom, dateTo } = job.data;

    console.log(`Collecting metrics for account ${accountId}`);

    const account = await prisma.socialAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error(`Account ${accountId} not found`);
    }

    const adapter = getAdapter(platform as Platform);

    const metrics = await adapter.getMetrics(
      account.accessTokenEncrypted,
      dateFrom ? new Date(dateFrom) : undefined,
      dateTo ? new Date(dateTo) : undefined
    );

    await prisma.accountAnalytics.create({
      data: {
        socialAccountId: accountId,
        collectedAt: new Date(),
        followersCount: metrics.followers,
        followingCount: metrics.following,
        postsCount: metrics.postsCount,
        engagementRate: metrics.engagements && metrics.impressions
          ? metrics.engagements / metrics.impressions
          : undefined,
        metrics: metrics as object,
      },
    });

    console.log(`Metrics collected for account ${accountId}:`, metrics);

    return { success: true, metrics };
  },
  {
    connection,
    concurrency: 3,
  }
);

worker.on('completed', (job, result) => {
  console.log(`Metrics job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Metrics job ${job?.id} failed:`, err.message);
});

worker.on('error', (err) => {
  console.error('Metrics worker error:', err);
});

export { worker };
