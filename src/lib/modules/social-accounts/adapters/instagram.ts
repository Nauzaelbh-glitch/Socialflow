import { Platform } from '@prisma/client';
import type { PlatformAdapter, PostContent, PlatformMetrics, AccountInfo, PublishResult } from '../types';

const INSTAGRAM_API_VERSION = 'v18.0';

export class InstagramAdapter implements PlatformAdapter {
  platform: Platform = 'INSTAGRAM';

  private getConfig() {
    return {
      clientId: process.env.INSTAGRAM_APP_ID!,
      clientSecret: process.env.INSTAGRAM_APP_SECRET!,
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/social/callback/instagram`,
    };
  }

  getOAuthUrl(state: string): string {
    const config = this.getConfig();
    const scopes = [
      'instagram_basic',
      'instagram_content_publish',
      'instagram_manage_comments',
      'instagram_manage_insights',
    ].join(',');

    return `https://api.instagram.com/${INSTAGRAM_API_VERSION}/oauth/authorize?` +
      `client_id=${config.clientId}` +
      `&redirect_uri=${encodeURIComponent(config.redirectUri)}` +
      `&scope=${scopes}` +
      `&response_type=code&state=${state}`;
  }

  async exchangeCodeForToken(code: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresAt?: Date;
  }> {
    const config = this.getConfig();

    const response = await fetch(`https://api.instagram.com/${INSTAGRAM_API_VERSION}/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: config.redirectUri,
        code,
      }),
    });

    const data = await response.json();

    if (data.error_type) {
      throw new Error(data.error_message || 'OAuth error');
    }

    return {
      accessToken: data.access_token,
      expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : undefined,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresAt?: Date;
  }> {
    const config = this.getConfig();

    const response = await fetch(
      `https://graph.facebook.com/${INSTAGRAM_API_VERSION}/oauth/access_token?` +
        `grant_type=fb_exchange_token` +
        `&client_id=${config.clientId}` +
        `&client_secret=${config.clientSecret}` +
        `&fb_exchange_token=${refreshToken}`
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return {
      accessToken: data.access_token,
      expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : undefined,
    };
  }

  async getAccountInfo(accessToken: string): Promise<AccountInfo> {
    const response = await fetch(
      `https://graph.facebook.com/${INSTAGRAM_API_VERSION}/me?` +
        `fields=id,username, name, profile_picture_url, followers_count, follows_count, media_count&access_token=${accessToken}`
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return {
      id: data.id,
      name: data.name || data.username,
      username: data.username,
      profileImageUrl: data.profile_picture_url,
      followers: data.followers_count,
      following: data.follows_count,
      postsCount: data.media_count,
      isBusiness: data.account_type === 'BUSINESS',
    };
  }

  async getInstagramBusinessAccountId(accessToken: string): Promise<string | null> {
    const response = await fetch(
      `https://graph.facebook.com/${INSTAGRAM_API_VERSION}/me/accounts?` +
        `fields=instagram_business_account&access_token=${accessToken}`
    );

    const data = await response.json();

    if (data.error || !data.data?.length) {
      return null;
    }

    return data.data[0]?.instagram_business_account?.id || null;
  }

  async publishPost(accessToken: string, content: PostContent): Promise<PublishResult> {
    try {
      const igUserId = await this.getInstagramBusinessAccountId(accessToken);

      if (!igUserId) {
        return {
          success: false,
          error: 'No se encontró cuenta de Instagram Business',
        };
      }

      let containerId: string | null = null;

      if (content.mediaUrls?.length) {
        const mediaResponse = await fetch(
          `https://graph.facebook.com/${INSTAGRAM_API_VERSION}/${igUserId}/media?` +
            `image_url=${encodeURIComponent(content.mediaUrls[0])}` +
            `&caption=${encodeURIComponent(content.text)}&access_token=${accessToken}`,
          { method: 'POST' }
        );

        const mediaData = await mediaResponse.json();

        if (mediaData.error) {
          return {
            success: false,
            error: mediaData.error.error_message,
          };
        }

        containerId = mediaData.id;
      } else {
        const captionResponse = await fetch(
          `https://graph.facebook.com/${INSTAGRAM_API_VERSION}/${igUserId}/media?` +
            `caption=${encodeURIComponent(content.text)}&access_token=${accessToken}`,
          { method: 'POST' }
        );

        const captionData = await captionResponse.json();

        if (captionData.error) {
          return {
            success: false,
            error: captionData.error.error_message,
          };
        }

        containerId = captionData.id;
      }

      if (!containerId) {
        return {
          success: false,
          error: 'Error al crear container de publicación',
        };
      }

      const publishResponse = await fetch(
        `https://graph.facebook.com/${INSTAGRAM_API_VERSION}/${igUserId}/media_publish?` +
          `creation_id=${containerId}&access_token=${accessToken}`,
        { method: 'POST' }
      );

      const publishData = await publishResponse.json();

      if (publishData.error) {
        return {
          success: false,
          error: publishData.error.error_message,
        };
      }

      return {
        success: true,
        platformPostId: publishData.id,
        postUrl: `https://www.instagram.com/p/${publishData.id}/`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  async deletePost(accessToken: string, postId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/${INSTAGRAM_API_VERSION}/${postId}?access_token=${accessToken}`,
        { method: 'DELETE' }
      );

      const data = await response.json();
      return data.success === true || data.error?.code === 100;
    } catch {
      return false;
    }
  }

  async getMetrics(accessToken: string, dateFrom?: Date, dateTo?: Date): Promise<PlatformMetrics> {
    const igUserId = await this.getInstagramBusinessAccountId(accessToken);

    if (!igUserId) {
      return {};
    }

    const since = dateFrom ? Math.floor(dateFrom.getTime() / 1000) : Math.floor(Date.now() / 1000 - 30 * 24 * 60 * 60);
    const until = dateTo ? Math.floor(dateTo.getTime() / 1000) : Math.floor(Date.now() / 1000);

    try {
      const response = await fetch(
        `https://graph.facebook.com/${INSTAGRAM_API_VERSION}/${igUserId}/insights?` +
          `metric=impressions,reach,engagement,saved,video_views&` +
          `period=days&since=${since}&until=${until}&access_token=${accessToken}`
      );

      const data = await response.json();

      if (data.error) {
        return {};
      }

      const metrics: PlatformMetrics = {};

      for (const metric of data.data || []) {
        const values = metric.values.map((v: { value: number }) => v.value);
        const total = values.reduce((a: number, b: number) => a + b, 0);

        switch (metric.name) {
          case 'impressions':
            metrics.impressions = total;
            break;
          case 'reach':
            metrics.reach = total;
            break;
          case 'engagement':
            metrics.engagements = total;
            break;
          case 'saved':
            metrics.saves = total;
            break;
          case 'video_views':
            metrics.videoViews = total;
            break;
        }
      }

      const accountInfo = await this.getAccountInfo(accessToken);
      metrics.followers = accountInfo.followers;

      return metrics;
    } catch {
      return {};
    }
  }

  validateWebhook(payload: unknown, signature: string): boolean {
    return true;
  }
}
