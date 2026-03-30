'use server';

import { prisma } from '@/lib/db';
import { addPublishJob, getQueueStats, retryFailedJobs } from '@/lib/queue';
import type { PublishJobData } from '@/lib/queue';
import { Platform } from '@prisma/client';

export async function schedulePost(postId: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      platforms: {
        include: {
          socialAccount: true,
        },
      },
    },
  });

  if (!post) {
    throw new Error('Post not found');
  }

  if (post.status !== 'SCHEDULED' || !post.scheduledAt) {
    throw new Error('Post is not scheduled');
  }

  for (const platform of post.platforms) {
    if (platform.socialAccount.status !== 'ACTIVE') {
      continue;
    }

    const content = (post.content as Record<string, { text: string; mediaUrls?: string[] }>)[
      platform.socialAccount.platform.toLowerCase()
    ];

    if (!content?.text) {
      continue;
    }

    const jobData: PublishJobData = {
      postId: post.id,
      companyId: post.companyId,
      platformAccountId: platform.socialAccountId,
      platform: platform.socialAccount.platform,
      content: content.text,
      mediaUrls: content.mediaUrls,
    };

    await addPublishJob(jobData, post.scheduledAt);
  }

  return { success: true, message: 'Post scheduled for publication' };
}

export async function publishNow(postId: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      platforms: {
        include: {
          socialAccount: true,
        },
      },
    },
  });

  if (!post) {
    throw new Error('Post not found');
  }

  await prisma.post.update({
    where: { id: postId },
    data: { status: 'PUBLISHING' },
  });

  for (const platform of post.platforms) {
    if (platform.socialAccount.status !== 'ACTIVE') {
      await prisma.postPlatform.update({
        where: { id: platform.id },
        data: {
          status: 'FAILED',
          errorMessage: 'Account not active',
        },
      });
      continue;
    }

    const content = (post.content as Record<string, { text: string; mediaUrls?: string[] }>)[
      platform.socialAccount.platform.toLowerCase()
    ];

    if (!content?.text) {
      await prisma.postPlatform.update({
        where: { id: platform.id },
        data: {
          status: 'FAILED',
          errorMessage: 'No content for this platform',
        },
      });
      continue;
    }

    const jobData: PublishJobData = {
      postId: post.id,
      companyId: post.companyId,
      platformAccountId: platform.socialAccountId,
      platform: platform.socialAccount.platform,
      content: content.text,
      mediaUrls: content.mediaUrls,
    };

    await addPublishJob(jobData);
  }

  return { success: true, message: 'Post publication initiated' };
}

export async function getSchedulerStats() {
  return getQueueStats();
}

export async function retryFailed() {
  return retryFailedJobs();
}

export async function getScheduledPostsForProcessing() {
  const posts = await prisma.post.findMany({
    where: {
      status: 'SCHEDULED',
      scheduledAt: {
        lte: new Date(),
      },
      deletedAt: null,
    },
    include: {
      platforms: {
        include: {
          socialAccount: true,
        },
      },
    },
  });

  return posts;
}

export async function processScheduledPosts() {
  const posts = await getScheduledPostsForProcessing();

  for (const post of posts) {
    try {
      await schedulePost(post.id);
    } catch (error) {
      console.error(`Error scheduling post ${post.id}:`, error);
    }
  }

  return { processed: posts.length };
}
