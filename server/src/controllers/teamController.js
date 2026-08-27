import prisma from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * Public: Get active team members
 * GET /api/team
 */
export const getPublicTeam = async (req, res, next) => {
  try {
    const team = await prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
    return sendSuccess(res, 'Team members retrieved successfully', team);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get all team members
 * GET /api/team/admin/all
 */
export const getAdminTeam = async (req, res, next) => {
  try {
    const team = await prisma.teamMember.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return sendSuccess(res, 'All team members retrieved for admin', team);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Create team member
 * POST /api/team
 */
export const createTeamMember = async (req, res, next) => {
  try {
    const data = req.body;
    const member = await prisma.teamMember.create({
      data,
    });
    return sendSuccess(res, 'Team member added successfully', member, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update team member
 * PATCH /api/team/:id
 */
export const updateTeamMember = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = req.body;

    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Team member not found', 404);
    }

    const updated = await prisma.teamMember.update({
      where: { id },
      data,
    });

    return sendSuccess(res, 'Team member updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Delete team member
 * DELETE /api/team/:id
 */
export const deleteTeamMember = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Team member not found', 404);
    }

    await prisma.teamMember.delete({ where: { id } });
    return sendSuccess(res, 'Team member deleted successfully');
  } catch (error) {
    next(error);
  }
};
