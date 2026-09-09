import type { ReactNode } from "react";
import { Text, View } from "@react-pdf/renderer";
import reportStyles from "../styles/reportStyles";

interface InfoRow {
  label: string;
  value?: ReactNode;
}

interface ReportInfoGridProps {
  items: InfoRow[];
}

/** Convierte un valor a texto "—" cuando no existe (null/undefined/vacío). */
function displayValue(value: unknown): ReactNode {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string" && value.trim() === "") return "—";
  return String(value);
}

/**
 * Grilla de información estructurada, reutilizable. Soporta campos
 * null/undefined/cadenas vacías (se muestran como "—").
 */
export function ReportInfoGrid({ items }: ReportInfoGridProps) {
  return (
    <View style={reportStyles.infoGrid}>
      {items.map((item) => (
        <View 
          key={item.label} 
          style={item.label.toLowerCase() === "descripción" ? reportStyles.infoDesc : reportStyles.infoCell}>
          <Text style={reportStyles.infoLabel}>{item.label}</Text>
          <Text style={reportStyles.infoValue}>{displayValue(item.value)}</Text>
        </View>
      ))}
    </View>
  );
}

export default ReportInfoGrid;
