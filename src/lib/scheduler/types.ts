export interface ScheduledJob {
  id: string;
  type: 'publish_post' | 'sync_analytics' | 'send_notification';
  postId?: string;
  companyId?: string;
  scheduledFor: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  retryCount: number;
  maxRetries: number;
  metadata?: Record<string, any>;
}

export interface PostJobData {
  postId: string;
  companyId: string;
  accountId: string;
  platform: string;
  content: string;
  mediaUrls?: string[];
}

export interface AnalyticsSyncJobData {
  companyId: string;
  accountId: string;
  platform: string;
  dateRange: {
    start: Date;
    end: Date;
  };
}

export type JobPriority = 'high' | 'normal' | 'low';

export interface QueueConfig {
  defaultPriority: JobPriority;
  maxRetries: number;
  retryDelay: number;
  timeout: number;
}
