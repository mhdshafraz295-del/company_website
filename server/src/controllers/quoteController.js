import prisma from '../utils/prisma.js';
import { sendSuccess, sendPaginated, sendError } from '../utils/response.js';

/**
 * Public: Submit multi-step quote request
 * POST /api/quotes
 */
export const createPublicQuote = async (req, res, next) => {
  try {
    const {
      serviceId,
      serviceName,
      projectTitle,
      projectDescription,
      budgetRange,
      timeline,
      fullName,
      email,
      phone,
      whatsappNumber,
      companyName,
    } = req.body;

    let finalServiceName = serviceName;

    if (serviceId) {
      const serviceObj = await prisma.service.findUnique({ where: { id: serviceId } });
      if (serviceObj && !finalServiceName) {
        finalServiceName = serviceObj.title;
      }
    }

    const quote = await prisma.quoteRequest.create({
      data: {
        serviceId,
        serviceName: finalServiceName,
        projectTitle,
        projectDescription,
        budgetRange,
        timeline,
        fullName,
        email: email.toLowerCase(),
        phone,
        whatsappNumber,
        companyName,
        status: 'NEW', // Default status strictly enforced
      },
    });

    return sendSuccess(res, 'Quote request submitted successfully. We will contact you soon!', quote, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get all quote requests with filtering & pagination
 * GET /api/quotes
 */
export const getAdminQuotes = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status, serviceId } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (serviceId) {
      where.serviceId = parseInt(serviceId, 10);
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { email: { contains: search } },
        { companyName: { contains: search } },
        { projectTitle: { contains: search } },
        { projectDescription: { contains: search } },
      ];
    }

    const [total, quotes] = await Promise.all([
      prisma.quoteRequest.count({ where }),
      prisma.quoteRequest.findMany({
        where,
        include: {
          service: {
            select: { id: true, title: true, slug: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    return sendPaginated(
      res,
      'Quote requests retrieved successfully',
      quotes,
      { page: pageNum, limit: limitNum, total, totalPages }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get single quote request by ID
 * GET /api/quotes/:id
 */
export const getAdminQuoteById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const quote = await prisma.quoteRequest.findUnique({
      where: { id },
      include: {
        service: {
          select: { id: true, title: true, slug: true },
        },
      },
    });

    if (!quote) {
      return sendError(res, 'Quote request not found', 404);
    }

    return sendSuccess(res, 'Quote request details retrieved', quote);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update quote status
 * PATCH /api/quotes/:id/status
 */
export const updateQuoteStatus = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    const existing = await prisma.quoteRequest.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Quote request not found', 404);
    }

    const updated = await prisma.quoteRequest.update({
      where: { id },
      data: { status },
    });

    return sendSuccess(res, 'Quote request status updated', updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update admin notes
 * PATCH /api/quotes/:id/notes
 */
export const updateQuoteNotes = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { adminNotes } = req.body;

    const existing = await prisma.quoteRequest.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Quote request not found', 404);
    }

    const updated = await prisma.quoteRequest.update({
      where: { id },
      data: { adminNotes },
    });

    return sendSuccess(res, 'Quote request notes updated', updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Delete quote request
 * DELETE /api/quotes/:id
 */
export const deleteQuote = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.quoteRequest.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Quote request not found', 404);
    }

    await prisma.quoteRequest.delete({ where: { id } });
    return sendSuccess(res, 'Quote request deleted successfully');
  } catch (error) {
    next(error);
  }
};
