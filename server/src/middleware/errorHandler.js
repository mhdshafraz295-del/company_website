import { sendError } from '../utils/response.js';
import { config } from '../config/index.js';

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.status || err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  let message = err.message || 'Internal Server Error';
  let errors = null;

  // 1. Zod Validation Errors
  if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation Error';
    const issues = err.issues || err.errors || [];
    errors = issues.map((e) => ({
      field: Array.isArray(e.path) ? e.path.join('.') : String(e.path),
      message: e.message,
    }));
  }

  // 2. Prisma Known Request Errors
  else if (err.code === 'P2002') {
    statusCode = 409;
    const targetField = err.meta?.target ? (Array.isArray(err.meta.target) ? err.meta.target.join(', ') : err.meta.target) : 'Field';
    message = `Duplicate record conflict: ${targetField} must be unique`;
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = err.meta?.cause || 'Requested record was not found';
  } else if (err.code === 'P2003') {
    statusCode = 400;
    message = 'Foreign key constraint failed on operation';
  }

  // 3. JWT Errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired';
  }

  // 4. Production Security Shield for 500 errors
  if (statusCode === 500 && config.nodeEnv === 'production') {
    message = 'An unexpected error occurred. Please try again later.';
    console.error('SERVER ERROR [500]:', err);
  }

  return sendError(res, message, statusCode, errors);
};
