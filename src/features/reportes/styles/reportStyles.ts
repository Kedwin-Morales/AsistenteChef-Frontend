/**
 * ============================================================================
 *  SISTEMA CENTRALIZADO DE ESTILOS PARA REPORTES PDF
 * ============================================================================
 *  Identidad visual propia del documento. NO usa variables del tema de la app
 *  (--primary, --secondary, etc.). Todos los reportes comparten estos estilos.
 * ============================================================================
 */
import type { Style } from "@react-pdf/types";
import { FREE_FONT } from "./reportFonts";

/** Paleta propia del documento (gastronómico/administrativo). */
export const reportPalette = {
  primary: "#7A1E1E", // rojo vino corporativo
  accent: "#ae8625", // dorado
  ink: "#1F2937", // texto principal
  muted: "#6B7280", // texto secundario
  line: "#E5E7EB", // bordes suaves
  headerFill: "#ae8625", // fondo de cabecera de tabla
  headerText: "#FFFFFF", // texto de cabecera de tabla
  zebra: "#FAF7F2", // filas alternadas
  white: "#FFFFFF",
  success: "#15803D",
  danger: "#B91C1C",
} as const;

/** Tamaño de página: A4 vertical. */
export const PAGE = {
  size: "A4" as const,
  orientation: "portrait" as const,
  margin: 40,
};

/** Metadata por defecto de todos los documentos. */
export const REPORT_METADATA = {
  producer: "Asistente Chef - Reportes PDF",
  creator: "Asistente Chef",
} as const;

/* ---------- Tipografía ---------- */

const base = {
  fontFamily: FREE_FONT,
  color: reportPalette.ink,
  fontSize: 9,
  lineHeight: 1.2,
} as const;

/* ---------- Estilos de página ---------- */

export const reportStyles: Record<string, Style> = {
  page: {
    ...base,
    fontFamily: FREE_FONT,
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 40,
  },

  /* ---------- Header ---------- */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: reportPalette.primary,
    paddingBottom: 6,
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerLogo: {
    width: 46,
    height: 46,
    objectFit: "contain",
  },
  headerCompany: {
    color: reportPalette.primary,
    fontSize: 14,
    fontWeight: 700 as const,
    letterSpacing: 1.2,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: 700 as const,
    color: reportPalette.ink,
    textTransform: "uppercase",
    textAlign: "right" as const,
  },
  headerSubtitle: {
    fontSize: 8,
    color: reportPalette.muted,
    textAlign: "right" as const,
    marginTop: 2,
  },

  /* ---------- Título del documento + subtítulo (sobre imagen hero) ---------- */
  docTitle: {
    fontSize: 18,
    fontWeight: 700 as const,
    color: reportPalette.primary,
    marginBottom: 2,
  },
  docSubtitle: {
    fontSize: 11,
    color: reportPalette.muted,
    marginBottom: 6,
  },

  /* ---------- Info de generación ---------- */
  metaLine: {
    fontSize: 8,
    color: reportPalette.muted,
    marginBottom: 14,
  },

  /* ---------- Secciones ---------- */
  section: {
    marginBottom: 16,
  },
  sectionTitleBox: {
    backgroundColor: reportPalette.primary,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 4,
  },
  sectionTitle: {
    color: reportPalette.white,
    fontSize: 9,
    fontWeight: 700 as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.6,
  },
  sectionBody: {
    fontSize: 9,
  },

  /* ---------- Info grid ---------- */
  infoGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
  },
  infoCell: {
    width: "49%",
    flexDirection: "row" as const,
    paddingVertical: 4,
  },
  infoLabel: {
    width: 110,
    fontSize: 8,
    color: reportPalette.muted,
  },
  infoValue: {
    flex: 1,
    fontSize: 9,
    color: reportPalette.ink,
    fontWeight: 500,
  },

  /* ---------- Tablas ---------- */
  table: {
    width: "100%",
  },
  tableHeaderRow: {
    flexDirection: "row" as const,
    backgroundColor: reportPalette.headerFill,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderCell: {
    color: reportPalette.headerText,
    fontSize: 8,
    fontWeight: 700 as const,
    paddingVertical: 4,
    paddingHorizontal: 6,
    textTransform: "uppercase" as const,
  },
  tableRow: {
    flexDirection: "row" as const,
    borderBottomWidth: 1,
    borderBottomColor: reportPalette.line,
  },
  tableRowOdd: {
    backgroundColor: reportPalette.zebra,
  },
  tableCell: {
    fontSize: 8,
    color: reportPalette.ink,
    paddingVertical: 5,
    paddingHorizontal: 6,
  },

  /* ---------- Imagen ---------- */
  imageWrap: {
    alignItems: "center" as const,
    marginVertical: 6,
  },
  image: {
    width: 300,
    height: 250,
    objectFit: "fill" as const,
    borderWidth: 1,
    borderColor: reportPalette.line,
    borderRadius: 6,
    padding: 4,
  },

  /* ---------- Footer ---------- */
  footer: {
    position: "absolute" as const,
    left: 40,
    right: 40,
    bottom: 25,
    borderTopWidth: 1,
    borderTopColor: reportPalette.line,
    paddingTop: 8,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  footerText: {
    fontSize: 7,
    color: reportPalette.muted,
  },
  footerCompany: {
    fontSize: 7,
    color: reportPalette.muted,
    fontWeight: 600,
  },
};

export default reportStyles;
