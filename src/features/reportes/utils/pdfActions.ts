import { sileo } from "sileo";
import type { DocumentProps } from "@react-pdf/renderer";
import { openPdf } from "./pdfGenerator";
import { getErrorMessage } from "@/shared/services/error.utils";

/**
 * Genera y abre un PDF con el documento y nombre indicados, mostrando feedback
 * con Sileo ante errores. Es la fuente única de la lógica "abrir PDF" y puede
 * reutilizarse desde listas móviles (DataCardList) u otras acciones.
 */
export async function generateReportPdf(
  document: React.ReactElement<DocumentProps>,
  fileName: string,
): Promise<void> {
  try {
    await openPdf(document);
  } catch (error) {
    sileo.error({
      title: "Error de sistema",
      description: getErrorMessage(
        error,
        `No se pudo generar el PDF "${fileName}". Intente nuevamente.`,
      ),
    });
  }
}