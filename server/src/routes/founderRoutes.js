import express from 'express';
import { getFounderProfile, updateFounderProfile } from '../controllers/founderController.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateFounderProfileSchema } from '../validations/founderValidation.js';

const router = express.Router();

// Public route
router.get('/', getFounderProfile);

// Admin protected route
router.put('/', authenticateAdmin, validate(updateFounderProfileSchema), updateFounderProfile);

export default router;
