import express from 'express';
import {
  getPublicTestimonials,
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  approveTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createTestimonialSchema, updateTestimonialSchema } from '../validations/testimonialValidation.js';

const router = express.Router();

// Admin protected routes (REGISTERED BEFORE DYNAMIC ID ROUTES)
router.get('/admin/all', authenticateAdmin, getAdminTestimonials);
router.post('/', authenticateAdmin, validate(createTestimonialSchema), createTestimonial);
router.patch('/:id/approve', authenticateAdmin, approveTestimonial);
router.patch('/:id', authenticateAdmin, validate(updateTestimonialSchema), updateTestimonial);
router.delete('/:id', authenticateAdmin, deleteTestimonial);

// Public route
router.get('/', getPublicTestimonials);

export default router;
