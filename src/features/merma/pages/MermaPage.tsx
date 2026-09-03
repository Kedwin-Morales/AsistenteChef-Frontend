import {
  PlusCircle,
  Eye,
  Pencil,
  Tags,
  WholeWord,
  Ban,
  Hash,
  RulerDimensionLine,
  CircleCheckBig,
  TrendingUp,
  Lightbulb,
  CalendarDays,
  ReceiptText,
  LandPlot,
  Scale,
  Layers,
} from "lucide-react";
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import SearchFilter from "@/components/ui/SearchFilter";
import DataTable, { type TableColumn } from "@/components/ui/DataTable";
import EntityModal, {
  type ModalField,
  type ModalMode,
} from "@/components/ui/EntityModal";
import { useMerma } from "../hooks/useMerma";
import { crear, editar } from "../services/merma.service";
import type { ModelDTO } from "../types/merma.types";
import { useLoginUI } from "@/features/auth/hooks/useLoginUI";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { getErrorMessage } from "@/shared/services/error.utils";
import { confirm } from "@/shared/utils/swal";
import { sileo } from "sileo"; 
import { useConsejo } from "@/features/consejo/hooks/useConsejo";
import StatCard from "@/components/ui/StatCard";
import TipCard from "@/components/ui/TipCard";
import DataCardList from "@/components/ui/DataCardList";
import { useAreaPreparacion } from "@/features/areaPreparacion/hooks/useAreaPreparacion";
import { useUnidad } from "@/features/unidadMedida/hooks/useUnidad";
import { useReceta } from "@/features/receta/hooks/useReceta";
import {useSubReceta} from "@/features/subReceta/hooks/useSubReceta";
import { IoReceiptOutline } from "react-icons/io5";

type ModelFilter = "fecha" | "receta" | "subReceta" | "areaPreparacion";
type MermaFormData = Partial<ModelDTO> & {
  recetaId?: string;
  subRecetaId?: string;
  areaPreparacionId?: string;
  unidadMedidaId?: string;
};


export default function MermaPage() {
  const { mermas, loading, refetch } = useMerma();
  const { isDarkMode } = useLoginUI();
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState<ModelFilter>("fecha");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selected, setSelected] = useState<ModelDTO | null>(null);
  const [showActivo, setShowActivo] = useState(false);
  const { consejos } = useConsejo();
  const { recetas, loading: loadingRecetas } = useReceta();
  const { subRecetas, loading: loadingSubRecetas } = useSubReceta();
  const { areas, loading: loadingAreas } = useAreaPreparacion();
  const { unidades, loading: loadingUnidades } = useUnidad();
  const consejo = consejos.filter((a) => a.modulo.toUpperCase() === "mermas".toUpperCase() && a.activo);
  const areaActivos = areas.filter((i) => i.activo);
  const subRecetasActivos = subRecetas.filter((i) => i.activo);
  const recetasActivos = recetas.filter((i) => i.activo);
  const unidadesActivas = unidades.filter((i) => i.activo);

  // Función auxiliar para darle formato a la fecha en español
  const formatearFecha = (fechaString: string) => {
    if (!fechaString) return "";

    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const fields: ModalField<MermaFormData>[] = [
    {
      name: "recetaId",
      label: "Receta: ",
      icon: ReceiptText,
      colSpan: 6,
      required: true,
      type: "select",
      options: recetasActivos.map((t) => ({
        label: t.nombre,
        value: t.recetaId,
      })),
    },
    {
      name: "subRecetaId",
      label: "Sub-Receta: ",
      icon: ReceiptText,
      colSpan: 6,
      required: false,
      type: "select",
      options: subRecetasActivos.map((t) => ({
        label: t.nombre,
        value: t.subRecetaId,
      })),
    },
    {
      name: "fecha",
      label: "Fecha Registro: ",
      icon: CalendarDays,
      colSpan: 3,
      required: false,
      type: "date",
    },
    {
      name: "areaPreparacionId",
      label: "Área de Preparación: ",
      icon: LandPlot,
      colSpan: 3,
      required: false,
      type: "select",
      options: areaActivos.map((t) => ({
        label: t.nombre,
        value: t.areaPreparacionId,
      })),
    },
    {
        name: "cantidad",
        label: "Cantidad: ",
        icon: Hash,
        colSpan: 3,
        required: false,
        type: "number",
    },
    {
      name: "unidadMedidaId",
      label: "Unidad de Medidad: ",
      icon: RulerDimensionLine,
      colSpan: 3,
      required: true,
      type: "select",
      options: unidadesActivas.map((t) => ({
        label: t.nombre,
        value: t.unidadMedidaId,
      })),
    },
    {
      name: "motivo",
      label: "Motivo: ",
      icon: WholeWord,
      colSpan: 6,
      required: true,
      type: "textarea",
    },
    ...(modalMode === "edit"
      ? [
          {
            name: "activo" as keyof ModelDTO,
            label: "Activo: ",
            icon: Tags as typeof Tags,
            colSpan: 6 as const,
            type: "boolean" as const,
          },
        ]
      : []),
  ];

  const cleanOptionalString = (val?: string | number) => {
    if (val === undefined || val === null) return undefined;
    const str = String(val).trim();
    return str !== "" ? str : undefined;
  };

  const handleSubmit = async (data: MermaFormData) => {
    if (!data.fecha || (!data.recetaId && !data.subRecetaId)) {
      return sileo.warning({
        title: "¡Atención!",
        description:
          "Por favor, revisa los datos ingresados: Fecha y Receta o Subreceta son obligatorios.",
      });
    }

    try {
      if (modalMode === "create") {
        await crear({
          motivo: data.motivo ?? "",
          cantidad: data.cantidad ? Number(data.cantidad) : undefined,
          urlImagen: data.urlImagen ?? "",
          fecha: data.fecha,
          recetaId: cleanOptionalString(data.recetaId),
          subRecetaId: cleanOptionalString(data.subRecetaId),
          areaPreparacionId: cleanOptionalString(data.areaPreparacionId),
          unidadMedidaId: cleanOptionalString(data.unidadMedidaId),
        });
        sileo.success({
          title: "¡Operación exitosa!",
          description: "El registro se guardó correctamente.",
        });
      }

      if (modalMode === "edit" && selected?.mermaId) {
        await editar(selected.mermaId, {
          motivo: data.motivo ?? "",
          cantidad: data.cantidad ? Number(data.cantidad) : undefined,
          urlImagen: data.urlImagen ?? "",
          fecha: data.fecha,
          recetaId: cleanOptionalString(data.recetaId),
          subRecetaId: cleanOptionalString(data.subRecetaId),
          areaPreparacionId: cleanOptionalString(data.areaPreparacionId),
          unidadMedidaId: cleanOptionalString(data.unidadMedidaId),
        });
        sileo.success({
          title: "¡Operación exitosa!",
          description: "Cambios guardados correctamente.",
        });
      }

      setModalOpen(false);
      setSelected(null);
      await refetch();
    } catch (error) {
      sileo.error({
        title: "Error de sistema",
        description: getErrorMessage(
          error,
          "No se pudo procesar la solicitud: Error al guardar.",
        ),
      });
    }
  };

  const confirmarDelete = async (item: ModelDTO) => {
    const result = await confirm({
      title: `${item.activo ? "Anular" : "Activar"}`,
      text: `¿Desea ${item.activo ? "Anular" : "Activar"}: ${item.fecha}?`,
      icon: "question",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      isDarkMode,
    });

    if (result.isConfirmed) {
      try {
        item.activo = !item.activo;
        await editar(item.mermaId, {
          motivo: item.motivo ?? "",
          cantidad: item.cantidad ? Number(item.cantidad) : undefined,
          urlImagen: item.urlImagen ?? "",
          fecha: item.fecha,
          recetaId: cleanOptionalString(item.recetaId),
          subRecetaId: cleanOptionalString(item.subRecetaId),
          areaPreparacionId: cleanOptionalString(item.areaPreparacionId),
          unidadMedidaId: cleanOptionalString(item.unidadMedidaId),
          activo: item.activo,
        });
        sileo.success({
          title: "¡Operación exitosa!",
          description: `El registro se ${item.activo ? "activo" : "anuló"} correctamente.`,
        });
        await refetch();
      } catch (error) {
        sileo.error({
          title: "Error de sistema",
          description: getErrorMessage(
            error,
            "No se pudo procesar la solicitud: Error al anular.",
          ),
        });
      }
    }
  };

  const esActive = (a: ModelDTO) => a.activo === false;

  const filtered = mermas
    .filter((a) => (showActivo ? esActive(a) : !esActive(a)))
    .filter((u) =>
      `${u.fecha} ${u.receta?.nombre} ${u.subReceta?.nombre} ${u.areaPreparacion?.nombre}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );

  const columns: TableColumn<ModelDTO>[] = [
    {
      key: "Receta",
      header: "Receta / Subreceta",
      render: (row) => {
        if (row.subReceta) {
          return (
            <>
              <span className="mr-2 font-semibold">
                {row.subReceta.nombre ?? "—"}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs     font-medium ${
                  isDarkMode
                    ? "bg-purple-900/30 text-purple-300 border border-purple-700/50"
                    : "bg-purple-100 text-purple-800 border border-purple-200"
                }`}
              >
                <ReceiptText size={12} /> SubReceta
              </span>
            </>
          );
        }
      
        return (
          <>
            <span className="mr-2 font-semibold">
              {row.receta?.nombre ?? "—"}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs     font-medium ${
                isDarkMode
                  ? "bg-blue-900/30 text-blue-300 border border-blue-700/50"
                  : "bg-blue-100 text-blue-800 border border-blue-200"
              }`}
            >
              <IoReceiptOutline size={12} /> Receta
            </span>
          </>
        );
      },
    },
    {
      key: "Cantidad",
      header: "Cantidad",
      render: (row) => <span>{row.cantidad}</span>,
    },
    {
      key: "Fecha",
      header: "Fecha Registro",
      render: (row) => <span>{formatearFecha(row.fecha.toString())}</span>,
    },
    {
      key: "AreaPreparacion",
      header: "Área de Preparación",
      render: (row) => (
        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
          {row.areaPreparacion?.nombre ?? "—"}
        </span>
      ),
    },
    {
      key: "activo",
      header: "Estado",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold ${row.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}
        >
          {row.activo ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      key: "acciones",
      header: "Acciones",
      align: "center",
      render: (row) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => {
              setSelected(row);
              setModalMode("view");
              setModalOpen(true);
            }}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
          >
            <Eye size={16} />
          </button>
          {row.activo ? (
            <button
              onClick={() => {
                setSelected(row);
                setModalMode("edit");
                setModalOpen(true);
              }}
              className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg"
            >
              <Pencil size={16} />
            </button>
          ) : (
            <></>
          )}
          <button
            onClick={() => confirmarDelete(row)}
            className={`p-2 ${row.activo ? "text-red-500 hover:bg-red-100" : "text-emerald-600 hover:bg-emerald-100"} rounded-lg`}
            data-bs-toggle="tooltip"
            title={`${row.activo ? "Anular" : "Activar"}`}
          >
            {row.activo ? <Ban size={16} /> : <CircleCheckBig size={16} />}
          </button>
        </div>
      ),
    },
  ];

  if (loading || loadingRecetas || loadingSubRecetas || loadingAreas || loadingUnidades) {
    return (
      <AppLayout>
        <LoadingScreen
          fullScreen
          isDarkMode={isDarkMode}
          message="Cargando..."
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-(--primary)">
            <Scale size={30} />
            Mermas
          </h1>
          <p className="text-sm text-neutral-500">
            Gestión para Mermas de Recetas y Sub-Recetas.
          </p>
        </div>

        <div className="hidden md:flex gap-3">
          <button
            onClick={() => {
              setSelected(null);
              setModalMode("create");
              setModalOpen(true);
            }}
            className="bg-gradient btn-gradient shadow-xl-secondary"
          >
            <PlusCircle size={18} /> Nuevo
          </button>
        </div>
      </div>

      {/* StatCard y TipCard */}
      <div className="my-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Mermas Activas"
          icon={Scale}
          value={mermas.filter((a) => a.activo).length}
          footerIcon={TrendingUp}
          footerText="Elementos más usados."
          trend="positive"
          delay={100}
        />
        <StatCard
          title="Total Mermas"
          icon={Scale}
          value={mermas.length}
          footerIcon={TrendingUp}
          footerText="Control total."
          trend="positive"
          delay={200}
        />
        {consejo.map((c) => (
          <TipCard
            key={c.nombre}
            title={`${c.nombre ? c.nombre : "Regla de Oro"} `}
            icon={Lightbulb}
            description={`${c.descripcion ? c.descripcion : "Una cocina profesional no improvisa: organiza, estandariza y limpia sobre la marcha."} `}
            linkText="Ver más"
            href={c.valor}
            delay={400}
            fecha={
              c.fechaDesde
                ? `${formatearFecha(c.fechaDesde.toString())}${c.fechaHasta ? ` al ${formatearFecha(c.fechaHasta.toString())}` : ""}`
                : ""
            }
          />
        ))}
      </div>

      <SearchFilter<ModelFilter>
        filterValue={filterBy}
        searchValue={search}
        placeholder="Buscar..."
        options={[
          { value: "fecha", label: "Fecha" },
          { value: "receta", label: "Receta" },
          { value: "subReceta", label: "Sub-Receta" },
          { value: "areaPreparacion", label: "Área de Preparación" },
        ]}
        onFilterChange={setFilterBy}
        onSearchChange={setSearch}
        isDarkMode={isDarkMode}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 mb-3">
          <button
            type="button"
            onClick={() => setShowActivo((v) => !v)}
            className={`
            relative w-11 h-6 rounded-full transition-colors
            ${showActivo ? "bg-(--secondary)" : "bg-neutral-500/50"}
        `}
          >
            <span
              className={`
                absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white
                transition-transform
                ${showActivo ? "translate-x-5" : ""}
            `}
            />
          </button>

          <span
            className={`
            text-sm select-none transition-colors
            ${isDarkMode ? "text-(--texto)" : "text-(--texto)"}
            ${showActivo ? "text-(--texto) font-medium" : "text-neutral-500"}
        `}
          >
            Ver anulados
          </span>
        </div>
      </div>
      
      <div className="hidden md:block">
        <DataTable<ModelDTO>
          data={filtered}
          columns={columns}
          rowKey={(row) => row?.mermaId}
          emptyMessage="No se encontraron resultados."
          isDarkMode={isDarkMode}
        />
      </div>

      {/* ================= MOBILE ================= */}
      <div className="block md:hidden">
        <DataCardList<ModelDTO>
          data={filtered}
          getKey={(row) =>
            row.mermaId ? row.mermaId.toString() : ""
          }
          title={(row) => row.receta?.nombre ?? row.subReceta?.nombre ?? "—"}
          badges={(row) => [
            {
              label: row.receta ? "Receta" : "Sub-Receta",
              variant: row.receta ? "info" : "accent",
            },
            {
              label: row.activo ? "Activo" : "Inactivo",
              variant: row.activo ? "success" : "danger",
            },
          ]}
          renderExtra={(row) => <div className="">{row.motivo}</div>}
          onView={(row) => {
            setSelected(row);
            setModalMode("view");
            setModalOpen(true);
          }}
          onEdit={(row) => {
            setSelected(row);
            setModalMode("edit");
            setModalOpen(true);
          }}
          onDelete={(row) => {
            confirmarDelete(row);
          }}
          emptyMessage="No se encontraron resultados."
          isDarkMode={isDarkMode}
        />
      </div>

      <EntityModal<MermaFormData>
        open={modalOpen}
        key={`${modalMode}-${selected?.mermaId ?? "new"}`}
        title={
          modalMode === "create"
            ? "Crear"
            : modalMode === "edit"
              ? "Editar"
              : "Detalles"
        }
        headerIcon={Scale}
        mode={modalMode}
        data={
          selected
            ? {
                ...selected,
                recetaId: selected.receta?.recetaId ?? undefined,
                unidadMedidaId: selected.unidadMedida?.unidadMedidaId ?? undefined,
                subRecetaId: selected.subReceta?.subRecetaId ?? undefined,
                areaPreparacionId: selected.areaPreparacion?.areaPreparacionId ?? undefined,
              }
            : null
        }
        fields={fields}
        isDarkMode={isDarkMode}
        entitySelectorConfig={{
          defaultValue: "receta",
          options: [
            {
              value: "receta",
              label: "Receta",
              icon: ReceiptText,
              fieldName: "recetaId",
            },
            {
              value: "subReceta",
              label: "Sub-Receta",
              icon: Layers,
              fieldName: "subRecetaId",
            },
          ],
        }}
        onClose={() => {
          setModalOpen(false);
          setSelected(null);
        }}
        onSubmit={handleSubmit}
      />
    </AppLayout>
  );
}
