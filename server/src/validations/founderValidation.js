import { z } from 'zod';

export const updateFounderProfileSchema = z.object({
  name: z.string().trim().min(2, 'Founder name is required'),
  primaryRole: z.string().trim().min(2, 'Primary role is required'),
  expertise: z.string().trim().optional().nullable(),
  shortBio: z.string().trim().optional().nullable(),
  fullBiography: z.string().trim().optional().nullable(),
  visionStatement: z.string().trim().optional().nullable(),
  photo: z.string().trim().optional().nullable(),
  email: z.string().trim().email('Invalid email format').optional().nullable().or(z.literal('')),
  linkedinUrl: z.string().trim().url('Invalid LinkedIn URL').optional().nullable().or(z.literal('')),
  githubUrl: z.string().trim().url('Invalid GitHub URL').optional().nullable().or(z.literal('')),
});
