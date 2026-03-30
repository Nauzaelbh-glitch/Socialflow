import { Platform } from '@prisma/client';
import type { PlatformAdapter, PostContent, PlatformMetrics, AccountInfo, PublishResult } from '../types';

const TWITTER_API_VERSION = '2';

export class TwitterAdapter implements PlatformAdapter {
  platform: Platform = 'TWITTER';

  private getConfig() {
    return {
      clientId: process.env.TWITTER_API_KEY!,
      clientSecret: process.env.TWITTER_API_SECRET!,
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/social/callback/twitter`,
    };
  }

  getOAuthUrl(state: string): string {
    const config = this.getConfig();
    const scopes = ['tweet.read', 'tweet.write', 'users.read', 'offline.access'].join('%20');

    return `https://twitter.com/i/oauth2/authorize?` +
      `response_type=code` +
      `&client_id=${config.clientId}` +
      `&redirect_uri=${encodeURIComponent(config.redirectUri)}` +
      `&scope=${scopes}` +
      `&state=${state}` +
      `&code_challenge=challenge` +
      `&code_challenge_method=plain`;
  }

  async exchangeCodeForToken(code: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresAt?: Date;
  }> {
    const config = this.getConfig();
    const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');

    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.redirectUri,
        code_verifier: 'challenge',
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error_description || 'OAuth error');
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresAt?: Date;
  }> {
    const config = this.getConfig();
    const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');

    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error_description || 'Refresh error');
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
    };
  }

  async getAccountInfo(accessToken: string): Promise<AccountInfo> {
    const response = await fetch(
      `https://api.twitter.com/${TWITTER_API_VERSION}/users/me?` +
        `user.fields=description,profile_image_url,public_metrics,verified`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const data = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0]?.detail || 'API error');
    }

    const user = data.data;

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      profileImageUrl: user.profile_image_url,
      followers: user.public_metrics?.followers_count,
      following: user.public_metrics?.following_count,
      postsCount: user.public_metrics?.tweet_count,
      isVerified: user.verified,
    };
  }

  async publishPost(accessToken: string, content: PostContent): Promise<PublishResult> {
    try {
      const response = await fetch(
        `https://api.twitter.com/${TWITTER_API_VERSION}/tweets`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            text: content.text,
          }),
        }
      );

      const data = await response.json();

      if (data.errors) {
        return {
          success: false,
          error: data.errors[0]?.detail || 'Error al publicar',
        };
      }

      const tweetId = data.data?.id;

      return {
        success: true,
        platformPostId: tweetId,
        postUrl: `https://twitter.com/i/status/${tweetId}`,
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
        `https://api.twitter.com/${TWITTER_API_VERSION}/tweets/${postId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      return response.ok || response.status === 404;
    } catch {
      return false;
    }
  }

  async getMetrics(accessToken: string, dateFrom?: Date, dateTo?: Date): Promise<PlatformMetrics> {
    try {
      const user = await this.getAccountInfo(accessToken);

      const response = await fetch(
        `https://api.twitter.com/${TWITTER_API_VERSION}/users/me/tweets?` +
          `max_results=100&` +
          `start_time=${dateFrom?.toISOString() || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}&` +
          `end_time=${dateTo?.toISOString() || new Date().toISOString()}&` +
          `tweet.fields=public_metrics,created_at`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const data = await response.json();

      if (data.errors) {
        return {
          followers: user.followers,
          postsCount: user.postsCount,
        };
      }

      const metrics: PlatformMetrics = {
        followers: user.followers,
        postsCount: user.postsCount,
      };

      const tweets = data.data || [];
      let totalImpressions = 0;
      let totalEngagements = 0;

      for (const tweet of tweets) {
        const pm = tweet.public_metrics;
        if (pm) {
          totalImpressions += (pm.impression_count || 0);
          totalEngagements += (pm.like_count || 0) + (pm.retweet_count || 0) + (pm.reply_count || 0);
        }
      }

      metrics.impressions = totalImpressions;
      metrics.engagements = totalEngagements;

      return metrics;
    } catch {
      return {};
    }
  }

  validateWebhook(payload: unknown, signature: string): boolean {
    return true;
  }
}
