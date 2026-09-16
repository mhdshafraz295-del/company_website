import express from 'express';
import {
  getPublicCollaborators,
  getPublicFeaturedCollaborators,
  getPublicCollaboratorById,
  getAdminCollaborators,
  createCollaborator,
  updateCollaborator,
  toggleActiveCollaborator,
  toggleFeaturedCollaborator,
  deleteCollaborator,
} from '../controllers/collaboratorController.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createCollaboratorSchema,
  updateCollaboratorSchema,
} from '../validations/collaboratorValidation.js';

const router = express.Router();

// Admin protected routes (MUST BE REGISTERED BEFORE DYNAMIC ID ROUTE)
router.get('/admin/all', authenticateAdmin, getAdminCollaborators);
router.post('/', authenticateAdmin, validate(createCollaboratorSchema), createCollaborator);
router.patch('/:id/toggle-active', authenticateAdmin, toggleActiveCollaborator);
router.patch('/:id/toggle-featured', authenticateAdmin, toggleFeaturedCollaborator);
router.patch('/:id', authenticateAdmin, validate(updateCollaboratorSchema), updateCollaborator);
router.delete('/:id', authenticateAdmin, deleteCollaborator);

// Public routes
router.get('/featured', getPublicFeaturedCollaborators);
router.get('/:id', getPublicCollaboratorById);
router.get('/', getPublicCollaborators);

export default router;

