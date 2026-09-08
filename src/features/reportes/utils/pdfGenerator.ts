/**
 * ============================================================================
 *  GENERADOR CENTRAL DE PDF
 * ============================================================================
 *  Encapsula la mecánica técnica de @react-pdf/renderer:
 *    - convertir el documento React en Blob
 *    - abrirlo en una pestaña nueva
 *    - descargarlo
 *    - imprimirlo
 *
 *  Los documentos (MontajeReport, RecetaReport, ...) NO conocen estos detalles:
 *  solo reciben datos por props y se renderizan como React.
 *
 *  API de uso recomendado:
 *    import { openPdf } from "@/features/reportes/utils/pdfGenerator";
 *    await openPdf(<MontajeReport data={data} />, "Montaje-Plato-Ejecutivo-2026-09-04");
 * ============================================================================
 */
import { pdf } from "@react-pdf/renderer";
import type { DocumentProps } from "@react-pdf/renderer";
import { toPdfFile } from "./pdfFileName";

export interface PdfDocumentInput {
  document: React.ReactElement<DocumentProps>;
  fileName: string;
}

/** Convierte un documento React PDF a un Blob de tipo application/pdf. */
export async function renderPdfBlob(
  doc: React.ReactElement<DocumentProps>,
): Promise<Blob> {
  const instance = pdf(doc).toBlob();
  return await instance;
}

/** Convierte un documento React PDF a base64 (útil para viewer/impresión). */
export async function renderPdfBase64(
  doc: React.ReactElement<DocumentProps>,
): Promise<string> {
  const instance = pdf(doc).toString();
  return await instance;
}

/**
 * Abre el PDF en una pestaña nueva. Solución robusta para "preview" e
 * "impresión": el visor nativo del navegador permite imprimir directamente.
 * El nombre de archivo no es necesario para abrir el documento.
 */
export async function openPdf(
  doc: React.ReactElement<DocumentProps>,
): Promise<void> {
  const blob = await renderPdfBlob(doc);
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  // Se revoca la URL al cabo de un tiempo para liberar memoria sin romper la pestaña.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/** Descarga el PDF directamente con el nombre de archivo indicado. */
export async function downloadPdf(
  doc: React.ReactElement<DocumentProps>,
  fileName: string,
): Promise<void> {
  const blob = await renderPdfBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = toPdfFile(fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Impresión: no existe un API nativo fiable en @react-pdf/renderer v4 para
 * imprimir sin abrir el documento. La solución robusta es abrir el PDF en una
 * pestaña nueva y que el usuario imprima desde el visor del navegador. Por eso
 * `printPdf` delega en `openPdf`. Documentado en la arquitectura.
 */
export async function printPdf(
  doc: React.ReactElement<DocumentProps>,
): Promise<void> {
  await openPdf(doc);
}

export default { openPdf, downloadPdf, printPdf, renderPdfBlob, renderPdfBase64 };
