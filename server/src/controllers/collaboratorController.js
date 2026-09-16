import prisma from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * Public include configuration for Collaborator queries
 */
const publicCollaboratorInclude = {
  projects: {
    where: { published: true },
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      title: true,
      slug: true,
      coverImage: true,
      category: true,
      shortDescription: true,
      completionYear: true,
      liveUrl: true,
      githubUrl: true,
      displayOrder: true,
      technologies: {
        include: {
          technology: true,
        },
      },
    },
  },
  testimonials: {
    where: {
      approved: true,
      isVisible: true,
    },
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      clientName: true,
      company: true,
      position: true,
      profileImage: true,
      rating: true,
      review: true,
      projectId: true,
    },
  },
};

/**
 * Transform collaborator for public response (flattening project technologies)
 */
const formatPublicCollaborator = (collaborator) => {
  if (!collaborator) return null;
  return {
    ...collaborator,
    projects: (collaborator.projects || []).map((project) => {
      const { technologies, ...rest } = project;
      return {
        ...rest,
        technologies: technologies ? technologies.map((pt) => pt.technology) : [],
      };
    }),
  };
};

/**
 * Public: Get all active collaborators
 * GET /api/collaborators
 */
export const getPublicCollaborators = async (req, res, next) => {
  try {
    const collaborators = await prisma.collaborator.findMany({
      where: { isActive: true },
      include: publicCollaboratorInclude,
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });

    const formatted = collaborators.map(formatPublicCollaborator);
    return sendSuccess(res, 'Active collaborators retrieved successfully', formatted);
  } catch (error) {
    next(error);
  }
};

/**
 * Public: Get featured collaborators
 * GET /api/collaborators/featured
 */
export const getPublicFeaturedCollaborators = async (req, res, next) => {
  try {
    const collaborators = await prisma.collaborator.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      include: publicCollaboratorInclude,
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });

    const formatted = collaborators.map(formatPublicCollaborator);
    return sendSuccess(res, 'Featured collaborators retrieved successfully', formatted);
  } catch (error) {
    next(error);
  }
};

/**
 * Public: Get collaborator by ID
 * GET /api/collaborators/:id
 */
export const getPublicCollaboratorById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return sendError(res, 'Invalid collaborator ID', 400);
    }

    const collaborator = await prisma.collaborator.findFirst({
      where: { id, isActive: true },
      include: publicCollaboratorInclude,
    });

    if (!collaborator) {
      return sendError(res, 'Collaborator not found', 404);
    }

    return sendSuccess(
      res,
      'Collaborator details retrieved successfully',
      formatPublicCollaborator(collaborator)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get all collaborators with project & review counts
 * GET /api/collaborators/admin/all
 */
export const getAdminCollaborators = async (req, res, next) => {
  try {
    const collaborators = await prisma.collaborator.findMany({
      include: {
        _count: {
          select: {
            projects: true,
            testimonials: true,
          },
        },
        projects: {
          select: {
            id: true,
            title: true,
            slug: true,
            published: true,
          },
        },
      },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return sendSuccess(res, 'All collaborators retrieved for admin', collaborators);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Create collaborator
 * POST /api/collaborators
 */
export const createCollaborator = async (req, res, next) => {
  try {
    const data = req.body;
    const collaborator = await prisma.collaborator.create({
      data: {
        name: data.name.trim(),
        logo: data.logo || null,
        partnerType: data.partnerType || null,
        shortDescription: data.shortDescription || null,
        phone: data.phone || null,
        whatsapp: data.whatsapp || null,
        email: data.email || null,
        website: data.website || null,
        displayOrder: data.displayOrder !== undefined ? Number(data.displayOrder) : 0,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
        isFeatured: data.isFeatured !== undefined ? Boolean(data.isFeatured) : false,
      },
    });

    return sendSuccess(res, 'Collaborator created successfully', collaborator, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update collaborator
 * PATCH /api/collaborators/:id
 */
export const updateCollaborator = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return sendError(res, 'Invalid collaborator ID', 400);
    }

    const existing = await prisma.collaborator.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Collaborator not found', 404);
    }

    const data = req.body;
    const updateData = {};

    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.logo !== undefined) updateData.logo = data.logo || null;
    if (data.partnerType !== undefined) updateData.partnerType = data.partnerType || null;
    if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription || null;
    if (data.phone !== undefined) updateData.phone = data.phone || null;
    if (data.whatsapp !== undefined) updateData.whatsapp = data.whatsapp || null;
    if (data.email !== undefined) updateData.email = data.email || null;
    if (data.website !== undefined) updateData.website = data.website || null;
    if (data.displayOrder !== undefined) updateData.displayOrder = Number(data.displayOrder);
    if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);
    if (data.isFeatured !== undefined) updateData.isFeatured = Boolean(data.isFeatured);

    const updated = await prisma.collaborator.update({
      where: { id },
      data: updateData,
    });

    return sendSuccess(res, 'Collaborator updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Toggle active status
 * PATCH /api/collaborators/:id/toggle-active
 */
export const toggleActiveCollaborator = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return sendError(res, 'Invalid collaborator ID', 400);
    }

    const existing = await prisma.collaborator.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Collaborator not found', 404);
    }

    const updated = await prisma.collaborator.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });

    return sendSuccess(res, 'Collaborator active status toggled', updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Toggle featured status
 * PATCH /api/collaborators/:id/toggle-featured
 */
export const toggleFeaturedCollaborator = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return sendError(res, 'Invalid collaborator ID', 400);
    }

    const existing = await prisma.collaborator.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Collaborator not found', 404);
    }

    const updated = await prisma.collaborator.update({
      where: { id },
      data: { isFeatured: !existing.isFeatured },
    });

    return sendSuccess(res, 'Collaborator featured status toggled', updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Safely delete collaborator
 * DELETE /api/collaborators/:id
 * Note: Database foreign keys have onDelete: SetNull, ensuring all existing projects
 * and testimonials are preserved with collaboratorId safely detached.
 */
export const deleteCollaborator = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return sendError(res, 'Invalid collaborator ID', 400);
    }

    const existing = await prisma.collaborator.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Collaborator not found', 404);
    }

    await prisma.collaborator.delete({ where: { id } });
    return sendSuccess(res, 'Collaborator deleted safely. Linked projects remain preserved.');
  } catch (error) {
    next(error);
  }
};

