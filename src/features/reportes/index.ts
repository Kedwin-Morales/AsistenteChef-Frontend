/**
 * Sistema de reportes PDF reutilizable.
 *
 * Para agregar un nuevo reporte:
 *  1. Crear `features/reportes/documents/NuevaEntidadReport.tsx` que reciba el
 *     DTO por props y renderice <Document>/<Page> usando los componentes de
 *     `features/reportes/components`.
 *  2. En la tabla del módulo, agregar la acción <ReportAction>:
 *       <ReportAction
 *         document={<NuevaEntidadReport data={row} />}
 *         fileName={createPdfFileName("NuevaEntidad", row.nombre, row.fecha)}
 *       />
 */

export { ReportHeader } from "./components/ReportHeader";
export { ReportFooter } from "./components/ReportFooter";
export { ReportPageNumber } from "./components/ReportPageNumber";
export { ReportSection } from "./components/ReportSection";
export { ReportInfoGrid } from "./components/ReportInfoGrid";
export { ReportImage } from "./components/ReportImage";
export { resolveReportImageUrl } from "./utils/imageUtils";
export { ReportTable } from "./components/ReportTable";
export { ReportAction } from "./components/ReportAction";
export { MontajeReport } from "./documents/MontajeReport";

export { createPdfFileName, toPdfFile } from "./utils/pdfFileName";
export { openPdf, downloadPdf, printPdf } from "./utils/pdfGenerator";
export { formatDateOnly } from "./utils/dateUtils";
export { REPORT_CONFIG } from "./config/reportConfig";