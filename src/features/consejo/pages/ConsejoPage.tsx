import {
  PlusCircle,
  Eye,
  Pencil,
  Tags,
  WholeWord,
  Ban,
  MessagesSquare,
  SquareDashedText,
  Link2,
  CalendarArrowUp,
  CalendarArrowDown,
  MoveLeft,
  CircleCheckBig,
  MessageSquarePlus,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import SearchFilter from "@/components/ui/SearchFilter";
import DataTable, { type TableColumn } from "@/components/ui/DataTable";
import EntityModal, {
  type ModalField,
  type ModalMode,
} from "@/components/ui/EntityModal";
import { useConsejo } from "../hooks/useConsejo";
import { crear, editar } from "../services/consejo.service";
import type { ModelDTO } from "../types/consejo.types";
import { useLoginUI } from "@/features/auth/hooks/useLoginUI";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { getErrorMessage } from "@/shared/services/error.utils";
import { confirm } from "@/shared/utils/swal";
import { sileo } from "sileo";
import { useNavigate } from "react-router-dom";
import StatCard from "@/components/ui/StatCard";
import DataCardList from "@/components/ui/DataCardList";

type ModelFilter = "modulo" | "descripcion" | "nombre";

export default function ProveedorPage() {
  const { consejos, loading, refetch } = useConsejo();
  const { isDarkMode } = useLoginUI();
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState<ModelFilter>("modulo");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selected, setSelected] = useState<ModelDTO | null>(null);
  const [showActivo, setShowActivo] = useState(false);
  const navigate = useNavigate();
  
  const Modules: { nombre: string } [] = [
    { nombre: "ÁREA DE PREPARACIÓN" },
    { nombre: "CATEGORÍA DE PLATO" },
    { nombre: "FAMILIAS DEL MENÚ" },
    { nombre: "INGREDIENTES"},
    { nombre: "PROVEEDORES" },
    { nombre: "RECETAS" },
    { nombre: "SUB-RECETAS" },
    { nombre: "TIPO DE INGREDIENTE" },
    { nombre: "UNIDAD DE MEDIDA" },
  ];

  const fields: ModalField<ModelDTO>[] = [
    {
      name: "modulo",
      label: "Modulo: ",
      icon: WholeWord,
      colSpan: 6,
      required: true,
      type: "select",
      options: Modules.map((t) => ({
        label: t.nombre,
        value: t.nombre,
      })),
    },
    {
      name: "nombre",
      label: "Titulo: ",
      icon: WholeWord,
      colSpan: 6,
      required: false,
      type: "text",
    },
    {
      name: "descripcion",
      label: "Descripcion: ",
      icon: SquareDashedText,
      colSpan: 6,
      required: false,
      type: "textarea",
    },
    // {
    //   name: "dificultad",
    //   label: "Dificultad: ",
    //   icon: Shapes,
    //   colSpan: 3,
    //   required: false,
    //   type: "text",
    // },
    {
      name: "valor",
      label: "Url: ",
      icon: Link2,
      colSpan: 6,
      required: false,
      type: "text",
    },
    {
      name: "fechaDesde",
      label: "Fecha Desde: ",
      icon: CalendarArrowUp,
      colSpan: 3,
      required: false,
      type: "date",
    },
    {
      name: "fechaHasta",
      label: "Fecha Hasta: ",
      icon: CalendarArrowDown,
      colSpan: 3,
      required: false,
      type: "date",
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

  const handleSubmit = async (data: Partial<ModelDTO>) => {
    if (!data.modulo) {
      return sileo.warning({
        title: "¡Atención!",
        description:
          "Por favor, revisa los datos ingresados: Modulo y Descripcion son obligatorios.",
      });
    }

    try {
      if (modalMode === "create") {
        await crear({
          modulo: data.modulo,
          nombre: data.nombre ?? "",
          descripcion: data.descripcion ?? "",
          dificultad: data.dificultad ?? "",
          valor: data.valor ?? "",
          fechaDesde: data.fechaDesde ?? null,
          fechaHasta: data.fechaHasta ?? null,
        });
        sileo.success({
          title: "¡Operación exitosa!",
          description: "El registro se guardó correctamente.",
        });
      }

      if (modalMode === "edit" && selected?.consejoId) {
        await editar(selected.consejoId, {
          consejoId: "",
          modulo: data.modulo,
          nombre: data.nombre ?? "",
          descripcion: data.descripcion ?? "",
          dificultad: data.dificultad ?? "",
          valor: data.valor ?? "",
          fechaDesde: data.fechaDesde ?? null,
          fechaHasta: data.fechaHasta ?? null,
          activo: data.activo ?? true,
        });

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

  const confirmarDelete = async (item: ModelDTO) => {
  const result = await confirm({
      title: `${item.activo ? 'Anular' : 'Activar'}`,
      text: `¿Desea ${item.activo ? 'activar' : 'anular'}: ${item.modulo}?`,
      icon: "question",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      isDarkMode,
    });

    if (result.isConfirmed) {
      try {
        item.activo = !item.activo;
        await editar(item.consejoId, {
          consejoId: item.consejoId,
          modulo: item.modulo,
          nombre: item.nombre ?? "",
          descripcion: item.descripcion ?? "",
          dificultad: item.dificultad ?? "",
          valor: item.valor ?? "",
          fechaDesde: item.fechaDesde ?? null,
          fechaHasta: item.fechaHasta ?? null,
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

  const esActive = (a: ModelDTO) => a.activo === false;

  const filtered = consejos
    .filter((a) => (showActivo ? esActive(a) : !esActive(a)))
    .filter((u) =>
      `${u.modulo} ${u.descripcion} ${u.nombre}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );

  const columns: TableColumn<ModelDTO>[] = [
    {
      key: "modulo",
      header: "Modulo",
      render: (row) => <span className="font-semibold">{row.modulo}</span>,
    },
    {
      key: "descripcion",
      header: "Descripcion",
      render: (row) => <span className="font-semibold">{row.descripcion}</span>,
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
            <MessagesSquare size={30} />
            Consejos
          </h1>
          <p className="text-sm ml-15 text-neutral-500">
            Gestión de consejos para cada modulo del sistema.
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
          title="Consejos Activos"
          icon={MessagesSquare}
          value={consejos.filter((a) => a.activo).length}
          footerIcon={TrendingUp}
          footerText="Elementos más usados."
          trend="positive"
          delay={100}
        />
        <StatCard
          title="Total Consejos"
          icon={MessagesSquare}
          value={consejos.length}
          footerIcon={TrendingUp}
          footerText="Control total."
          trend="positive"
          delay={200}
        />
      </div>

      <SearchFilter<ModelFilter>
        filterValue={filterBy}
        searchValue={search}
        placeholder="Buscar..."
        options={[
          { value: "modulo", label: "Modulo" },
          { value: "descripcion", label: "Descripcion" },
          { value: "nombre", label: "nombre" },
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
          rowKey={(row) => row?.consejoId}
          emptyMessage="No se encontraron resultados."
          isDarkMode={isDarkMode}
        />
      </div>
      
      {/* ================= MOBILE ================= */}
      <div className="block md:hidden">
        <DataCardList<ModelDTO>
          data={filtered}
          getKey={(row) =>
            row.consejoId
              ? row.consejoId.toString()
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

      <EntityModal<ModelDTO>
        open={modalOpen}
        key={`${modalMode}-${selected?.consejoId ?? "new"}`}
        title={
          modalMode === "create"
            ? "Crear"
            : modalMode === "edit"
              ? "Editar"
              : "Detalles"
        }
        headerIcon={MessageSquarePlus}
        mode={modalMode}
        data={selected ? { ...selected } : null}
        fields={fields}
        isDarkMode={isDarkMode}
        onClose={() => {
          setModalOpen(false);
          setSelected(null);
        }}
        onSubmit={handleSubmit}
      />
    </AppLayout>
  );
}
