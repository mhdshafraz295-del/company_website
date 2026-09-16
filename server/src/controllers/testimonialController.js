import prisma from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';

const testimonialInclude = {
  collaborator: {
    select: {
      id: true,
      name: true,
      logo: true,
    },
  },
  project: {
    select: {
      id: true,
      title: true,
      slug: true,
    },
  },
};

/**
 * Public: Get approved & visible testimonials
 * GET /api/testimonials
 */
export const getPublicTestimonials = async (req, res, next) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        approved: true,
        isVisible: true,
      },
      include: testimonialInclude,
      orderBy: { displayOrder: 'asc' },
    });
    return sendSuccess(res, 'Testimonials retrieved successfully', testimonials);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get all testimonials
 * GET /api/testimonials/admin/all
 */
export const getAdminTestimonials = async (req, res, next) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      include: testimonialInclude,
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return sendSuccess(res, 'All testimonials retrieved for admin', testimonials);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Create testimonial
 * POST /api/testimonials
 */
export const createTestimonial = async (req, res, next) => {
  try {
    const data = req.body;
    const createData = {
      ...data,
      collaboratorId: data.collaboratorId ? Number(data.collaboratorId) : null,
      projectId: data.projectId ? Number(data.projectId) : null,
    };
    const testimonial = await prisma.testimonial.create({
      data: createData,
      include: testimonialInclude,
    });
    return sendSuccess(res, 'Testimonial created successfully', testimonial, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update testimonial
 * PATCH /api/testimonials/:id
 */
export const updateTestimonial = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = req.body;

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Testimonial not found', 404);
    }

    const updateData = { ...data };
    if (data.collaboratorId !== undefined) {
      updateData.collaboratorId = data.collaboratorId ? Number(data.collaboratorId) : null;
    }
    if (data.projectId !== undefined) {
      updateData.projectId = data.projectId ? Number(data.projectId) : null;
    }

    const updated = await prisma.testimonial.update({
      where: { id },
      data: updateData,
      include: testimonialInclude,
    });

    return sendSuccess(res, 'Testimonial updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Toggle/update approval & visibility status
 * PATCH /api/testimonials/:id/approve
 */
export const approveTestimonial = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { approved, isVisible } = req.body;

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Testimonial not found', 404);
    }

    const updateData = {};
    if (approved !== undefined) updateData.approved = approved;
    if (isVisible !== undefined) updateData.isVisible = isVisible;

    const updated = await prisma.testimonial.update({
      where: { id },
      data: updateData,
    });

    return sendSuccess(res, 'Testimonial approval status updated', updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Delete testimonial
 * DELETE /api/testimonials/:id
 */
export const deleteTestimonial = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Testimonial not found', 404);
    }

    await prisma.testimonial.delete({ where: { id } });
    return sendSuccess(res, 'Testimonial deleted successfully');
  } catch (error) {
    next(error);
  }
};
