import prisma from '../utils/prisma.js';
import { sendSuccess, sendPaginated, sendError } from '../utils/response.js';

/**
 * Public: Submit contact enquiry
 * POST /api/enquiries
 */
export const createPublicEnquiry = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      whatsappNumber,
      companyName,
      serviceId,
      projectDescription,
      budgetRange,
      projectTimeline,
      attachmentUrl,
    } = req.body;

    // Verify serviceId exists if provided
    if (serviceId) {
      const serviceExists = await prisma.service.findUnique({ where: { id: serviceId } });
      if (!serviceExists) {
        return sendError(res, 'Selected service does not exist', 400);
      }
    }

    const enquiry = await prisma.contactEnquiry.create({
      data: {
        fullName,
        email: email.toLowerCase(),
        phone,
        whatsappNumber,
        companyName,
        serviceId,
        projectDescription,
        budgetRange,
        projectTimeline,
        attachmentUrl,
        status: 'NEW', // Default status strictly enforced
      },
    });

    return sendSuccess(res, 'Enquiry submitted successfully. We will get back to you soon!', enquiry, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get all enquiries with filtering & pagination
 * GET /api/enquiries
 */
export const getAdminEnquiries = async (req, res, next) => {
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
        { projectDescription: { contains: search } },
      ];
    }

    const [total, enquiries] = await Promise.all([
      prisma.contactEnquiry.count({ where }),
      prisma.contactEnquiry.findMany({
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
      'Enquiries retrieved successfully',
      enquiries,
      { page: pageNum, limit: limitNum, total, totalPages }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get single enquiry by ID
 * GET /api/enquiries/:id
 */
export const getAdminEnquiryById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const enquiry = await prisma.contactEnquiry.findUnique({
      where: { id },
      include: {
        service: {
          select: { id: true, title: true, slug: true },
        },
      },
    });

    if (!enquiry) {
      return sendError(res, 'Enquiry not found', 404);
    }

    return sendSuccess(res, 'Enquiry details retrieved', enquiry);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update enquiry status
 * PATCH /api/enquiries/:id/status
 */
export const updateEnquiryStatus = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    const existing = await prisma.contactEnquiry.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Enquiry not found', 404);
    }

    const updated = await prisma.contactEnquiry.update({
      where: { id },
      data: { status },
    });

    return sendSuccess(res, 'Enquiry status updated', updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update admin notes
 * PATCH /api/enquiries/:id/notes
 */
export const updateEnquiryNotes = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { adminNotes } = req.body;

    const existing = await prisma.contactEnquiry.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Enquiry not found', 404);
    }

    const updated = await prisma.contactEnquiry.update({
      where: { id },
      data: { adminNotes },
    });

    return sendSuccess(res, 'Enquiry notes updated', updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Delete enquiry
 * DELETE /api/enquiries/:id
 */
export const deleteEnquiry = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.contactEnquiry.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Enquiry not found', 404);
    }

    await prisma.contactEnquiry.delete({ where: { id } });
    return sendSuccess(res, 'Enquiry deleted successfully');
  } catch (error) {
    next(error);
  }
};
