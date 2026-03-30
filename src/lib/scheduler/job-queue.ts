import { redis } from '@/lib/redis';
import { ScheduledJob, JobPriority, QueueConfig } from './types';

const QUEUE_KEYS = {
  pending: 'queue:pending',
  processing: 'queue:processing',
  completed: 'queue:completed',
  failed: 'queue:failed',
  delayed: 'queue:delayed',
};

const DEFAULT_CONFIG: QueueConfig = {
  defaultPriority: 'normal',
  maxRetries: 3,
  retryDelay: 5000,
  timeout: 30000,
};

export class JobQueue {
  private config: QueueConfig;

  constructor(config: Partial<QueueConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async addJob(job: Omit<ScheduledJob, 'id' | 'status' | 'retryCount'>): Promise<string> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const fullJob: ScheduledJob = {
      ...job,
      id: jobId,
      status: 'pending',
      retryCount: 0,
    };

    await redis.set(`job:${jobId}`, JSON.stringify(fullJob), { ex: 86400 });
    
    const score = job.scheduledFor.getTime();
    await redis.zadd(QUEUE_KEYS.pending, { score, member: jobId });

    await redis.incr('stats:jobs:total');

    return jobId;
  }

  async addPostPublishJob(data: {
    postId: string;
    companyId: string;
    scheduledFor: Date;
    priority?: JobPriority;
  }): Promise<string> {
    return this.addJob({
      type: 'publish_post',
      postId: data.postId,
      companyId: data.companyId,
      scheduledFor: data.scheduledFor,
      maxRetries: this.config.maxRetries,
      metadata: { priority: data.priority || this.config.defaultPriority },
    });
  }

  async addAnalyticsSyncJob(data: {
    companyId: string;
    accountId: string;
    scheduledFor: Date;
  }): Promise<string> {
    return this.addJob({
      type: 'sync_analytics',
      companyId: data.companyId,
      scheduledFor: data.scheduledFor,
      maxRetries: this.config.maxRetries,
      metadata: { accountId: data.accountId },
    });
  }

  async getJob(jobId: string): Promise<ScheduledJob | null> {
    const data = await redis.get<string>(`job:${jobId}`);
    if (!data) return null;
    return JSON.parse(data);
  }

  async getNextJob(): Promise<ScheduledJob | null> {
    const now = Date.now();
    
    const nextJobId = await redis.zpopmin(QUEUE_KEYS.pending, 1);
    
    if (!nextJobId || nextJobId.length === 0) {
      return null;
    }

    const jobId = nextJobId[0] as string;
    const score = nextJobId[1] as number;

    if (score > now) {
      await redis.zadd(QUEUE_KEYS.pending, { score, member: jobId });
      return null;
    }

    const job = await this.getJob(jobId);
    
    if (!job) {
      return null;
    }

    job.status = 'processing';
    await redis.set(`job:${jobId}`, JSON.stringify(job), { ex: 86400 });
    
    await redis.zadd(QUEUE_KEYS.processing, { score: now, member: jobId });

    return job;
  }

  async completeJob(jobId: string): Promise<void> {
    const job = await this.getJob(jobId);
    
    if (!job) return;

    job.status = 'completed';
    await redis.set(`job:${jobId}`, JSON.stringify(job), { ex: 86400 });
    
    await redis.zrem(QUEUE_KEYS.processing, jobId);
    await redis.zadd(QUEUE_KEYS.completed, { score: Date.now(), member: jobId });
    
    await redis.incr('stats:jobs:completed');
  }

  async failJob(jobId: string, error?: string): Promise<void> {
    const job = await this.getJob(jobId);
    
    if (!job) return;

    if (job.retryCount < job.maxRetries) {
      job.retryCount += 1;
      job.status = 'pending';
      await redis.set(`job:${jobId}`, JSON.stringify(job), { ex: 86400 });
      
      await redis.zrem(QUEUE_KEYS.processing, jobId);
      
      const delayedTime = Date.now() + this.config.retryDelay;
      await redis.zadd(QUEUE_KEYS.delayed, { score: delayedTime, member: jobId });
      
      setTimeout(async () => {
        const currentJob = await this.getJob(jobId);
        if (currentJob && currentJob.status === 'pending') {
          await redis.zrem(QUEUE_KEYS.delayed, jobId);
          await redis.zadd(QUEUE_KEYS.pending, { score: currentJob.scheduledFor.getTime(), member: jobId });
        }
      }, this.config.retryDelay);
    } else {
      job.status = 'failed';
      await redis.set(`job:${jobId}`, JSON.stringify(job), { ex: 86400 });
      
      await redis.zrem(QUEUE_KEYS.processing, jobId);
      await redis.zadd(QUEUE_KEYS.failed, { score: Date.now(), member: jobId });
      
      await redis.incr('stats:jobs:failed');
    }
  }

  async getQueueStats() {
    const [pending, processing, completed, failed] = await Promise.all([
      redis.zcard(QUEUE_KEYS.pending),
      redis.zcard(QUEUE_KEYS.processing),
      redis.zcard(QUEUE_KEYS.completed),
      redis.zcard(QUEUE_KEYS.failed),
    ]);

    return {
      pending,
      processing,
      completed,
      failed,
      total: pending + processing + completed + failed,
    };
  }

  async getJobsByStatus(status: ScheduledJob['status']): Promise<ScheduledJob[]> {
    const key = status === 'pending' ? QUEUE_KEYS.pending :
                status === 'processing' ? QUEUE_KEYS.processing :
                status === 'completed' ? QUEUE_KEYS.completed :
                QUEUE_KEYS.failed;

    const jobIds = await redis.zrange(key, 0, -1);
    
    const jobs = await Promise.all(
      jobIds.map(id => this.getJob(id as string))
    );

    return jobs.filter((job): job is ScheduledJob => job !== null);
  }
}

export const jobQueue = new JobQueue();
