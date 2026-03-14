// ═══════════════════════════════════════════════════════
// Общие утилиты — piruza-store
// ═══════════════════════════════════════════════════════

// NEXT_PUBLIC_URL = 'http://localhost:7000' (без /api — для изображений)
const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:7000';

/**
 * Получить полный URL изображения
 *
 * @param {string|null} path - путь к изображению (например: '/uploads/sellers/image.webp')
 * @returns {string|null}
 *
 * @example
 * getImageUrl('/uploads/sellers/logo.webp')
 * // => 'http://localhost:7000/uploads/sellers/logo.webp'
 */
export function getImageUrl(path) {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${MEDIA_BASE_URL}${path}`;
}