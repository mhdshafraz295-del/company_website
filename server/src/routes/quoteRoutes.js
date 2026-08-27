import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  createPublicQuote,
  getAdminQuotes,
  getAdminQuoteById,
  updateQuoteStatus,
  updateQuoteNotes,
  deleteQuote,
} from '../controllers/quoteController.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { paginationQuerySchema } from '../validations/commonValidation.js';
import {
  publicQuoteSchema,
  updateQuoteStatusSchema,
  updateQuoteNotesSchema,
} from '../validations/quoteValidation.js';

const router = express.Router();

// Strict rate limit for public quote submissions to reduce spam
const quoteSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 submissions per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many quote submissions from this IP, please try again later.',
  },
});

// Public submission route
router.post('/', quoteSubmissionLimiter, validate(publicQuoteSchema), createPublicQuote);

// Admin protected routes
router.get('/', authenticateAdmin, validate(paginationQuerySchema, 'query'), getAdminQuotes);
router.get('/:id', authenticateAdmin, getAdminQuoteById);
router.patch('/:id/status', authenticateAdmin, validate(updateQuoteStatusSchema), updateQuoteStatus);
router.patch('/:id/notes', authenticateAdmin, validate(updateQuoteNotesSchema), updateQuoteNotes);
router.delete('/:id', authenticateAdmin, deleteQuote);

export default router;
