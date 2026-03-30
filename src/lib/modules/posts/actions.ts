'use server';

import { prisma } from '@/lib/db';
import { createPostSchema, updatePostSchema, CreatePostInput, UpdatePostInput } from './schema';
import { revalidatePath } from 'next/cache';

export async function createPost(data: CreatePostInput, userId: string) {
  const post = await prisma.post.create({
    data: {
      companyId: data.companyId,
      userId,
      title: data.title,
      content: data.content as object,
      status: data.scheduledAt ? 'SCHEDULED' : 'DRAFT',
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      visibility: data.visibility,
      platforms: {
        create: data.platforms.map((accountId) => ({
          socialAccountId: accountId,
          status: 'DRAFT',
        })),
      },
    },
    include: {
      platforms: {
        include: {
          socialAccount: true,
        },
      },
    },
  });

  revalidatePath('/dashboard/posts');
  return post;
}

export async function updatePost(id: string, data: UpdatePostInput) {
  const post = await prisma.post.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.content !== undefined && { content: data.content as object }),
      ...(data.scheduledAt !== undefined && {
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        status: data.scheduledAt ? 'SCHEDULED' : 'DRAFT',
      }),
      ...(data.visibility !== undefined && { visibility: data.visibility }),
    },
  });

  revalidatePath('/dashboard/posts');
  return post;
}

export async function deletePost(id: string) {
  await prisma.post.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidatePath('/dashboard/posts');
}

export async function getPost(id: string) {
  return prisma.post.findUnique({
    where: { id, deletedAt: null },
    include: {
      platforms: {
        include: {
          socialAccount: true,
        },
      },
      media: {
        include: {
          media: true,
        },
      },
      template: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export async function getPosts(companyId: string, filters?: {
  status?: string;
  platform?: string;
  fromDate?: string;
  toDate?: string;
}) {
  const where: object = {
    companyId,
    deletedAt: null,
    ...(filters?.status && { status: filters.status as any }),
    ...(filters?.fromDate && { createdAt: { gte: new Date(filters.fromDate) } }),
    ...(filters?.toDate && { createdAt: { lte: new Date(filters.toDate) } }),
  };

  return prisma.post.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      platforms: {
        include: {
          socialAccount: true,
        },
      },
    },
  });
}

export async function getScheduledPosts() {
  return prisma.post.findMany({
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
}
