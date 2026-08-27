import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseUploadsDir = path.resolve(__dirname, '../../uploads');

const ALLOWED_FOLDERS = ['projects', 'team', 'founder', 'case-studies', 'general'];

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || config.cloudinary?.cloudName;
  const apiKey = process.env.CLOUDINARY_API_KEY || config.cloudinary?.apiKey;
  const apiSecret = process.env.CLOUDINARY_API_SECRET || config.cloudinary?.apiSecret;
  const folder = process.env.CLOUDINARY_FOLDER || config.cloudinary?.folder || 'nexgen-solutions';

  const missing = [];
  if (!cloudName) missing.push('CLOUDINARY_CLOUD_NAME');
  if (!apiKey) missing.push('CLOUDINARY_API_KEY');
  if (!apiSecret) missing.push('CLOUDINARY_API_SECRET');

  return {
    cloudName,
    apiKey,
    apiSecret,
    folder,
    isConfigured: missing.length === 0,
    missing,
  };
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

  const provider = (process.env.MEDIA_STORAGE_PROVIDER || config.mediaStorageProvider || 'cloudinary').toLowerCase();
  const cConfig = getCloudinaryConfig();

  // 1. Cloudinary Storage Provider
  if (provider === 'cloudinary') {
    if (!cConfig.isConfigured) {
      const err = new Error(
        `Cloudinary configuration error: MEDIA_STORAGE_PROVIDER is set to 'cloudinary', but required environment variable(s) missing: ${cConfig.missing.join(', ')}.`
      );
      err.status = 500;
      throw err;
    }

    cloudinary.config({
      cloud_name: cConfig.cloudName,
      api_key: cConfig.apiKey,
      api_secret: cConfig.apiSecret,
      secure: true,
    });

    const baseFolder = cConfig.folder || 'nexgen-solutions';
    const cloudinaryFolder = `${baseFolder}/${safeCategory}`;

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
            const uploadErr = new Error(`Failed to upload image to Cloudinary: ${error.message || 'Upload error'}`);
            uploadErr.status = 500;
            return reject(uploadErr);
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

  // 2. Local File System Storage (only when MEDIA_STORAGE_PROVIDER=local)
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

  const cConfig = getCloudinaryConfig();
  const derivedPublicId = extractPublicIdFromUrl(urlOrPublicId) || urlOrPublicId;

  if (
    cConfig.isConfigured &&
    derivedPublicId &&
    (derivedPublicId.startsWith(`${cConfig.folder}/`) || derivedPublicId.includes('nexgen-solutions/'))
  ) {
    try {
      cloudinary.config({
        cloud_name: cConfig.cloudName,
        api_key: cConfig.apiKey,
        api_secret: cConfig.apiSecret,
        secure: true,
      });
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
