'use server';

import { prisma } from '@/lib/db';
import { connectAccountSchema, disconnectAccountSchema } from './schema';
import { getAdapter, getAllAdapters } from './factory';
import { revalidatePath } from 'next/cache';
import { Platform } from '@prisma/client';
import crypto from 'crypto';

export async function getOAuthUrl(platform: Platform): Promise<{ url: string; state: string }> {
  const adapter = getAdapter(platform);
  const state = crypto.randomBytes(16).toString('hex');

  return {
    url: adapter.getOAuthUrl(state),
    state,
  };
}

export async function connectAccount(
  companyId: string,
  userId: string,
  platform: Platform,
  authorizationCode?: string,
  pageId?: string
) {
  const adapter = getAdapter(platform);

  let accessToken: string;
  let refreshToken: string | undefined;
  let expiresAt: Date | undefined;

  if (authorizationCode) {
    const tokenData = await adapter.exchangeCodeForToken(authorizationCode);
    accessToken = tokenData.accessToken;
    refreshToken = tokenData.refreshToken;
    expiresAt = tokenData.expiresAt;
  } else {
    throw new Error('Authorization code is required');
  }

  const accountInfo = await adapter.getAccountInfo(accessToken);

  const existingAccount = await prisma.socialAccount.findFirst({
    where: {
      companyId,
      platform,
      platformAccountId: accountInfo.id,
      deletedAt: null,
    },
  });

  if (existingAccount) {
    const updated = await prisma.socialAccount.update({
      where: { id: existingAccount.id },
      data: {
        accessTokenEncrypted: accessToken,
        refreshTokenEncrypted: refreshToken,
        tokenExpiresAt: expiresAt,
        platformPageId: pageId,
        platformAccountName: accountInfo.name,
        status: 'ACTIVE',
        updatedAt: new Date(),
      },
    });

    revalidatePath('/dashboard/social-accounts');
    return updated;
  }

  const account = await prisma.socialAccount.create({
    data: {
      companyId,
      userId,
      platform,
      platformAccountId: accountInfo.id,
      platformAccountName: accountInfo.name,
      platformPageId: pageId,
      accessTokenEncrypted: accessToken,
      refreshTokenEncrypted: refreshToken,
      tokenExpiresAt: expiresAt,
      status: 'ACTIVE',
      metadata: {
        username: accountInfo.username,
        profileImageUrl: accountInfo.profileImageUrl,
      } as object,
    },
  });

  revalidatePath('/dashboard/social-accounts');
  return account;
}

export async function disconnectAccount(companyId: string, accountId: string) {
  const account = await prisma.socialAccount.findFirst({
    where: { id: accountId, companyId, deletedAt: null },
  });

  if (!account) {
    throw new Error('Account not found');
  }

  await prisma.socialAccount.update({
    where: { id: accountId },
    data: { deletedAt: new Date() },
  });

  revalidatePath('/dashboard/social-accounts');
}

export async function getSocialAccounts(companyId: string) {
  const accounts = await prisma.socialAccount.findMany({
    where: { companyId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { firstName: true, lastName: true },
      },
    },
  });

  return accounts;
}

export async function getSocialAccount(accountId: string) {
  return prisma.socialAccount.findUnique({
    where: { id: accountId },
    include: {
      company: true,
      user: {
        select: { firstName: true, lastName: true },
      },
    },
  });
}

export async function refreshAccountToken(accountId: string) {
  const account = await prisma.socialAccount.findUnique({
    where: { id: accountId },
  });

  if (!account || !account.refreshTokenEncrypted) {
    throw new Error('Account not found or no refresh token');
  }

  const adapter = getAdapter(account.platform);
  const tokenData = await adapter.refreshAccessToken(account.refreshTokenEncrypted);

  await prisma.socialAccount.update({
    where: { id: accountId },
    data: {
      accessTokenEncrypted: tokenData.accessToken,
      refreshTokenEncrypted: tokenData.refreshToken,
      tokenExpiresAt: tokenData.expiresAt,
      status: 'ACTIVE',
    },
  });

  return { success: true };
}

export async function getAvailablePlatforms() {
  return getAllAdapters();
}

export async function syncAccountStatus(accountId: string) {
  const account = await prisma.socialAccount.findUnique({
    where: { id: accountId },
  });

  if (!account) {
    throw new Error('Account not found');
  }

  try {
    const adapter = getAdapter(account.platform);
    const accountInfo = await adapter.getAccountInfo(account.accessTokenEncrypted);

    await prisma.socialAccount.update({
      where: { id: accountId },
      data: {
        status: 'ACTIVE',
        metadata: {
          username: accountInfo.username,
          profileImageUrl: accountInfo.profileImageUrl,
          followers: accountInfo.followers,
          following: accountInfo.following,
          postsCount: accountInfo.postsCount,
        } as object,
      },
    });

    return { success: true, status: 'ACTIVE' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    let newStatus: 'EXPIRED' | 'ERROR' = 'ERROR';
    if (errorMessage.includes('token') || errorMessage.includes('expired')) {
      newStatus = 'EXPIRED';
    }

    await prisma.socialAccount.update({
      where: { id: accountId },
      data: { status: newStatus },
    });

    return { success: false, status: newStatus, error: errorMessage };
  }
}
