import express from 'express';
import {
  getPublicProjects,
  getPublicProjectBySlug,
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { paginationQuerySchema } from '../validations/commonValidation.js';
import { createProjectSchema, updateProjectSchema } from '../validations/projectValidation.js';

const router = express.Router();

// Admin protected routes (MUST BE REGISTERED BEFORE DYNAMIC SLUG ROUTE)
router.get('/admin/all', authenticateAdmin, validate(paginationQuerySchema, 'query'), getAdminProjects);
router.post('/', authenticateAdmin, validate(createProjectSchema), createProject);
router.patch('/:id', authenticateAdmin, validate(updateProjectSchema), updateProject);
router.delete('/:id', authenticateAdmin, deleteProject);

// Public routes
router.get('/', validate(paginationQuerySchema, 'query'), getPublicProjects);
router.get('/:slug', getPublicProjectBySlug);

export default router;
