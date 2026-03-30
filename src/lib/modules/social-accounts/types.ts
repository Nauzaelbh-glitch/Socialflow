import { Platform } from '@prisma/client';

export interface PostContent {
  text: string;
  mediaUrls?: string[];
}

export interface PlatformMetrics {
  reach?: number;
  impressions?: number;
  engagements?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  clicks?: number;
  saves?: number;
  videoViews?: number;
  followers?: number;
  following?: number;
  postsCount?: number;
}

export interface PublishResult {
  success: boolean;
  platformPostId?: string;
  postUrl?: string;
  error?: string;
  errorCode?: string;
}

export interface AccountInfo {
  id: string;
  name: string;
  username?: string;
  profileImageUrl?: string;
  followers?: number;
  following?: number;
  postsCount?: number;
  isBusiness?: boolean;
  isVerified?: boolean;
}

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export interface PlatformAdapter {
  platform: Platform;
  
  getOAuthUrl(state: string): string;
  
  exchangeCodeForToken(code: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresAt?: Date;
  }>;
  
  refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresAt?: Date;
  }>;
  
  getAccountInfo(accessToken: string): Promise<AccountInfo>;
  
  publishPost(accessToken: string, content: PostContent): Promise<PublishResult>;
  
  deletePost(accessToken: string, postId: string): Promise<boolean>;
  
  getMetrics(accessToken: string, dateFrom?: Date, dateTo?: Date): Promise<PlatformMetrics>;
  
  validateWebhook(payload: unknown, signature: string): boolean;
}

export interface SocialAdapterConfig {
  facebook?: OAuthConfig;
  instagram?: OAuthConfig;
  linkedin?: OAuthConfig;
  twitter?: OAuthConfig;
  tiktok?: OAuthConfig;
}
