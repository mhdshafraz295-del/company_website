import { z } from 'zod';

export const createCaseStudySchema = z.object({
  title: z.string().trim().min(2, 'Case study title is required'),
  slug: z.string().trim().optional(),
  projectId: z.number().int().optional().nullable(),
  problem: z.string().trim().min(10, 'Problem description is required'),
  solution: z.string().trim().min(10, 'Solution description is required'),
  technologiesSummary: z.string().trim().optional().nullable(),
  result: z.string().trim().optional().nullable(),
  coverImage: z.string().trim().optional().nullable(),
  published: z.boolean().optional().default(true),
});

export const updateCaseStudySchema = createCaseStudySchema.partial();
