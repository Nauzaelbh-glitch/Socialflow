import { Platform } from '@prisma/client';
import type { PlatformAdapter, PostContent, PlatformMetrics, AccountInfo, PublishResult } from '../types';

const TIKTOK_API_VERSION = 'v1';

export class TikTokAdapter implements PlatformAdapter {
  platform: Platform = 'TIKTOK';

  private getConfig() {
    return {
      clientKey: process.env.TIKTOK_CLIENT_KEY!,
      clientSecret: process.env.TIKTOK_CLIENT_SECRET!,
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/social/callback/tiktok`,
    };
  }

  getOAuthUrl(state: string): string {
    const config = this.getConfig();
    const scopes = ['user.info.basic', 'video.upload', 'video.publish'].join(',');

    return `https://www.tiktok.com/v2/auth/authorize?` +
      `client_key=${config.clientKey}` +
      `&scope=${scopes}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(config.redirectUri)}` +
      `&state=${state}`;
  }

  async exchangeCodeForToken(code: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresAt?: Date;
  }> {
    const config = this.getConfig();

    const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: config.clientKey,
        client_secret: config.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: config.redirectUri,
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

    const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: config.clientKey,
        client_secret: config.clientSecret,
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
      'https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url,followers_count,following_count,likes_count',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error_description || 'API error');
    }

    const user = data.data?.user;

    return {
      id: user?.open_id || '',
      name: user?.display_name || '',
      profileImageUrl: user?.avatar_url,
      followers: user?.followers_count,
      following: user?.following_count,
      postsCount: user?.likes_count,
    };
  }

  async publishPost(accessToken: string, content: PostContent): Promise<PublishResult> {
    try {
      if (!content.mediaUrls?.length) {
        return {
          success: false,
          error: 'TikTok requiere un video para publicar',
        };
      }

      const videoUrl = content.mediaUrls[0];

      const initResponse = await fetch(
        'https://open.tiktokapis.com/v2/video/upload/init/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            source: {
              source: 'PULL_FROM_URL',
              video_url: videoUrl,
            },
            title: content.text.substring(0, 100),
            privacy_level: 'SELF_ONLY',
            disable_comment: false,
            disable_duet: false,
            disable_stitch: false,
          }),
        }
      );

      const initData = await initResponse.json();

      if (initData.error) {
        return {
          success: false,
          error: initData.error_description || 'Error al iniciar upload',
        };
      }

      const uploadId = initData.data?.upload_id;

      if (!uploadId) {
        return {
          success: false,
          error: 'No se получил upload ID',
        };
      }

      return {
        success: true,
        platformPostId: uploadId,
        postUrl: `https://www.tiktok.com/@user/video/${uploadId}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  async deletePost(accessToken: string, postId: string): Promise<boolean> {
    return false;
  }

  async getMetrics(accessToken: string, dateFrom?: Date, dateTo?: Date): Promise<PlatformMetrics> {
    try {
      const user = await this.getAccountInfo(accessToken);

      const response = await fetch(
        'https://open.tiktokapis.com/v2/video/list/?fields=video_id,view_count,like_count,comment_count,share_count',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            max_count: 100,
            start_date: dateFrom?.toISOString().split('T')[0] || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            end_date: dateTo?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
          }),
        }
      );

      const data = await response.json();

      const metrics: PlatformMetrics = {
        followers: user.followers,
      };

      if (data.data?.videos) {
        for (const video of data.data.videos) {
          metrics.impressions = (metrics.impressions || 0) + (video.view_count || 0);
          metrics.engagements = (metrics.engagements || 0) + (video.like_count || 0) + (video.comment_count || 0) + (video.share_count || 0);
        }
      }

      return metrics;
    } catch {
      return {};
    }
  }

  validateWebhook(payload: unknown, signature: string): boolean {
    return true;
  }
}
