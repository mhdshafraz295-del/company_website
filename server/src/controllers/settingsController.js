import prisma from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * Public: Get public website settings with active social links
 * GET /api/settings
 */
export const getPublicSettings = async (req, res, next) => {
  try {
    const setting = await prisma.websiteSetting.findFirst();
    const socialLinks = await prisma.socialLink.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    return sendSuccess(res, 'Website settings retrieved successfully', {
      setting: setting || {},
      socialLinks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Public: Get active social links
 * GET /api/settings/social-links
 */
export const getPublicSocialLinks = async (req, res, next) => {
  try {
    const socialLinks = await prisma.socialLink.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
    return sendSuccess(res, 'Social links retrieved successfully', socialLinks);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update website settings
 * PATCH /api/settings
 */
export const updateWebsiteSettings = async (req, res, next) => {
  try {
    const data = req.body;
    const existing = await prisma.websiteSetting.findFirst();

    let setting;
    if (existing) {
      setting = await prisma.websiteSetting.update({
        where: { id: existing.id },
        data,
      });
    } else {
      setting = await prisma.websiteSetting.create({
        data,
      });
    }

    return sendSuccess(res, 'Website settings updated successfully', setting);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Create social link
 * POST /api/settings/social-links
 */
export const createSocialLink = async (req, res, next) => {
  try {
    const data = req.body;
    const link = await prisma.socialLink.create({
      data,
    });
    return sendSuccess(res, 'Social link created successfully', link, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update social link
 * PATCH /api/settings/social-links/:id
 */
export const updateSocialLink = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = req.body;

    const existing = await prisma.socialLink.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Social link not found', 404);
    }

    const updated = await prisma.socialLink.update({
      where: { id },
      data,
    });

    return sendSuccess(res, 'Social link updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Delete social link
 * DELETE /api/settings/social-links/:id
 */
export const deleteSocialLink = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.socialLink.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Social link not found', 404);
    }

    await prisma.socialLink.delete({ where: { id } });
    return sendSuccess(res, 'Social link deleted successfully');
  } catch (error) {
    next(error);
  }
};
