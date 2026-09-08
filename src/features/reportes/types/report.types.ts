/**
 * Tipos compartidos del sistema de reportes PDF.
 */

export interface ReportColumn<T> {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  width?: string | number;
  render?: (row: T) => string | number | null | undefined;
}

export interface ReportActionProps {
  /**
   * El documento React PDF lista para renderizar (recibe los datos por props).
   * Ej.: <MontajeReport data={montaje} />
   */
  document: React.ReactElement;
  /** Nombre de archivo sin extensión (se normaliza internamente). */
  fileName: string;
}

/** Utilidad de nombre de archivo. */
export interface PdfFileNameOptions {
  /** Expresión que normaliza (elimina tildes). */
  normalize?: boolean;
}
