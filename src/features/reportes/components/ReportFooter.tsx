import { Text, View } from "@react-pdf/renderer";
import REPORT_CONFIG from "../config/reportConfig";
import reportStyles from "../styles/reportStyles";
import { ReportPageNumber } from "./ReportPageNumber";

/**
 * Pie de página reutilizable: información corporativa configurable y numeración.
 * Se repite en todas las páginas del documento.
 */
export function ReportFooter() {
  const { company } = REPORT_CONFIG;

  return (
    <View style={reportStyles.footer} fixed>
      <Text style={reportStyles.footerCompany}>
        {company.name} · {company.address}
      </Text>
      <Text style={reportStyles.footerText}>
        {company.phone} · {company.email} · {company.website}
      </Text>
      <ReportPageNumber />
    </View>
  );
}

export default ReportFooter;
