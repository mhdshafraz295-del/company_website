import { z } from 'zod';

const enquiryStatusEnum = z.enum([
  'NEW',
  'CONTACTED',
  'IN_DISCUSSION',
  'CONVERTED',
  'COMPLETED',
  'REJECTED',
]);

/**
 * Public Contact Enquiry Submission (Strict Whitelist with .strict())
 * Any unexpected or privileged internal fields (e.g. status, adminNotes) cause a 400 validation error.
 */
export const publicEnquirySchema = z
  .object({
    fullName: z.string().trim().min(2, 'Full name is required'),
    email: z.string().trim().email('Invalid email address format'),
    phone: z.string().trim().optional().nullable(),
    whatsappNumber: z.string().trim().optional().nullable(),
    companyName: z.string().trim().optional().nullable(),
    serviceId: z.number().int().optional().nullable(),
    projectDescription: z.string().trim().min(10, 'Project description must be at least 10 characters'),
    budgetRange: z.string().trim().optional().nullable(),
    projectTimeline: z.string().trim().optional().nullable(),
    attachmentUrl: z.string().trim().optional().nullable(),
  })
  .strict();

export const updateEnquiryStatusSchema = z
  .object({
    status: enquiryStatusEnum,
  })
  .strict();

export const updateEnquiryNotesSchema = z
  .object({
    adminNotes: z.string().trim().nullable(),
  })
  .strict();
