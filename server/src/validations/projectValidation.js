import { z } from 'zod';

const projectCategoryEnum = z.enum([
  'WEBSITE',
  'MOBILE_APP',
  'SOFTWARE',
  'ECOMMERCE',
  'EDUCATION',
  'BUSINESS_SYSTEM',
  'OTHER',
]);

const projectStatusEnum = z.enum([
  'PLANNED',
  'IN_PROGRESS',
  'COMPLETED',
  'MAINTENANCE',
]);

export const createProjectSchema = z.object({
  title: z.string().trim().min(2, 'Project title is required'),
  slug: z.string().trim().optional(),
  shortDescription: z.string().trim().min(5, 'Short description is required'),
  fullDescription: z.string().trim().min(10, 'Full description is required'),
  category: projectCategoryEnum,
  clientOrIndustry: z.string().trim().optional().nullable(),
  coverImage: z.string().trim().optional().nullable(),
  completionYear: z.number().int().optional().nullable(),
  status: projectStatusEnum.optional().default('COMPLETED'),
  liveUrl: z.string().trim().url('Invalid live URL format').optional().nullable().or(z.literal('')),
  githubUrl: z.string().trim().url('Invalid GitHub URL format').optional().nullable().or(z.literal('')),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(true),
  displayOrder: z.number().int().optional().default(0),
  technologies: z.array(z.string().trim()).optional().default([]),
});

export const updateProjectSchema = createProjectSchema.partial();
