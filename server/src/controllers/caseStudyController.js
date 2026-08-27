import prisma from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { slugify } from '../utils/slugify.js';

const projectInclude = {
  project: {
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      coverImage: true,
    },
  },
};

/**
 * Public: Get published case studies
 * GET /api/case-studies
 */
export const getPublicCaseStudies = async (req, res, next) => {
  try {
    const caseStudies = await prisma.caseStudy.findMany({
      where: { published: true },
      include: projectInclude,
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, 'Case studies retrieved successfully', caseStudies);
  } catch (error) {
    next(error);
  }
};

/**
 * Public: Get published case study by slug
 * GET /api/case-studies/:slug
 */
export const getPublicCaseStudyBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const caseStudy = await prisma.caseStudy.findUnique({
      where: { slug },
      include: projectInclude,
    });

    if (!caseStudy || !caseStudy.published) {
      return sendError(res, 'Case study not found', 404);
    }

    return sendSuccess(res, 'Case study details retrieved successfully', caseStudy);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get all case studies (published and unpublished)
 * GET /api/case-studies/admin/all
 */
export const getAdminCaseStudies = async (req, res, next) => {
  try {
    const caseStudies = await prisma.caseStudy.findMany({
      include: projectInclude,
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, 'All case studies retrieved for admin', caseStudies);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Create case study
 * POST /api/case-studies
 */
export const createCaseStudy = async (req, res, next) => {
  try {
    const data = req.body;
    const slug = data.slug ? slugify(data.slug) : slugify(data.title);

    const existing = await prisma.caseStudy.findUnique({ where: { slug } });
    if (existing) {
      return sendError(res, `Case study slug '${slug}' already exists`, 409);
    }

    if (data.projectId) {
      const projectExists = await prisma.project.findUnique({ where: { id: data.projectId } });
      if (!projectExists) {
        return sendError(res, 'Associated project not found', 400);
      }
    }

    const caseStudy = await prisma.caseStudy.create({
      data: {
        ...data,
        slug,
      },
      include: projectInclude,
    });

    return sendSuccess(res, 'Case study created successfully', caseStudy, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update case study
 * PATCH /api/case-studies/:id
 */
export const updateCaseStudy = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = req.body;

    const existing = await prisma.caseStudy.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Case study not found', 404);
    }

    let slug = existing.slug;
    if (data.slug) {
      slug = slugify(data.slug);
    } else if (data.title && data.title !== existing.title && !data.slug) {
      slug = slugify(data.title);
    }

    if (slug !== existing.slug) {
      const duplicate = await prisma.caseStudy.findUnique({ where: { slug } });
      if (duplicate && duplicate.id !== id) {
        return sendError(res, `Case study slug '${slug}' already exists`, 409);
      }
    }

    if (data.projectId) {
      const projectExists = await prisma.project.findUnique({ where: { id: data.projectId } });
      if (!projectExists) {
        return sendError(res, 'Associated project not found', 400);
      }
    }

    const updated = await prisma.caseStudy.update({
      where: { id },
      data: {
        ...data,
        slug,
      },
      include: projectInclude,
    });

    return sendSuccess(res, 'Case study updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Delete case study
 * DELETE /api/case-studies/:id
 */
export const deleteCaseStudy = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.caseStudy.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Case study not found', 404);
    }

    await prisma.caseStudy.delete({ where: { id } });
    return sendSuccess(res, 'Case study deleted successfully');
  } catch (error) {
    next(error);
  }
};
