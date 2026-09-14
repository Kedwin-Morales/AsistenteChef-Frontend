import { Document, Page, Text, View } from "@react-pdf/renderer";
import type { ModelSubDTO, ModelSubDET, DetPreparacion } from "@/features/subReceta/types/subReceta.types";
import { ReportHeader } from "../components/ReportHeader";
import { ReportFooter } from "../components/ReportFooter";
import { ReportSection } from "../components/ReportSection";
import { ReportInfoGrid } from "../components/ReportInfoGrid";
import { ReportTable } from "../components/ReportTable";
import type { ReportColumn } from "../types/report.types";
import reportStyles, { PAGE, REPORT_METADATA } from "../styles/reportStyles";


interface SubRecetaReportProps {
  data: ModelSubDTO;
  resolveNombre?: (detalle: ModelSubDET) => string;
}

const ESTADO_LABELS: Record<string, string> = {
  true: "Activo",
  false: "Inactivo",
};

/** Convierte booleano a "Activo"/"Inactivo" para la grilla. */
function estadoLabel(value: boolean | undefined | null): string {
  if (value === undefined || value === null) return "—";
  return ESTADO_LABELS[String(value)] ?? "—";
}

/** Normaliza un número a texto pensando en campos que vienen como string. */
function asText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function resolveDetailLabel(
  detalle: ModelSubDET,
  resolveNombre?: (detalle: ModelSubDET) => string,
): string {
  const tipo = detalle.ingredienteId
    ? "Ingrediente"
    : detalle.recetaId
      ? "Receta"
      : null;

  if (!tipo) return "—";

  if (resolveNombre) {
    const nombre = resolveNombre(detalle);
    if (nombre && nombre !== "—") return `${tipo} - ${nombre}`;
  }

  const id = String(
    detalle.ingredienteId ?? detalle.recetaId,
  );
  return `${tipo} - ${id.slice(0, 8)}…`;
}

/** Ordena los pasos por número (menor primero). Los sin número van al final. */
function ordenarPasos(pasos: DetPreparacion[] | undefined): DetPreparacion[] {
  if (!pasos) return [];
  return [...pasos].sort((a, b) => {
    const na = a.nroPaso ?? Number.MAX_SAFE_INTEGER;
    const nb = b.nroPaso ?? Number.MAX_SAFE_INTEGER;
    return na - nb;
  });
}

export function SubRecetaReport({ data, resolveNombre }: SubRecetaReportProps) {
  const detalles = data.detalle ?? [];
  const pasos = ordenarPasos(data.detPreparacion);

  const infoGeneral: { label: string; value: string }[] = [
    { label: "Nombre", value: asText(data.nombre).toUpperCase() },
    { label: "Familía del Menú", value: data.familiaMenu?.nombre?.toUpperCase() ?? "—" },
    { label: "Área de preparación", value: data.areaPreparacion?.nombre?.toUpperCase() ?? "—" },
    { label: "Porciones", value: asText(data.porciones).toUpperCase() },
    { label: "Rendimiento", value: asText(data.rendimiento).toUpperCase() },
    { label: "Estado", value: estadoLabel(data.activo) },
    { label: "Descripción", value: asText(data.descripcion).toUpperCase() },
  ];

  const columns: ReportColumn<ModelSubDET>[] = [
    {
      key: "detalle",
      label: "Detalle",
      width: "60%",
      render: (d) => resolveDetailLabel(d, resolveNombre),
    },
    {
      key: "cantidad",
      label: "Cantidad",
      width: "20%",
      align: "center",
      render: (d) => asText(d.cantidad),
    },
    {
      key: "medida",
      label: "Unidad",
      width: "20%",
      align: "center",
      render: (d) => asText(d.medida),
    },
  ];

  return (
    <Document
      title={`Reporte de SubReceta - ${asText(data.nombre)}`}
      subject="Reporte de SubReceta"
      author="Asistente Chef"
      keywords="subReceta, reporte"
      producer={REPORT_METADATA.producer}
      creator={REPORT_METADATA.creator}
    >
      <Page size={PAGE.size} orientation={PAGE.orientation} style={reportStyles.page}>
        <ReportHeader
          title="Reporte de SubReceta"
          subtitle={asText(data.nombre)}
        />

        {/* Información general */}
        <ReportSection title="Información Base">
          <ReportInfoGrid items={infoGeneral} />
        </ReportSection>

        {/* Ingredientes */}
        <ReportSection title="Ingredientes - Recetas">
          <ReportTable columns={columns} data={detalles} rowKey={(d) => d.subRecetaDetId} idPrefix="det" />
        </ReportSection>

        {/* Preparación */}
        {pasos.length > 0 && (
          <ReportSection title="Métodos para la Preparación">
            {pasos.map((paso, index) => (
              <View key={paso.subPreparacionDetId || index} style={{ flexDirection: "row", marginBottom: 4 }} wrap={false}>
                <Text style={{ width: 28, color: "gray", fontSize: 9 }}>
                  {String(paso.nroPaso ?? index + 1).padStart(2, "0")}.
                </Text>
                <Text style={{ flex: 1, fontSize: 9, color: "#1F2937" }}>
                  {asText(paso.descripcion) || "—"}
                </Text>
              </View>
            ))}
          </ReportSection>
        )}
        <ReportFooter />
      </Page>
    </Document>
  );
}

export default SubRecetaReport;