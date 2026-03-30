import { Platform } from '@prisma/client';
import type { PlatformAdapter, PostContent, PlatformMetrics, AccountInfo, PublishResult } from '../types';

const FACEBOOK_API_VERSION = 'v18.0';

export class FacebookAdapter implements PlatformAdapter {
  platform: Platform = 'FACEBOOK';

  private getConfig() {
    return {
      clientId: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/social/callback/facebook`,
    };
  }

  getOAuthUrl(state: string): string {
    const config = this.getConfig();
    const scopes = [
      'pages_manage_posts',
      'pages_read_engagement',
      'instagram_basic',
      'instagram_content_publish',
      'instagram_manage_insights',
    ].join(',');

    return `https://www.facebook.com/${FACEBOOK_API_VERSION}/dialog/oauth?` +
      `client_id=${config.clientId}` +
      `&redirect_uri=${encodeURIComponent(config.redirectUri)}` +
      `&scope=${scopes}` +
      `&state=${state}`;
  }

  async exchangeCodeForToken(code: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresAt?: Date;
  }> {
    const config = this.getConfig();

    const response = await fetch(
      `https://graph.facebook.com/${FACEBOOK_API_VERSION}/oauth/access_token?` +
        `client_id=${config.clientId}` +
        `&client_secret=${config.clientSecret}` +
        `&code=${code}` +
        `&redirect_uri=${encodeURIComponent(config.redirectUri)}`
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

  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresAt?: Date;
  }> {
    const config = this.getConfig();

    const response = await fetch(
      `https://graph.facebook.com/${FACEBOOK_API_VERSION}/oauth/access_token?` +
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
      `https://graph.facebook.com/${FACEBOOK_API_VERSION}/me?` +
        `fields=id,name,username,profile_picture&access_token=${accessToken}`
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return {
      id: data.id,
      name: data.name,
      username: data.username,
      profileImageUrl: data.profile_picture?.data?.url,
    };
  }

  async getPages(accessToken: string): Promise<Array<{ id: string; name: string; category: string }>> {
    const response = await fetch(
      `https://graph.facebook.com/${FACEBOOK_API_VERSION}/me/accounts?access_token=${accessToken}`
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.data || [];
  }

  async publishPost(accessToken: string, content: PostContent): Promise<PublishResult> {
    try {
      const pageToken = accessToken;

      let endpoint = `https://graph.facebook.com/${FACEBOOK_API_VERSION}/me/feed`;
      const params: Record<string, string> = {
        message: content.text,
      };

      if (content.mediaUrls?.length) {
        const mediaId = await this.uploadPhoto(pageToken, content.mediaUrls[0]);
        if (mediaId) {
          params.attached_media = JSON.stringify([{ media_fbid: mediaId }]);
        }
      }

      const response = await fetch(`${endpoint}?access_token=${pageToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (data.error) {
        return {
          success: false,
          error: data.error.message,
          errorCode: data.error.code?.toString(),
        };
      }

      return {
        success: true,
        platformPostId: data.id,
        postUrl: `https://www.facebook.com/${data.id}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  private async uploadPhoto(accessToken: string, imageUrl: string): Promise<string | null> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/${FACEBOOK_API_VERSION}/me/photos?` +
          `url=${encodeURIComponent(imageUrl)}` +
          `&published=false&access_token=${accessToken}`,
        { method: 'POST' }
      );

      const data = await response.json();
      return data.id || null;
    } catch {
      return null;
    }
  }

  async deletePost(accessToken: string, postId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${postId}?access_token=${accessToken}`,
        { method: 'DELETE' }
      );

      const data = await response.json();
      return data.success === true;
    } catch {
      return false;
    }
  }

  async getMetrics(accessToken: string, dateFrom?: Date, dateTo?: Date): Promise<PlatformMetrics> {
    const since = dateFrom ? Math.floor(dateFrom.getTime() / 1000) : Math.floor(Date.now() / 1000 - 30 * 24 * 60 * 60);
    const until = dateTo ? Math.floor(dateTo.getTime() / 1000) : Math.floor(Date.now() / 1000);

    try {
      const response = await fetch(
        `https://graph.facebook.com/${FACEBOOK_API_VERSION}/me/insights?` +
          `metric=page_post_engagements,page_impressions,page_reach,page_fans&` +
          `period=day&since=${since}&until=${until}&access_token=${accessToken}`
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const metrics: PlatformMetrics = {};
      const values: Record<string, number[]> = {};

      for (const metric of data.data || []) {
        values[metric.name] = metric.values.map((v: { value: number }) => v.value);
      }

      if (values.page_impressions) {
        metrics.impressions = values.page_impressions.reduce((a: number, b: number) => a + b, 0);
      }
      if (values.page_reach) {
        metrics.reach = values.page_reach.reduce((a: number, b: number) => a + b, 0);
      }
      if (values.page_post_engagements) {
        metrics.engagements = values.page_post_engagements.reduce((a: number, b: number) => a + b, 0);
      }
      if (values.page_fans) {
        metrics.followers = values.page_fans[values.page_fans.length - 1];
      }

      return metrics;
    } catch {
      return {};
    }
  }

  validateWebhook(payload: unknown, signature: string): boolean {
    const expected = `sha256=${require('crypto')
      .createHmac('sha256', process.env.FACEBOOK_APP_SECRET!)
      .update(JSON.stringify(payload))
      .digest('hex')}`;

    return signature === expected;
  }
}
