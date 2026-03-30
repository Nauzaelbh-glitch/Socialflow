import { z } from 'zod';

export const createCompanySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(255),
  slug: z.string().min(1).max(100).optional(),
  settings: z.object({}).passthrough().optional(),
});

export const updateCompanySchema = z.object({
  name: z.string().min(1).max(255).optional(),
  settings: z.object({}).passthrough().optional(),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
