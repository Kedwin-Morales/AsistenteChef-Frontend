import type { ReactNode } from "react";
import { Text, View } from "@react-pdf/renderer";
import reportStyles from "../styles/reportStyles";

interface ReportSectionProps {
  title: string;
  children: ReactNode;
}

/** Sección genérica del reporte: título en cinta y cuerpo. */
export function ReportSection({ title, children }: ReportSectionProps) {
  return (
    <View style={reportStyles.section}>
      <View style={reportStyles.sectionTitleBox}>
        <Text style={reportStyles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

export default ReportSection;
