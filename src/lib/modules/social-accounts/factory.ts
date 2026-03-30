import { Platform } from '@prisma/client';
import type { PlatformAdapter } from './types';
import { FacebookAdapter } from './adapters/facebook';
import { InstagramAdapter } from './adapters/instagram';
import { LinkedInAdapter } from './adapters/linkedin';
import { TwitterAdapter } from './adapters/twitter';
import { TikTokAdapter } from './adapters/tiktok';

const adapters: Record<Platform, new () => PlatformAdapter> = {
  FACEBOOK: FacebookAdapter,
  INSTAGRAM: InstagramAdapter,
  LINKEDIN: LinkedInAdapter,
  TWITTER: TwitterAdapter,
  TIKTOK: TikTokAdapter,
};

export function getAdapter(platform: Platform): PlatformAdapter {
  const AdapterClass = adapters[platform];
  if (!AdapterClass) {
    throw new Error(`No adapter found for platform: ${platform}`);
  }
  return new AdapterClass();
}

export function getAllAdapters(): Array<{ platform: Platform; name: string; icon: string; color: string }> {
  return [
    { platform: 'FACEBOOK', name: 'Facebook', icon: 'Facebook', color: '#1877F2' },
    { platform: 'INSTAGRAM', name: 'Instagram', icon: 'Instagram', color: '#E4405F' },
    { platform: 'LINKEDIN', name: 'LinkedIn', icon: 'LinkedIn', color: '#0A66C2' },
    { platform: 'TWITTER', name: 'Twitter/X', icon: 'Twitter', color: '#000000' },
    { platform: 'TIKTOK', name: 'TikTok', icon: 'TikTok', color: '#000000' },
  ];
}

export { FacebookAdapter } from './adapters/facebook';
export { InstagramAdapter } from './adapters/instagram';
export { LinkedInAdapter } from './adapters/linkedin';
export { TwitterAdapter } from './adapters/twitter';
export { TikTokAdapter } from './adapters/tiktok';
