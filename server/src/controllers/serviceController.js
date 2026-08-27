import prisma from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { slugify } from '../utils/slugify.js';

/**
 * Public: Get all active services
 * GET /api/services
 */
export const getPublicServices = async (req, res, next) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
    return sendSuccess(res, 'Services retrieved successfully', services);
  } catch (error) {
    next(error);
  }
};

/**
 * Public: Get active service by slug
 * GET /api/services/:slug
 */
export const getPublicServiceBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const service = await prisma.service.findUnique({
      where: { slug },
    });

    if (!service || !service.isActive) {
      return sendError(res, 'Service not found', 404);
    }

    return sendSuccess(res, 'Service details retrieved successfully', service);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get all services (active and inactive)
 * GET /api/services/admin/all
 */
export const getAdminServices = async (req, res, next) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return sendSuccess(res, 'All services retrieved for admin', services);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Create a new service
 * POST /api/services
 */
export const createService = async (req, res, next) => {
  try {
    const data = req.body;
    const slug = data.slug ? slugify(data.slug) : slugify(data.title);

    // Check duplicate slug
    const existing = await prisma.service.findUnique({ where: { slug } });
    if (existing) {
      return sendError(res, `Service slug '${slug}' already exists`, 409);
    }

    const service = await prisma.service.create({
      data: {
        ...data,
        slug,
      },
    });

    return sendSuccess(res, 'Service created successfully', service, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update a service
 * PATCH /api/services/:id
 */
export const updateService = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = req.body;

    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Service not found', 404);
    }

    let slug = existing.slug;
    if (data.slug) {
      slug = slugify(data.slug);
    } else if (data.title && data.title !== existing.title && !data.slug) {
      slug = slugify(data.title);
    }

    if (slug !== existing.slug) {
      const duplicate = await prisma.service.findUnique({ where: { slug } });
      if (duplicate && duplicate.id !== id) {
        return sendError(res, `Service slug '${slug}' already exists`, 409);
      }
    }

    const updated = await prisma.service.update({
      where: { id },
      data: {
        ...data,
        slug,
      },
    });

    return sendSuccess(res, 'Service updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Delete a service
 * DELETE /api/services/:id
 */
export const deleteService = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Service not found', 404);
    }

    await prisma.service.delete({ where: { id } });
    return sendSuccess(res, 'Service deleted successfully');
  } catch (error) {
    next(error);
  }
};
