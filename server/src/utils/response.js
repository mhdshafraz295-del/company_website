/**
 * Standard Success Response
 */
export const sendSuccess = (res, message = 'Operation successful', data = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
  };
  if (data !== null) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
};

/**
 * Standard Paginated Response
 */
export const sendPaginated = (
  res,
  message = 'Records retrieved successfully',
  data = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 0 },
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination: {
      page: Number(pagination.page),
      limit: Number(pagination.limit),
      total: Number(pagination.total),
      totalPages: Number(pagination.totalPages),
    },
  });
};

/**
 * Standard Error Response
 */
export const sendError = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };
  if (errors) {
    response.errors = errors;
  }
  return res.status(statusCode).json(response);
};
