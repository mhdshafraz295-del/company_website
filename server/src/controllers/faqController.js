import prisma from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * Public: Get active FAQs
 * GET /api/faqs
 */
export const getPublicFAQs = async (req, res, next) => {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
    return sendSuccess(res, 'FAQs retrieved successfully', faqs);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get all FAQs (active and inactive)
 * GET /api/faqs/admin/all
 */
export const getAdminFAQs = async (req, res, next) => {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return sendSuccess(res, 'All FAQs retrieved for admin', faqs);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Create FAQ
 * POST /api/faqs
 */
export const createFAQ = async (req, res, next) => {
  try {
    const data = req.body;
    const faq = await prisma.fAQ.create({
      data,
    });
    return sendSuccess(res, 'FAQ created successfully', faq, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update FAQ
 * PATCH /api/faqs/:id
 */
export const updateFAQ = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = req.body;

    const existing = await prisma.fAQ.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'FAQ not found', 404);
    }

    const updated = await prisma.fAQ.update({
      where: { id },
      data,
    });

    return sendSuccess(res, 'FAQ updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Delete FAQ
 * DELETE /api/faqs/:id
 */
export const deleteFAQ = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.fAQ.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'FAQ not found', 404);
    }

    await prisma.fAQ.delete({ where: { id } });
    return sendSuccess(res, 'FAQ deleted successfully');
  } catch (error) {
    next(error);
  }
};
