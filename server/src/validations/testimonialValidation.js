import { z } from 'zod';

export const createTestimonialSchema = z.object({
  clientName: z.string().trim().min(2, 'Client name is required'),
  company: z.string().trim().optional().nullable(),
  position: z.string().trim().optional().nullable(),
  profileImage: z.string().trim().optional().nullable(),
  rating: z
    .number()
    .int('Rating must be an integer')
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5'),
  review: z.string().trim().min(5, 'Review content is required'),
  approved: z.boolean().optional().default(false),
  isVisible: z.boolean().optional().default(false),
  displayOrder: z.number().int().optional().default(0),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();
