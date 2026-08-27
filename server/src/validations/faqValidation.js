import { z } from 'zod';

export const createFAQSchema = z.object({
  question: z.string().trim().min(3, 'Question is required'),
  answer: z.string().trim().min(3, 'Answer is required'),
  displayOrder: z.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export const updateFAQSchema = createFAQSchema.partial();
