import { Image, View } from "@react-pdf/renderer";
import reportStyles from "../styles/reportStyles";
import { resolveReportImageUrl } from "../utils/imageUtils";

interface ReportImageProps {
  /** Ruta relativa (con REPORT_IMAGE_BASE_URL) o URL completa. */
  src?: string | null;
}

/**
 * Imagen opcional del reporte. Si `src` está vacío/nulo, no renderiza nada y
 * el documento continúa normalmente con el resto del contenido.
 */
export function ReportImage({ src }: ReportImageProps) {
  const resolved = resolveReportImageUrl(src);
  if (!resolved) return null;

  return (
    <View style={reportStyles.imageWrap}>
      <Image style={reportStyles.image} src={resolved} />
    </View>
  );
}

export default ReportImage;