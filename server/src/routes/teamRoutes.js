import express from 'express';
import {
  getPublicTeam,
  getAdminTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/teamController.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createTeamMemberSchema, updateTeamMemberSchema } from '../validations/teamValidation.js';

const router = express.Router();

// Admin protected routes (REGISTERED BEFORE DYNAMIC ID ROUTES)
router.get('/admin/all', authenticateAdmin, getAdminTeam);
router.post('/', authenticateAdmin, validate(createTeamMemberSchema), createTeamMember);
router.patch('/:id', authenticateAdmin, validate(updateTeamMemberSchema), updateTeamMember);
router.delete('/:id', authenticateAdmin, deleteTeamMember);

// Public route
router.get('/', getPublicTeam);

export default router;
