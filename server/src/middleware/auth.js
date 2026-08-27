import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import prisma from '../utils/prisma.js';
import { sendError } from '../utils/response.js';

/**
 * Authenticates requests requiring admin access via Bearer JWT token.
 */
export const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);

    if (!decoded || !decoded.id) {
      return sendError(res, 'Invalid authentication token payload.', 401);
    }

    const admin = await prisma.adminUser.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!admin) {
      return sendError(res, 'Admin account not found.', 401);
    }

    if (!admin.isActive) {
      return sendError(res, 'Admin account has been deactivated.', 403);
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return sendError(res, error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token', 401);
    }
    next(error);
  }
};

/**
 * Authorizes admin request based on allowed roles.
 */
export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.admin) {
      return sendError(res, 'Authentication required.', 401);
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(req.admin.role)) {
      return sendError(res, 'Insufficient permissions for this resource.', 403);
    }
    next();
  };
};
