import express from 'express';
import {
  getPublicFAQs,
  getAdminFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} from '../controllers/faqController.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createFAQSchema, updateFAQSchema } from '../validations/faqValidation.js';

const router = express.Router();

// Admin protected routes (REGISTERED BEFORE DYNAMIC ID ROUTES)
router.get('/admin/all', authenticateAdmin, getAdminFAQs);
router.post('/', authenticateAdmin, validate(createFAQSchema), createFAQ);
router.patch('/:id', authenticateAdmin, validate(updateFAQSchema), updateFAQ);
router.delete('/:id', authenticateAdmin, deleteFAQ);

// Public route
router.get('/', getPublicFAQs);

export default router;
