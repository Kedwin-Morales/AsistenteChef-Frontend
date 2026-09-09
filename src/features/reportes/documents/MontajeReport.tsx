import { Document, Page, Text, View } from "@react-pdf/renderer";
import type { ModelDTO, ModelDET, DetPreparacion } from "@/features/montaje/types/montaje.types";
import { ReportHeader } from "../components/ReportHeader";
import { ReportFooter } from "../components/ReportFooter";
import { ReportSection } from "../components/ReportSection";
import { ReportInfoGrid } from "../components/ReportInfoGrid";
import { ReportImage } from "../components/ReportImage";
import { resolveReportImageUrl } from "../utils/imageUtils";
import { ReportTable } from "../components/ReportTable";
import type { ReportColumn } from "../types/report.types";
import reportStyles, { PAGE, REPORT_METADATA } from "../styles/reportStyles";
import { formatDateOnly } from "../utils/dateUtils";
import { useIngrediente } from "@/features/ingrediente/hooks/useIngrediente";
import { useReceta } from "@/features/receta/hooks/useReceta";
import {useSubReceta} from "@/features/subReceta/hooks/useSubReceta";
interface MontajeReportProps {
  data: ModelDTO;
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

/**
 * Resuelve una etiqueta descriptiva para cada detalle de un montaje.
 * El DTO de `detalle` solo contiene IDs (sin nombres), por lo que NO se
 * inventan nombres: se indica el tipo de referencia y el ID abreviado.
 * Se usa String() porque el backend puede devolver IDs como string o number.
 */
function resolveDetailLabel(detalle: ModelDET): string {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {  ingredientes } = useIngrediente();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { recetas } = useReceta();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { subRecetas } = useSubReceta();
  if (detalle.ingredienteId) return `Ingrediente · ${String(ingredientes.find((i) => i.ingredienteId === detalle.ingredienteId)?.nombre).slice(0, 8)}…`;
  if (detalle.recetaId) return `Receta · ${String(recetas.find((r) => r.recetaId === detalle.recetaId)?.nombre).slice(0, 8)}…`;
  if (detalle.subRecetaId) return `Sub-receta · ${String(subRecetas.find((sr) => sr.subRecetaId === detalle.subRecetaId)?.nombre).slice(0, 8)}…`;
  return "—";
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

export function MontajeReport({ data }: MontajeReportProps) {
  const fecha = data.fecha ? formatDateOnly(data.fecha) : "—";
  const detalles = data.detalle ?? [];
  const pasos = ordenarPasos(data.detPreparacion);

  const infoGeneral: { label: string; value: string }[] = [
    { label: "Nombre", value: asText(data.nombre).toUpperCase() },
    { label: "Categoría", value: data.CategoriasPlato?.nombre?.toUpperCase() ?? "—" },
    { label: "Área de preparación", value: data.areaPreparacion?.nombre?.toUpperCase() ?? "—" },
    { label: "Descripción", value: asText(data.descripcion).toUpperCase() },
    { label: "Porciones", value: asText(data.porciones).toUpperCase() },
    { label: "Fecha", value: fecha },
    { label: "Estado", value: estadoLabel(data.activo) },
  ];

  const costos: { label: string; value: string }[] = [
    { label: "Costo unidad", value: asText(data.costoUnidad) },
    { label: "Costo porción", value: asText(data.costoPorcion) },
    { label: "Precio", value: asText(data.precio) },
  ];

  const columns: ReportColumn<ModelDET>[] = [
    {
      key: "detalle",
      label: "Detalle",
      width: "38%",
      render: (d) => resolveDetailLabel(d),
    },
    {
      key: "cantidad",
      label: "Cantidad",
      width: "22%",
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
      title={`Reporte de Montaje - ${asText(data.nombre)}`}
      subject="Reporte de montaje"
      author="Asistente Chef"
      keywords="montaje, reporte"
      producer={REPORT_METADATA.producer}
      creator={REPORT_METADATA.creator}
    >
      <Page size={PAGE.size} orientation={PAGE.orientation} style={reportStyles.page}>
        <ReportHeader
          title="Reporte de Montaje"
          subtitle={asText(data.nombre)}
        />

        {/* Información general */}
        <ReportSection title="Información Base">
          <ReportInfoGrid items={infoGeneral} />
        </ReportSection>

        {/* Imagen del montaje */}
        {resolveReportImageUrl(data.urlImagen) && (
          <ReportSection title="Imagen del montaje">
            <ReportImage src={data.urlImagen} />
          </ReportSection>
        )}

        {/* Información de costos */}
        <ReportSection title="Información de costos">
          <ReportInfoGrid items={costos} />
        </ReportSection>

        {/* Ingredientes */}
        <ReportSection title="Ingredientes - recetas - sub-recetas">
          <ReportTable columns={columns} data={detalles} rowKey={(d) => d.montajeDetId} idPrefix="det" />
        </ReportSection>

        {/* Preparación */}
        {pasos.length > 0 && (
          <ReportSection title="Métodos para la Preparación">
            {pasos.map((paso, index) => (
              <View key={paso.preparacionId || index} style={{ flexDirection: "row", marginBottom: 4 }} wrap={false}>
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

export default MontajeReport;