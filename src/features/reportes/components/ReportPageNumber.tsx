import { Text } from "@react-pdf/renderer";
import reportStyles from "../styles/reportStyles";

/** Numeración de página reutilizable. */
export function ReportPageNumber() {
  return (
    <Text
      style={reportStyles.footerText}
      render={({ pageNumber }) => `Página ${pageNumber}`}
      fixed
    />
  );
}

export default ReportPageNumber;
