import {
  PlusCircle,
  Eye,
  Pencil,
  Hash,
  WholeWord,
  Ban,
  SquareDashedText,
  LandPlot,
  UtensilsCrossed,
  MoveLeft,
  CircleCheckBig,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import SearchFilter from "@/components/ui/SearchFilter";
import DataTable, { type TableColumn } from "@/components/ui/DataTable";
import EntityModal, {
  type ModalField,
  type ModalMode,
  type ModalDetailField,
} from "@/components/ui/EntityModal";
import { useAreaPreparacion } from "../hooks/useAreaPreparacion";
import { crear, editar } from "../services/areaPreparacion.service";
import type { ModelDETCreate, ModelDTO } from "../types/areaPreparacion.types";
import { useLoginUI } from "@/features/auth/hooks/useLoginUI";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { getErrorMessage } from "@/shared/services/error.utils";
import { confirm } from "@/shared/utils/swal";
import { sileo } from "sileo";
import { useIngrediente } from "@/features/ingrediente/hooks/useIngrediente";
import { useNavigate } from "react-router-dom";
import { useConsejo } from "@/features/consejo/hooks/useConsejo"
import StatCard from "@/components/ui/StatCard";
import TipCard from "@/components/ui/TipCard";
import DataCardList from "@/components/ui/DataCardList";

type ModelFilter = "nombre" | "descripcion";

export default function AreaPreparacionPage() {
  const { areas, loading, refetch } = useAreaPreparacion();
  const { ingredientes } = useIngrediente();
  const { isDarkMode } = useLoginUI();
  const navigate = useNavigate();
  const { consejos } = useConsejo();
  const consejo = consejos.filter((a)=> a.modulo === "ÁREA DE PREPARACIÓN".toUpperCase() && a.activo );

  /* FILTER */
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState<ModelFilter>("nombre");
  const [showActivo, setShowActivo] = useState(false);
  const filterIngredientes = ingredientes.filter(
    (t) => t.activo && t.tipoIngrediente?.nombre.toUpperCase() === "UTENSILIOS",
  );

  /* MODAL */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selected, setSelected] = useState<ModelDTO | null>(null);

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

  /* MODAL FIELDS */
  const fields: ModalField<ModelDTO>[] = [
    {
      name: "nombre",
      label: "Nombre: ",
      icon: WholeWord,
      colSpan: 6,
      required: true,
      type: "text",
    },
    {
      name: "descripcion",
      label: "Descripción: ",
      icon: SquareDashedText,
      colSpan: 6,
      type: "textarea",
    },
    ...(modalMode === "edit"
      ? [
          {
            name: "activo" as keyof ModelDTO,
            label: "Activo: ",
            icon: Eye as typeof Eye,
            colSpan: 6 as const,
            type: "boolean" as const,
          },
        ]
      : []),
  ];

  const detalleFields: ModalDetailField<ModelDETCreate>[] = [
    {
      name: "ingredienteId",
      label: "Utensilio: ",
      icon: UtensilsCrossed,
      colSpan: 4,
      required: true,
      type: "autocomplete",
      options: filterIngredientes.map((i) => ({
        value: i.ingredienteId,
        label: i.nombre ?? "",
      })),
    },
    {
      name: "cantidad",
      label: "Cantidad: ",
      type: "number",
      colSpan: 2,
      icon: Hash,
      required: true,
    },
  ];

  const areaDetailColumns = [
    { key: "ingredienteId", label: "Utensilios: " },
    { key: "cantidad", label: "Cantidad: " },
  ];

  /* CREATE / EDIT */
  const handleSubmit = async (data: Partial<ModelDTO>) => {
    if (!data.nombre) {
      return sileo.warning({
        title: "¡Atención!",
        description:
          "Por favor, revisa los datos ingresados: Nombre es obligatorio.",
      });
    }

    const dto = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      detalle: data.detalle,
    };

    try {
      if (modalMode === "create") {
        await crear(dto);
        sileo.success({
          title: "¡Operación exitosa!",
          description: "El registro se guardó correctamente.",
        });
      }

      if (modalMode === "edit" && selected?.areaPreparacionId) {
        const dtoUpdate = {
          areaPreparacionId: selected.areaPreparacionId,
          nombre: data.nombre,
          descripcion: data.descripcion,
          detalle: data.detalle,
        };

        await editar(selected.areaPreparacionId, dtoUpdate);
        sileo.success({
          title: "¡Operación exitosa!",
          description: "Cambios guardados con éxito.",
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

  /* Anular */
  const confirmarDelete = async (item: ModelDTO) => {
    const result = await confirm({
      title: `${item.activo ? 'Anular' : 'Activar'}`,
      text: `¿Desea ${item.activo ? 'Anular' : 'Activar'}: ${item.nombre}?`,
      icon: "question",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      isDarkMode,
    });
    if (result.isConfirmed) {
      try {
        item.activo = !item.activo;
        await editar(item.areaPreparacionId, {
          areaPreparacionId: item.areaPreparacionId,
          nombre: item.nombre,
          descripcion: item.descripcion ?? "",
          activo: item.activo,
        });             
        sileo.success({
          title: "¡Operación exitosa!",
          description: `El registro se ${item.activo ? 'activo' : 'anuló'} correctamente.`,
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

  /* FILTER DATA */
  const esActive = (a: ModelDTO) => a.activo === false;

  const filtered = areas
    .filter((a) => (showActivo ? esActive(a) : !esActive(a)))
    .filter((u) =>
      `${u.nombre} ${u.descripcion}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );

  /* TABLE */
  const columns: TableColumn<ModelDTO>[] = [
    {
      key: "nombre",
      header: "Nombre",
      align: "center",
      render: (row) => <span className="font-semibold">{row.nombre}</span>,
    },
    {
      key: "descripcion",
      header: "Descripción",
      render: (row) => <span>{row.descripcion}</span>,
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
          {row.activo ? 
            <button
              onClick={() => {
                setSelected(row);
                setModalMode("edit");
                setModalOpen(true);
              }}
              className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg"
            >
              <Pencil size={16} />
            </button> : <></> 
          }          
          <button
            onClick={() =>              
              confirmarDelete(row)}
            className={`p-2 ${row.activo ? 'text-red-500 hover:bg-red-100' : 'text-emerald-600 hover:bg-emerald-100'} rounded-lg`}
            data-bs-toggle="tooltip"
            title={`${row.activo ? 'Anular' : 'Activar'}`}
          >
            {row.activo ? <Ban size={16} /> : <CircleCheckBig size={16} />}            
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <AppLayout>
        <LoadingScreen message="Cargando..." isDarkMode={isDarkMode} />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* HEADER */}
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-(--primary)">
            <button
              type="button"
              onClick={() => {navigate("/maestro");}}
              className={`flex items-center mr-5 text-sm hover:text-(--texto)
                ${isDarkMode ? "text-(--primary)" : "text-(--secondary)"}`}
              data-bs-toggle="tooltip"
              title="Volver"
             >
              <MoveLeft size={30} />
            </button>
            <LandPlot size={30} />
            Áreas de Preparación
          </h1>
          <p className="text-sm ml-15 text-neutral-500">
            Gestión para las Áreas de Preparación del sistema
          </p>
        </div>
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

      {/* StatCard y TipCard */}
      <div className="my-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Áreas Activas"
          icon={LandPlot}
          value={areas.filter((a) => a.activo).length}
          footerIcon={TrendingUp}
          footerText="Elementos más usados."
          trend="positive"
          delay={100}
        />
        <StatCard
          title="Total Áreas"
          icon={LandPlot}
          value={areas.length}
          footerIcon={TrendingUp}
          footerText="Control total."
          trend="positive"
          delay={200}
        />
        {consejo.map((c) => (
          <TipCard
            key={c.nombre}
            title={`${c.nombre ? c.nombre : "Optimización de Áreas" } `} 
            icon={Lightbulb}
            description={`${c.descripcion ? c.descripcion : "Agrupa utensilios por frecuencia de uso para reducir tiempos de desplazamiento en la línea de preparación." } `}  
            linkText="Ver más"
            href={c.valor}
            delay={400}
            fecha={c.fechaDesde ? `${formatearFecha(c.fechaDesde.toString())}${c.fechaHasta ? ` al ${formatearFecha(c.fechaHasta.toString())}` : ""}` : ""}
          />
        ))}
      </div>

      {/* SEARCH */}
      <SearchFilter<ModelFilter>
        filterValue={filterBy}
        searchValue={search}
        placeholder="Buscar..."
        options={[
          { value: "nombre", label: "Nombre" },
          { value: "descripcion", label: "Descripción" },
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
          rowKey={(row) => row?.areaPreparacionId}
          emptyMessage="No se encontraron resultados."
          isDarkMode={isDarkMode}
        />
      </div>

      {/* ================= MOBILE ================= */}
      <div className="block md:hidden">
        <DataCardList<ModelDTO>
          data={filtered}
          getKey={(row) =>
            row.areaPreparacionId
              ? row.areaPreparacionId.toString()
              : ""
          }
          title={(row) => row.nombre}
          badges={(row) => [
            {
              label: row.activo ? "Activo" : "Inactivo",
              variant: row.activo
                ? "success"
                : "danger",
            },
          ]}
          renderExtra={(row) => (
            <div className="">
              {row.descripcion}
            </div>
          )}
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

      {/* MODAL */}
      <EntityModal<ModelDTO>
        open={modalOpen}
        key={`${modalMode}-${selected?.areaPreparacionId ?? "new"}`}
        title={
          modalMode === "create"
            ? "Crear"
            : modalMode === "edit"
              ? "Editar"
              : "Detalles"
        }
        headerIcon={LandPlot}
        mode={modalMode}
        data={selected}
        fields={fields}
        isDarkMode={isDarkMode}
        onClose={() => {
          setModalOpen(false);
          setSelected(null);
        }}
        onSubmit={handleSubmit}
        detailKey="detalle"
        detailFields={detalleFields}
        detailColumns={areaDetailColumns}
        mergeDetailBy="ingredienteId"
        accumulateField="cantidad"
      />
    </AppLayout>
  );
}
