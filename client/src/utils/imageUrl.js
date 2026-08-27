/**
 * Resolves the backend origin from environment or default configuration
 * e.g. "http://localhost:5000/api" -> "http://localhost:5000"
 * "https://companywebsite-production-8ebe.up.railway.app/api" -> "https://companywebsite-production-8ebe.up.railway.app"
 */
export const getBackendOrigin = () => {
  const envUrl =
    (typeof import.meta !== 'undefined' &&
      import.meta.env &&
      (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL)) ||
    (typeof process !== 'undefined' &&
      process.env &&
      (process.env.VITE_API_URL || process.env.VITE_API_BASE_URL)) ||
    'http://localhost:5000/api';

  let trimmed = envUrl.trim().replace(/\/+$/, '');
  if (trimmed.endsWith('/api')) {
    trimmed = trimmed.slice(0, -4);
  }
  return trimmed.replace(/\/+$/, '');
};

/**
 * Resolves full URL for uploaded assets (Cloudinary, Blob, Data, Local Uploads, or Public Frontend Assets)
 * @param {string} url - Image URL string from DB or upload response
 * @returns {string} Fully resolved image URL
 */
export const getImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';

  const trimmed = url.trim();
  if (!trimmed) return '';

  // 1. Absolute URLs (http://, https://, blob:, data:) - return unchanged (Cloudinary passes directly)
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:')
  ) {
    return trimmed;
  }

  // 2. Local uploads starting with /uploads/ or uploads/
  if (trimmed.startsWith('/uploads') || trimmed.startsWith('uploads')) {
    const origin = getBackendOrigin();
    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${origin}${cleanPath}`;
  }

  // 3. Normal public frontend paths (e.g. /images/...) - return unchanged
  return trimmed;
};

export default getImageUrl;
