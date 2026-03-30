import { z } from 'zod';

export const platformContentSchema = z.object({
  text: z.string().optional(),
  mediaIds: z.array(z.string()).optional(),
});

export const createPostSchema = z.object({
  companyId: z.string().uuid('ID de empresa inválido'),
  title: z.string().max(500).optional(),
  content: z.record(z.string(), platformContentSchema),
  platforms: z.array(z.string().uuid()).min(1, 'Selecciona al menos una cuenta'),
  scheduledAt: z.string().datetime().optional(),
  visibility: z.enum(['public', 'private']).default('public'),
  mediaIds: z.array(z.string().uuid()).optional(),
  templateId: z.string().uuid().optional(),
});

export const updatePostSchema = z.object({
  title: z.string().max(500).optional(),
  content: z.record(z.string(), platformContentSchema).optional(),
  scheduledAt: z.string().datetime().optional().nullable(),
  visibility: z.enum(['public', 'private']).optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type PlatformContent = z.infer<typeof platformContentSchema>;
