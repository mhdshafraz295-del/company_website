import { uploadSingleImage, deleteManagedImage } from '../services/mediaStorageService.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * Handle single image upload via Media Storage Service (Cloudinary or Local)
 * POST /api/media/upload
 */
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 'No image file uploaded.', 400);
    }

    const folder = req.query.folder || req.body.folder || 'general';

    const result = await uploadSingleImage({
      buffer: req.file.buffer,
      originalname: req.file.originalname,
      folder,
      mimeType: req.file.mimetype,
    });

    return sendSuccess(res, 'Image uploaded successfully', {
      url: result.url,
      publicId: result.publicId,
      filename: result.filename,
      size: result.size,
      mimetype: result.mimetype,
      provider: result.provider,
    }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Handle multiple images upload via Media Storage Service
 * POST /api/media/upload-multiple
 */
export const uploadMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return sendError(res, 'No image files uploaded.', 400);
    }

    const folder = req.query.folder || req.body.folder || 'general';
    const uploadedResults = [];

    for (const file of req.files) {
      const result = await uploadSingleImage({
        buffer: file.buffer,
        originalname: file.originalname,
        folder,
        mimeType: file.mimetype,
      });
      uploadedResults.push({
        url: result.url,
        publicId: result.publicId,
        filename: result.filename,
        size: result.size,
        mimetype: result.mimetype,
        provider: result.provider,
      });
    }

    return sendSuccess(res, 'Images uploaded successfully', uploadedResults, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a managed image reference (Cloudinary or Local Managed Upload)
 * DELETE /api/media/delete
 */
export const deleteImage = async (req, res, next) => {
  try {
    const { url, publicId } = req.body;
    const targetRef = publicId || url;

    if (!targetRef || typeof targetRef !== 'string') {
      return sendError(res, 'Image URL or publicId reference is required.', 400);
    }

    const result = await deleteManagedImage(targetRef);
    return sendSuccess(res, 'Image deleted successfully.', result);
  } catch (error) {
    if (error.status) {
      return sendError(res, error.message, error.status);
    }
    next(error);
  }
};
