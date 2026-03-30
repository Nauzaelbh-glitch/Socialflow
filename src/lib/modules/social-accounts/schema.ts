import { z } from 'zod';

export const connectAccountSchema = z.object({
  platform: z.enum(['FACEBOOK', 'INSTAGRAM', 'LINKEDIN', 'TWITTER', 'TIKTOK']),
  authorizationCode: z.string().optional(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
  pageId: z.string().optional(),
});

export const disconnectAccountSchema = z.object({
  accountId: z.string().uuid('ID de cuenta inválido'),
});

export const refreshTokenSchema = z.object({
  accountId: z.string().uuid('ID de cuenta inválido'),
});

export const publishPostSchema = z.object({
  accountId: z.string().uuid('ID de cuenta inválido'),
  content: z.string().min(1, 'El contenido es requerido').max(5000),
  mediaUrls: z.array(z.string().url()).optional(),
});

export const getMetricsSchema = z.object({
  accountId: z.string().uuid('ID de cuenta inválido'),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

export type ConnectAccountInput = z.infer<typeof connectAccountSchema>;
export type DisconnectAccountInput = z.infer<typeof disconnectAccountSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type PublishPostInput = z.infer<typeof publishPostSchema>;
export type GetMetricsInput = z.infer<typeof getMetricsSchema>;
