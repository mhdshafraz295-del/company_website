import { z } from 'zod';

export const updateSettingsSchema = z.object({
  companyName: z.string().trim().optional(),
  tagline: z.string().trim().optional().nullable(),
  companyDescription: z.string().trim().optional().nullable(),
  email: z.string().trim().email().optional().nullable().or(z.literal('')),
  phone: z.string().trim().optional().nullable(),
  whatsapp: z.string().trim().optional().nullable(),
  address: z.string().trim().optional().nullable(),
  heroEyebrow: z.string().trim().optional().nullable(),
  heroHeading: z.string().trim().optional().nullable(),
  heroDescription: z.string().trim().optional().nullable(),
  primaryCtaText: z.string().trim().optional().nullable(),
  secondaryCtaText: z.string().trim().optional().nullable(),
  projectsCompleted: z.number().int().optional().nullable(),
  technologiesCount: z.number().int().optional().nullable(),
  clientSatisfactionText: z.string().trim().optional().nullable(),
  supportAvailabilityText: z.string().trim().optional().nullable(),
});

export const createSocialLinkSchema = z.object({
  platform: z.string().trim().min(2, 'Platform name is required'),
  url: z.string().trim().url('Invalid social link URL'),
  icon: z.string().trim().optional().nullable(),
  displayOrder: z.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export const updateSocialLinkSchema = createSocialLinkSchema.partial();
