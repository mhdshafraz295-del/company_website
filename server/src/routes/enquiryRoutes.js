import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  createPublicEnquiry,
  getAdminEnquiries,
  getAdminEnquiryById,
  updateEnquiryStatus,
  updateEnquiryNotes,
  deleteEnquiry,
} from '../controllers/enquiryController.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { paginationQuerySchema } from '../validations/commonValidation.js';
import {
  publicEnquirySchema,
  updateEnquiryStatusSchema,
  updateEnquiryNotesSchema,
} from '../validations/enquiryValidation.js';

const router = express.Router();

// Strict rate limit for public form submissions to reduce spam
const enquirySubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 submissions per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many enquiry submissions from this IP, please try again later.',
  },
});

// Public submission route
router.post('/', enquirySubmissionLimiter, validate(publicEnquirySchema), createPublicEnquiry);

// Admin protected routes
router.get('/', authenticateAdmin, validate(paginationQuerySchema, 'query'), getAdminEnquiries);
router.get('/:id', authenticateAdmin, getAdminEnquiryById);
router.patch('/:id/status', authenticateAdmin, validate(updateEnquiryStatusSchema), updateEnquiryStatus);
router.patch('/:id/notes', authenticateAdmin, validate(updateEnquiryNotesSchema), updateEnquiryNotes);
router.delete('/:id', authenticateAdmin, deleteEnquiry);

export default router;
