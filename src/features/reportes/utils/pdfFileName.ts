/**
 * Utilidad central para generar nombres de archivo PDF consistentes.
 *
 * Formato: {Tipo}-{Nombre}-{YYYY-MM-DD}.pdf
 * Ej.:    Montaje-Plato-Ejecutivo-2026-09-04.pdf
 */

const ACCENTS: Record<string, string> = {
  á: "a", é: "e", í: "i", ó: "o", ú: "u",
  Á: "A", É: "E", Í: "I", Ó: "O", Ú: "U",
  ñ: "n", Ñ: "N", ü: "u", Ü: "U",
};

/** Normaliza un texto de segmento: sin tildes, espacios -> guiones, sin caracteres inválidos. */
function normalizeSegment(value: string): string {
  return value
    .replace(/./g, (ch) => ACCENTS[ch] ?? ch)
    .replace(/[^\x20-\x7E]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/["/\\:*?<>|]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Convierte una fecha en YYYY-MM-DD (hora local). Si no es válida, usa hoy. */
function toDateStamp(date?: Date | string | null): string {
  const d = date instanceof Date ? date : date ? new Date(date) : new Date();
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Genera el nombre de archivo de un reporte.
 *
 * @param tipo            Ej.: "Montaje", "Receta", "Merma".
 * @param nombre          Ej.: "Plato Ejecutivo".
 * @param date            Fecha (opcional). Se usa hoy si no se proporciona.
 */
export function createPdfFileName(
  tipo: string,
  nombre: string,
  date?: Date | string | null,
): string {
  const tipoNorm = normalizeSegment(tipo) || "Reporte";
  const nombreNorm = normalizeSegment(nombre) || "Documento";
  return `${tipoNorm}-${nombreNorm}-${toDateStamp(date)}`;
}

/** Devuelve la extensión .pdf para un nombre de archivo normalizado. */
export function toPdfFile(name: string): string {
  return `${name}.pdf`;
}

export default createPdfFileName;
