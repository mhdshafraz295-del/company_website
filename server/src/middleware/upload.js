import multer from 'multer';
import path from 'path';

// Allowed subfolders to prevent path traversal
const ALLOWED_FOLDERS = ['projects', 'team', 'founder', 'case-studies', 'general'];

// Allowed MIME types & extensions
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

// Use Memory Storage for streaming buffers directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype) || !ALLOWED_EXTENSIONS.includes(ext)) {
    const error = new Error('Invalid file format. Only JPG, PNG, and WebP images are allowed.');
    error.status = 400;
    return cb(error, false);
  }

  cb(null, true);
};

export const uploadSingle = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max per file
  },
}).single('image');

export const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max per file
    files: 10, // Max 10 images per request
  },
}).array('images', 10);
