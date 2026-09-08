import { Image, Text, View } from "@react-pdf/renderer";
import REPORT_CONFIG from "../config/reportConfig";
import reportStyles from "../styles/reportStyles";
import { formatDateOnly } from "../utils/dateUtils";

interface ReportHeaderProps {
  /** Título del reporte, ej.: "REPORTE DE MONTAJE". */
  title: string;
  /** Subtítulo / nombre de la entidad, ej.: "Plato Ejecutivo". */
  subtitle?: string;
}

/**
 * Encabezado reutilizable del reporte: logo, nombre de empresa, título,
 * subtítulo y fecha de generación.
 */
export function ReportHeader({ title, subtitle }: ReportHeaderProps) {
  const { companyName, logo } = REPORT_CONFIG;

  return (
    <View style={reportStyles.header} fixed>
      <View style={reportStyles.headerLeft}>
        <Image style={reportStyles.headerLogo} src={logo.src} />
        <Text style={reportStyles.headerCompany}>{companyName}</Text>
      </View>

      <View style={reportStyles.headerRight}>
        <Text style={reportStyles.headerTitle}>{title}</Text>
        {subtitle ? (
          <Text style={reportStyles.headerSubtitle}>{subtitle}</Text>
        ) : null}
        <Text style={reportStyles.headerSubtitle}>
          {`Generado: ${formatDateOnly(new Date())}`}
        </Text>
      </View>
    </View>
  );
}

export default ReportHeader;
