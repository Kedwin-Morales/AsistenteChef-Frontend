/**
 * ============================================================================
 *  CONFIGURACIÓN GLOBAL DE REPORTES PDF
 * ============================================================================
 *  Modificar aquí los datos corporativos utilizados por los reportes PDF.
 *  Este archivo es la ÚNICA fuente de verdad para el logo, la empresa y la
 *  base URL de imágenes. Si cambian estos datos, se actualizan en todos los
 *  reportes automáticamente.
 * ============================================================================
 */

export const REPORT_CONFIG = {
  /** Nombre de la empresa mostrado en el encabezado de los reportes. */
  companyName: "CLOVERCUBE",

  company: {
    name: "CLOVERCUBE",
    address: "Av. Principal #123, Ciudad",
    phone: "+51 999 999 999",
    email: "contacto@clovercube.com",
    website: "www.clovercube.com",
  },

  /**
   * CAMBIAR AQUÍ LA URL BASE DEL SERVIDOR DE IMÁGENES SI CAMBIA LA RUTA DEL
   * BACKEND. La imagen de un montaje se construye como:
   *   REPORT_IMAGE_BASE_URL + urlImagen
   * Cuando `urlImagen` ya viene completa (http/https) se usa tal cual.
   */
  REPORT_IMAGE_BASE_URL: "https://localhost:7256/montaje/",

  /** Logo principal del reporte (ruta pública). */
  logo: {
    src: "/Clovercube.png",
    height: 46,
    width: 46,
  },
} as const;

export default REPORT_CONFIG;
