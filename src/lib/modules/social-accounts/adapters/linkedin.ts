import { Platform } from '@prisma/client';
import type { PlatformAdapter, PostContent, PlatformMetrics, AccountInfo, PublishResult } from '../types';

const LINKEDIN_API_VERSION = 'v2';

export class LinkedInAdapter implements PlatformAdapter {
  platform: Platform = 'LINKEDIN';

  private getConfig() {
    return {
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/social/callback/linkedin`,
    };
  }

  getOAuthUrl(state: string): string {
    const config = this.getConfig();
    const scopes = [
      'r_liteprofile',
      'r_emailaddress',
      'w_member_social',
      'r_organization_social',
    ].join('%20');

    return `https://www.linkedin.com/oauth/v2/authorization?` +
      `response_type=code` +
      `&client_id=${config.clientId}` +
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

    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.redirectUri,
        client_id: config.clientId,
        client_secret: config.clientSecret,
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

    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: config.clientId,
        client_secret: config.clientSecret,
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
      `https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams))&access_token=${accessToken}`
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.message || 'API error');
    }

    const profilePicture = data.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier;

    return {
      id: data.id,
      name: `${data.localizedFirstName} ${data.localizedLastName}`,
      profileImageUrl: profilePicture,
    };
  }

  async getOrganizations(accessToken: string): Promise<Array<{ id: string; name: string; logo?: string }>> {
    const response = await fetch(
      `https://api.linkedin.com/v2/me?projection=(id)~&fields=organizationalTarget:(id,localizedName,logoV2)&access_token=${accessToken}`
    );

    const data = await response.json();
    const organizations = data.organizationalTarget || [];

    return Array.isArray(organizations)
      ? organizations.map((org: { id: string; localizedName: string; logoV2?: { displayImage: string } }) => ({
          id: org.id,
          name: org.localizedName,
          logo: org.logoV2?.displayImage,
        }))
      : [];
  }

  async publishPost(accessToken: string, content: PostContent): Promise<PublishResult> {
    try {
      const author = `urn:li:person:${(await this.getAccountInfo(accessToken)).id}`;

      const postData = {
        author,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content.text,
            },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      };

      if (content.mediaUrls?.length) {
        const imageUrl = content.mediaUrls[0];
        const uploadResponse = await fetch(
          `https://api.linkedin.com/v2/assets?action=registerUpload&owner=${author}&access_token=${accessToken}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              registerUploadRequest: {
                recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
                owner: author,
                serviceRelationships: [
                  {
                    relationshipType: 'OWNER',
                    identifier: 'urn:li:userGeneratedContent',
                  },
                ],
              },
            }),
          }
        );

        const uploadData = await uploadResponse.json();

        if (uploadData.error) {
          return { success: false, error: uploadData.error.message };
        }

        const assetUrl = uploadData.value.asset;
        const uploadUrl = uploadData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;

        await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'image/jpeg' },
          body: Buffer.from(await (await fetch(imageUrl)).arrayBuffer()),
        });

        postData.specificContent['com.linkedin.ugc.ShareContent'] = {
          shareCommentary: {
            text: content.text,
          },
          shareMediaCategory: 'IMAGE',
          media: [
            {
              status: 'READY',
              originalUrl: imageUrl,
            },
          ],
        } as any;
      }

      const response = await fetch(
        `https://api.linkedin.com/v2/ugcPosts?action=post&access_token=${accessToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
          },
          body: JSON.stringify(postData),
        }
      );

      const data = await response.json();

      if (data.error) {
        return {
          success: false,
          error: data.message || data.error_description,
        };
      }

      return {
        success: true,
        platformPostId: data.id,
        postUrl: `https://www.linkedin.com/feed/update/${data.id}`,
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
        `https://api.linkedin.com/v2/ugcPosts/${postId}?access_token=${accessToken}`,
        { method: 'DELETE', headers: { 'X-Restli-Protocol-Version': '2.0.0' } }
      );

      return response.ok;
    } catch {
      return false;
    }
  }

  async getMetrics(accessToken: string, dateFrom?: Date, DateTo?: Date): Promise<PlatformMetrics> {
    try {
      const personId = (await this.getAccountInfo(accessToken)).id;
      const author = `urn:li:person:${personId}`;

      const response = await fetch(
        `https://api.linkedin.com/v2/organizationalEntityShareStatistics?` +
          `q=organizationalEntity&` +
          `organizationalEntity=${author}&` +
          `timeIntervals.timeGranularityType=DAY&` +
          `timeIntervals.timeRange.start=${Math.floor((dateFrom?.getTime() || Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000)}&` +
          `timeIntervals.timeRange.end=${Math.floor((DateTo?.getTime() || Date.now()) / 1000)}&` +
          `access_token=${accessToken}`
      );

      const data = await response.json();

      if (data.error) {
        return {};
      }

      const metrics: PlatformMetrics = {};
      const elements = data.elements || [];

      if (elements.length > 0) {
        const totalImpressions = elements.reduce((sum: number, el: { totalPageStatistics: { impressions: { value: number } } }) =>
          sum + (el.totalPageStatistics?.impressions?.value || 0), 0);
        metrics.impressions = totalImpressions;

        const totalClicks = elements.reduce((sum: number, el: { totalPageStatistics: { clicks: { value: number } } }) =>
          sum + (el.totalPageStatistics?.clicks?.value || 0), 0);
        metrics.clicks = totalClicks;

        const totalEngagements = elements.reduce((sum: number, el: { totalPageStatistics: { engagements: { value: number } } }) =>
          sum + (el.totalPageStatistics?.engagements?.value || 0), 0);
        metrics.engagements = totalEngagements;
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
