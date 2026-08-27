import prisma from '../utils/prisma.js';
import { sendSuccess } from '../utils/response.js';

/**
 * Public: Get configured Founder Profile
 * GET /api/founder
 */
export const getFounderProfile = async (req, res, next) => {
  try {
    const founder = await prisma.founderProfile.findFirst();
    return sendSuccess(res, 'Founder profile retrieved successfully', founder);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Create or update single Founder Profile
 * PUT /api/founder
 */
export const updateFounderProfile = async (req, res, next) => {
  try {
    const data = req.body;
    const existing = await prisma.founderProfile.findFirst();

    let founder;
    if (existing) {
      founder = await prisma.founderProfile.update({
        where: { id: existing.id },
        data,
      });
    } else {
      founder = await prisma.founderProfile.create({
        data,
      });
    }

    return sendSuccess(res, 'Founder profile updated successfully', founder);
  } catch (error) {
    next(error);
  }
};
