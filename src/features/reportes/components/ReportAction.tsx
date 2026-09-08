import { FileText } from "lucide-react";
import { useState } from "react";
import type { DocumentProps } from "@react-pdf/renderer";
import { generateReportPdf } from "../utils/pdfActions";

interface ReportActionProps {
  /** Documento React PDF listo para renderizar (recibe datos por props). */
  document: React.ReactElement<DocumentProps>;
  /** Nombre de archivo normalizado (sin extensión). Ej.: "Montaje-Plato-Ejecutivo-2026-09-04". */
  fileName: string;
}

/**
 * Acción reutilizable "PDF" para las tablas del sistema.
 *
 * Genera el PDF y lo abre en una pestaña nueva (el visor del navegador permite
 * imprimir directamente). Maneja errores con Sileo.
 *
 * Uso (coherente con la arquitectura de datos por props):
 *   <ReportAction
 *     document={<MontajeReport data={montaje} />}
 *     fileName={createPdfFileName("Montaje", montaje.nombre, montaje.fecha)}
 *   />
 */
export function ReportAction({ document, fileName }: ReportActionProps) {
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);
    await generateReportPdf(document, fileName);
    setBusy(false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      title="Generar / imprimir PDF"
      className={`p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition
        ${busy ? "opacity-50 cursor-wait" : ""}`}
      data-bs-toggle="tooltip"
      aria-label="Generar / imprimir PDF"
    >
      <FileText size={16} />
    </button>
  );
}

export default ReportAction;