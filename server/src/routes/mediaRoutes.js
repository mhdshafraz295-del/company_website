import express from 'express';
import { uploadImage, uploadMultipleImages, deleteImage } from '../controllers/mediaController.js';
import { uploadSingle, uploadMultiple } from '../middleware/upload.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Admin Protected Media Upload Endpoints
router.post('/upload', authenticateAdmin, (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(err.status || 400).json({
        success: false,
        message: err.message || 'File upload failed.',
      });
    }
    next();
  });
}, uploadImage);

router.post('/upload-multiple', authenticateAdmin, (req, res, next) => {
  uploadMultiple(req, res, (err) => {
    if (err) {
      return res.status(err.status || 400).json({
        success: false,
        message: err.message || 'Multiple files upload failed.',
      });
    }
    next();
  });
}, uploadMultipleImages);

router.delete('/delete', authenticateAdmin, deleteImage);

export default router;
