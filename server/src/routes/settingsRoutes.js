import express from 'express';
import {
  getPublicSettings,
  getPublicSocialLinks,
  updateWebsiteSettings,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
} from '../controllers/settingsController.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  updateSettingsSchema,
  createSocialLinkSchema,
  updateSocialLinkSchema,
} from '../validations/settingsValidation.js';

const router = express.Router();

// Public routes
router.get('/', getPublicSettings);
router.get('/social-links', getPublicSocialLinks);

// Admin protected routes
router.patch('/', authenticateAdmin, validate(updateSettingsSchema), updateWebsiteSettings);
router.post('/social-links', authenticateAdmin, validate(createSocialLinkSchema), createSocialLink);
router.patch('/social-links/:id', authenticateAdmin, validate(updateSocialLinkSchema), updateSocialLink);
router.delete('/social-links/:id', authenticateAdmin, deleteSocialLink);

export default router;
