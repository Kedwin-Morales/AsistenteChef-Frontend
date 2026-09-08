/**
 * ============================================================================
 *  SISTEMA DE FUENTES PARA REPORTES PDF
 * ============================================================================
 *  Los reportes no dependen del tema CSS de la app. Para mantener el PDF
 *  estable y offline, se utiliza la fuente estándar "Helvetica" incluida en
 *  @react-pdf/renderer (no requiere registro ni descarga).
 *
 *  Si se desea usar "Inter" (la fuente del proyecto), basta con descargar el
 *  archivo .ttf, colocarlo por ejemplo en `src/assets/fonts/` y registrarlo
 *  aquí con `Font.register(...)`, luego cambiar FREE_FONT por "Inter".
 *
 *  Ejemplo:
 *    import InterRegular from "@/assets/fonts/Inter-Regular.ttf";
 *    import InterBold from "@/assets/fonts/Inter-Bold.ttf";
 *    Font.register({
 *      family: "Inter",
 *      fonts: [
 *        { src: InterRegular, fontWeight: 400 },
 *        { src: InterBold, fontWeight: 700 },
 *      ],
 *    });
 * ============================================================================
 */
import { Font } from "@react-pdf/renderer";

export const FREE_FONT = "Helvetica";

/** Fuente monoespaciada (los reportes no la usan por defecto, pero queda disponible). */
export const MONO_FONT = "Courier";

/** Registro opcional de fuentes. Por defecto solo se usan fuentes estándar. */
export function registerReportFonts(): void {
  Font.registerHyphenationCallback((word: string) => [word]);
}

export default FREE_FONT;
