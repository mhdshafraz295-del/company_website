import prisma from '../utils/prisma.js';
import { sendSuccess, sendPaginated, sendError } from '../utils/response.js';
import { slugify } from '../utils/slugify.js';

/**
 * Helper to include relations in Project queries
 */
const projectInclude = {
  images: {
    orderBy: { displayOrder: 'asc' },
  },
  caseStudy: {
    select: {
      id: true,
      title: true,
      slug: true,
      problem: true,
      solution: true,
      result: true,
      published: true,
    },
  },
  technologies: {
    include: {
      technology: true,
    },
  },
};

/**
 * Helper to transform Project object for clean API response
 */
const formatProject = (project) => {
  if (!project) return null;
  const { technologies, ...rest } = project;
  return {
    ...rest,
    technologies: technologies ? technologies.map((pt) => pt.technology) : [],
  };
};

/**
 * Public: Get published projects
 * GET /api/projects
 */
export const getPublicProjects = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, category, featured } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const where = {
      published: true,
    };

    if (category) {
      where.category = category;
    }

    if (featured !== undefined) {
      where.featured = featured;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { shortDescription: { contains: search } },
        { fullDescription: { contains: search } },
      ];
    }

    const [total, projects] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        include: projectInclude,
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: limitNum,
      }),
    ]);

    const formattedProjects = projects.map(formatProject);
    const totalPages = Math.ceil(total / limitNum) || 1;

    return sendPaginated(
      res,
      'Published projects retrieved successfully',
      formattedProjects,
      { page: pageNum, limit: limitNum, total, totalPages }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Public: Get published project by slug
 * GET /api/projects/:slug
 */
export const getPublicProjectBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const project = await prisma.project.findUnique({
      where: { slug },
      include: projectInclude,
    });

    if (!project || !project.published) {
      return sendError(res, 'Project not found', 404);
    }

    return sendSuccess(res, 'Project details retrieved successfully', formatProject(project));
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get all projects (published and unpublished)
 * GET /api/projects/admin/all
 */
export const getAdminProjects = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, category, published, featured } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (category) where.category = category;
    if (published !== undefined) where.published = published;
    if (featured !== undefined) where.featured = featured;

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { shortDescription: { contains: search } },
      ];
    }

    const [total, projects] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        include: projectInclude,
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: limitNum,
      }),
    ]);

    const formattedProjects = projects.map(formatProject);
    const totalPages = Math.ceil(total / limitNum) || 1;

    return sendPaginated(
      res,
      'All projects retrieved for admin',
      formattedProjects,
      { page: pageNum, limit: limitNum, total, totalPages }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Helper to handle technology upserts & join table relations
 */
async function syncProjectTechnologies(projectId, technologyNames = []) {
  if (!Array.isArray(technologyNames)) return;

  // Clear existing project-technology links
  await prisma.projectTechnology.deleteMany({
    where: { projectId },
  });

  if (technologyNames.length === 0) return;

  // Connect or create technologies
  for (const techName of technologyNames) {
    const trimmedName = techName.trim();
    if (!trimmedName) continue;

    let tech = await prisma.technology.findUnique({
      where: { name: trimmedName },
    });

    if (!tech) {
      tech = await prisma.technology.create({
        data: { name: trimmedName },
      });
    }

    await prisma.projectTechnology.create({
      data: {
        projectId,
        technologyId: tech.id,
      },
    });
  }
}

/**
 * Admin: Create project
 * POST /api/projects
 */
export const createProject = async (req, res, next) => {
  try {
    const { technologies = [], ...data } = req.body;
    const slug = data.slug ? slugify(data.slug) : slugify(data.title);

    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      return sendError(res, `Project slug '${slug}' already exists`, 409);
    }

    const projectData = {
      ...data,
      slug,
    };
    if (data.coverImage !== undefined) {
      projectData.coverImage = data.coverImage;
    }

    const project = await prisma.project.create({
      data: projectData,
    });

    await syncProjectTechnologies(project.id, technologies);

    const fullProject = await prisma.project.findUnique({
      where: { id: project.id },
      include: projectInclude,
    });

    return sendSuccess(res, 'Project created successfully', formatProject(fullProject), 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update project
 * PATCH /api/projects/:id
 */
export const updateProject = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { technologies, ...data } = req.body;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Project not found', 404);
    }

    let slug = existing.slug;
    if (data.slug) {
      slug = slugify(data.slug);
    } else if (data.title && data.title !== existing.title && !data.slug) {
      slug = slugify(data.title);
    }

    if (slug !== existing.slug) {
      const duplicate = await prisma.project.findUnique({ where: { slug } });
      if (duplicate && duplicate.id !== id) {
        return sendError(res, `Project slug '${slug}' already exists`, 409);
      }
    }

    const updateData = {
      ...data,
      slug,
    };

    if (data.coverImage !== undefined) {
      updateData.coverImage = data.coverImage;
    }

    await prisma.project.update({
      where: { id },
      data: updateData,
    });

    if (technologies !== undefined) {
      await syncProjectTechnologies(id, technologies);
    }

    const updated = await prisma.project.findUnique({
      where: { id },
      include: projectInclude,
    });

    return sendSuccess(res, 'Project updated successfully', formatProject(updated));
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Delete project
 * DELETE /api/projects/:id
 */
export const deleteProject = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Project not found', 404);
    }

    await prisma.project.delete({ where: { id } });
    return sendSuccess(res, 'Project deleted successfully');
  } catch (error) {
    next(error);
  }
};
