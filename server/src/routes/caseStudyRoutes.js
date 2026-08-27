import express from 'express';
import {
  getPublicCaseStudies,
  getPublicCaseStudyBySlug,
  getAdminCaseStudies,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
} from '../controllers/caseStudyController.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createCaseStudySchema, updateCaseStudySchema } from '../validations/caseStudyValidation.js';

const router = express.Router();

// Admin protected routes (MUST BE REGISTERED BEFORE DYNAMIC SLUG ROUTE)
router.get('/admin/all', authenticateAdmin, getAdminCaseStudies);
router.post('/', authenticateAdmin, validate(createCaseStudySchema), createCaseStudy);
router.patch('/:id', authenticateAdmin, validate(updateCaseStudySchema), updateCaseStudy);
router.delete('/:id', authenticateAdmin, deleteCaseStudy);

// Public routes
router.get('/', getPublicCaseStudies);
router.get('/:slug', getPublicCaseStudyBySlug);

export default router;
