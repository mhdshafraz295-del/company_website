import { z } from 'zod';

export const createTeamMemberSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  position: z.string().trim().min(2, 'Position is required'), // Normal text string, not restricted to enum!
  shortBio: z.string().trim().optional().nullable(),
  fullBio: z.string().trim().optional().nullable(),
  photo: z.string().trim().optional().nullable(),
  email: z.string().trim().email('Invalid email address').optional().nullable().or(z.literal('')),
  linkedinUrl: z.string().trim().url('Invalid LinkedIn URL').optional().nullable().or(z.literal('')),
  githubUrl: z.string().trim().url('Invalid GitHub URL').optional().nullable().or(z.literal('')),
  displayOrder: z.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export const updateTeamMemberSchema = createTeamMemberSchema.partial();
