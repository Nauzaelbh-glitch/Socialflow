import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';

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

export const postQueue = new Queue('post-publishing', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});

export interface PublishJobData {
  postId: string;
  companyId: string;
  platformAccountId: string;
  platform: string;
  content: string;
  mediaUrls?: string[];
}

export interface MetricsJobData {
  accountId: string;
  companyId: string;
  platform: string;
  dateFrom?: string;
  dateTo?: string;
}

export const metricsQueue = new Queue('metrics-collection', {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'fixed',
      delay: 5000,
    },
    removeOnComplete: 50,
    removeOnFail: 100,
  },
});

export async function addPublishJob(data: PublishJobData, scheduledAt?: Date) {
  const jobOptions = scheduledAt
    ? {
        delay: scheduledAt.getTime() - Date.now(),
        jobId: `publish-${data.postId}-${data.platformAccountId}`,
      }
    : {
        jobId: `publish-${data.postId}-${data.platformAccountId}-${Date.now()}`,
      };

  return postQueue.add('publish', data, jobOptions);
}

export async function addMetricsJob(data: MetricsJobData) {
  return metricsQueue.add('collect', data, {
    repeat: {
      pattern: '*/15 * * * *',
    },
    jobId: `metrics-${data.accountId}`,
  });
}

export async function getQueueStats() {
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    postQueue.getWaitingCount(),
    postQueue.getActiveCount(),
    postQueue.getCompletedCount(),
    postQueue.getFailedCount(),
    postQueue.getDelayedCount(),
  ]);

  return {
    waiting,
    active,
    completed,
    failed,
    delayed,
    total: waiting + active + completed + failed + delayed,
  };
}

export async function retryFailedJobs() {
  const failedJobs = await postQueue.getFailed();
  
  for (const job of failedJobs) {
    await job.retry();
  }
  
  return failedJobs.length;
}
