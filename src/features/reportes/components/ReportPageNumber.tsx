import { Text } from "@react-pdf/renderer";
import reportStyles from "../styles/reportStyles";

/** Numeración de página reutilizable. El `fixed` lo aporta el contenedor (footer). */
export function ReportPageNumber() {
  return (
    <Text
      style={reportStyles.footerText}
      render={({ pageNumber }) => `Página ${pageNumber}`}
    />
  );
}

export default ReportPageNumber;
