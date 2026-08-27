import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import prisma from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * Admin Login
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!admin) {
      return sendError(res, 'Invalid email or password', 401);
    }

    if (!admin.isActive) {
      return sendError(res, 'Admin account has been deactivated.', 403);
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Update lastLoginAt timestamp
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    const { passwordHash, ...adminData } = admin;

    return sendSuccess(res, 'Login successful', {
      token,
      admin: adminData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Current Authenticated Admin
 * GET /api/auth/me
 */
export const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, 'Admin profile retrieved successfully', {
      admin: req.admin,
    });
  } catch (error) {
    next(error);
  }
};
