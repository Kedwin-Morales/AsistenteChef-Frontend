/**
 * Utilidades de formato para reportes PDF.
 */

/** Formatea una fecha como DD/MM/YYYY (sin hora). */
export function formatDateOnly(date?: Date | string | null): string {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
