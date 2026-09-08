import REPORT_CONFIG from "../config/reportConfig";

/**
 * Convierte la ruta de una imagen en una URL absoluta para el PDF.
 * - Si `url` ya es una URL completa (http/https) o absoluta (/) se usa tal cual.
 * - Si es una ruta relativa, se antepone REPORT_IMAGE_BASE_URL.
 * - Si es vacía/null, devuelve null (el bloque de imagen se oculta).
 */
export function resolveReportImageUrl(url?: string | null): string | null {
  if (!url || url.trim() === "") return null;
  if (/^(https?:\/\/|\/)/i.test(url)) return url;
  return `${REPORT_CONFIG.REPORT_IMAGE_BASE_URL}${url}`;
}