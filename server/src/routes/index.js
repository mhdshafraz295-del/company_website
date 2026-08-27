import express from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import projectRoutes from './projectRoutes.js';
import teamRoutes from './teamRoutes.js';
import founderRoutes from './founderRoutes.js';
import testimonialRoutes from './testimonialRoutes.js';
import enquiryRoutes from './enquiryRoutes.js';
import quoteRoutes from './quoteRoutes.js';
import faqRoutes from './faqRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import caseStudyRoutes from './caseStudyRoutes.js';
import mediaRoutes from './mediaRoutes.js';

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/services', serviceRoutes);
router.use('/projects', projectRoutes);
router.use('/team', teamRoutes);
router.use('/founder', founderRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/quotes', quoteRoutes);
router.use('/faqs', faqRoutes);
router.use('/settings', settingsRoutes);
router.use('/case-studies', caseStudyRoutes);
router.use('/media', mediaRoutes);

export default router;
