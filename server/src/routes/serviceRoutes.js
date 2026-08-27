import express from 'express';
import {
  getPublicServices,
  getPublicServiceBySlug,
  getAdminServices,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createServiceSchema, updateServiceSchema } from '../validations/serviceValidation.js';

const router = express.Router();

// Admin protected routes (MUST BE REGISTERED BEFORE DYNAMIC SLUG ROUTE)
router.get('/admin/all', authenticateAdmin, getAdminServices);
router.post('/', authenticateAdmin, validate(createServiceSchema), createService);
router.patch('/:id', authenticateAdmin, validate(updateServiceSchema), updateService);
router.delete('/:id', authenticateAdmin, deleteService);

// Public routes
router.get('/', getPublicServices);
router.get('/:slug', getPublicServiceBySlug);

export default router;
