import { z } from 'zod';

export const createCollaboratorSchema = z.object({
  name: z.string().trim().min(2, 'Collaborator or partner name is required'),
  logo: z.string().trim().optional().nullable().or(z.literal('')),
  partnerType: z.string().trim().optional().nullable().or(z.literal('')),
  shortDescription: z.string().trim().optional().nullable().or(z.literal('')),
  phone: z.string().trim().optional().nullable().or(z.literal('')),
  whatsapp: z.string().trim().optional().nullable().or(z.literal('')),
  email: z.string().trim().email('Invalid email address').optional().nullable().or(z.literal('')),
  website: z.string().trim().url('Invalid website URL format').optional().nullable().or(z.literal('')),
  displayOrder: z.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
});

export const updateCollaboratorSchema = createCollaboratorSchema.partial();

