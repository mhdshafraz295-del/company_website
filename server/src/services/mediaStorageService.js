import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseUploadsDir = path.resolve(__dirname, '../../uploads');

const ALLOWED_FOLDERS = ['projects', 'team', 'founder', 'case-studies', 'general'];

// Configure Cloudinary if credentials present
const isCloudinaryConfigured = Boolean(
  config.cloudinary.cloudName &&
  config.cloudinary.apiKey &&
  config.cloudinary.apiSecret
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure: true,
  });
}

/**
 * Extract Cloudinary public_id from a secure Cloudinary URL
 * Example: https://res.cloudinary.com/demo/image/upload/v123456/nexgen-solutions/projects/sample.jpg
 * Returns: nexgen-solutions/projects/sample
 */
export function extractPublicIdFromUrl(url) {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return null;
  }

  try {
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return null;

    let pathAfterUpload = url.substring(uploadIndex + 8);
    // Strip version prefix if present (v123456/)
    if (pathAfterUpload.match(/^v\d+\//)) {
      pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, '');
    }

    // Strip extension
    const lastDotIndex = pathAfterUpload.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      pathAfterUpload = pathAfterUpload.substring(0, lastDotIndex);
    }

    return pathAfterUpload;
  } catch (err) {
    return null;
  }
}

/**
 * Upload single image buffer or file to Cloudinary or Local Storage
 */
export async function uploadSingleImage({ buffer, originalname, folder = 'general', mimeType }) {
  const safeCategory = ALLOWED_FOLDERS.includes(folder.toLowerCase())
    ? folder.toLowerCase()
    : 'general';

  const baseFolder = config.cloudinary.folder || 'nexgen-solutions';
  const cloudinaryFolder = `${baseFolder}/${safeCategory}`;

  // 1. Cloudinary Storage Provider
  if (isCloudinaryConfigured && config.mediaStorageProvider !== 'local') {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: cloudinaryFolder,
          resource_type: 'image',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary Upload Error:', error);
            return reject(new Error('Failed to upload image to Cloudinary storage.'));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            filename: result.public_id.split('/').pop(),
            size: result.bytes,
            mimetype: mimeType || result.format,
            provider: 'cloudinary',
          });
        }
      );
      uploadStream.end(buffer);
    });
  }

  // 2. Local File System Fallback
  const targetDir = path.join(baseUploadsDir, safeCategory);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const ext = path.extname(originalname || '.png').toLowerCase() || '.png';
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const safeName = `${safeCategory}-${uniqueSuffix}${ext}`;
  const filePath = path.join(targetDir, safeName);

  fs.writeFileSync(filePath, buffer);

  return {
    url: `/uploads/${safeCategory}/${safeName}`,
    filename: safeName,
    size: buffer.length,
    mimetype: mimeType,
    provider: 'local',
  };
}

/**
 * Delete image reference safely (Cloudinary or Local Managed File)
 */
export async function deleteManagedImage(urlOrPublicId) {
  if (!urlOrPublicId || typeof urlOrPublicId !== 'string') {
    throw new Error('Image URL or publicId reference is required.');
  }

  // Block design asset deletion
  if (urlOrPublicId.includes('nexgen-logo') || urlOrPublicId.includes('nexgen-promo')) {
    const error = new Error('Official design assets cannot be deleted.');
    error.status = 403;
    throw error;
  }

  // Case A: Cloudinary Asset Deletion
  const baseFolder = config.cloudinary.folder || 'nexgen-solutions';
  const derivedPublicId = extractPublicIdFromUrl(urlOrPublicId) || urlOrPublicId;

  if (
    isCloudinaryConfigured &&
    derivedPublicId &&
    (derivedPublicId.startsWith(`${baseFolder}/`) || derivedPublicId.startsWith('nexgen-solutions/'))
  ) {
    try {
      const res = await cloudinary.uploader.destroy(derivedPublicId);
      return { success: true, provider: 'cloudinary', result: res.result };
    } catch (err) {
      console.error('Cloudinary asset deletion error:', err.message);
      throw new Error('Failed to delete Cloudinary asset.');
    }
  }

  // Case B: Managed Local File Deletion
  if (urlOrPublicId.startsWith('/uploads/')) {
    const relativeFilePath = urlOrPublicId.replace('/uploads/', '');
    const absolutePath = path.resolve(baseUploadsDir, relativeFilePath);

    if (!absolutePath.startsWith(baseUploadsDir)) {
      const error = new Error('Path traversal detected. File deletion denied.');
      error.status = 403;
      throw error;
    }

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      return { success: true, provider: 'local' };
    }
    return { success: true, provider: 'local', note: 'File not found on disk' };
  }

  // Case C: External URL (Not managed by local uploads or current Cloudinary namespace)
  return { success: true, provider: 'external', note: 'External image skipped safely' };
}
