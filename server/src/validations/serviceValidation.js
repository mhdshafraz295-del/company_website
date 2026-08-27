import { z } from 'zod';

export const createServiceSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters'),
  slug: z.string().trim().optional(),
  shortDescription: z.string().trim().min(5, 'Short description is required'),
  description: z.string().trim().min(10, 'Full description is required'),
  icon: z.string().trim().optional().nullable(),
  image: z.string().trim().optional().nullable(),
  displayOrder: z.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export const updateServiceSchema = createServiceSchema.partial();
