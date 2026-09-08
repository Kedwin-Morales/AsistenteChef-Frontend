import { Text, View } from "@react-pdf/renderer";
import type { ReportColumn } from "../types/report.types";
import reportStyles from "../styles/reportStyles";

interface ReportTableProps<T> {
  columns: ReportColumn<T>[];
  data: T[];
  /** Propiedad usada como key para cada fila. */
  rowKey?: (row: T) => string | number;
  /** Prefijo para keys auto-generadas si rowKey no se provee. */
  idPrefix?: string;
}

function cellValue<T>(row: T, column: ReportColumn<T>): string {
  const raw = column.render ? column.render(row) : (row as Record<string, unknown>)[column.key];
  if (raw === null || raw === undefined) return "";
  const str = String(raw);
  return str === "" ? "" : str;
}

function cellWidth<T>(column: ReportColumn<T>): string | number {
  return column.width ?? "auto";
}

function cellAlign<T>(column: ReportColumn<T>): "left" | "center" | "right" {
  return column.align ?? "left";
}

/**
 * Tabla reutilizable para reportes PDF.
 *
 * - Encabezado fijo que se repite automáticamente al pasar de página
 *   (la cabecera se marca con `fixed` y el contenido con `wrap={false}`).
 * - Soporta múltiples columnas, ancho configurable, alineación y valores null.
 * - Si la tabla es muy larga, ocupa varias páginas sin romperse.
 * - No renderiza filas si `data` está vacío.
 */
export function ReportTable<T>({
  columns,
  data,
  rowKey,
  idPrefix = "row",
}: ReportTableProps<T>) {
  if (!data.length) return null;

  return (
    <View style={reportStyles.table}>
      {/* Encabezado: fixed para repetirse cuando la tabla continúa en otra página */}
      <View style={reportStyles.tableHeaderRow} fixed>
        {columns.map((col) => (
          <View
            key={col.key}
            style={{
              width: cellWidth(col),
              ...reportStyles.tableHeaderCell,
              textAlign: cellAlign(col),
            }}
          >
            <Text>{col.label}</Text>
          </View>
        ))}
      </View>

      {data.map((row, index) => {
        const key = rowKey ? rowKey(row) : `${idPrefix}-${index}`;
        return (
          <View
            key={key}
            style={[
              reportStyles.tableRow,
              ...(index % 2 === 1 ? [reportStyles.tableRowOdd] : []),
            ]}
            wrap={false}
          >
            {columns.map((col) => {
              const value = cellValue(row, col);
              return (
                <View
                  key={`${key}-${col.key}`}
                  style={{
                    width: cellWidth(col),
                    ...reportStyles.tableCell,
                    textAlign: cellAlign(col),
                  }}
                >
                  <Text>{value || "—"}</Text>
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

export default ReportTable;