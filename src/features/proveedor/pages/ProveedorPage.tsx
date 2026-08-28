import {
  PlusCircle,
  Eye,
  Pencil,
  Tags,
  WholeWord,
  Ban,
  IdCard,
  Truck,
  UserPlus2,
  Phone,
  AtSign,
  MapPinned,
  FileType,
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
} from "@/components/ui/EntityModal";
import { useProveedor } from "../hooks/useProveedor";
import { crear, editar } from "../services/proveedor.service";
import type { ModelDTO } from "../types/proveedor.types";
import { useLoginUI } from "@/features/auth/hooks/useLoginUI";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { getErrorMessage } from "@/shared/services/error.utils";
import { confirm } from "@/shared/utils/swal";
import { sileo } from "sileo";
import { useNavigate } from "react-router-dom";
import { useConsejo } from "@/features/consejo/hooks/useConsejo"
import StatCard from "@/components/ui/StatCard";
import TipCard from "@/components/ui/TipCard";
import DataCardList from "@/components/ui/DataCardList";

type ModelFilter = "razonSocial" | "ruc" | "tipo";

export default function ProveedorPage() {
  const { proveedores, loading, refetch } = useProveedor();
  const { isDarkMode } = useLoginUI();
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState<ModelFilter>("razonSocial");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selected, setSelected] = useState<ModelDTO | null>(null);
  const [showActivo, setShowActivo] = useState(false);
  const navigate = useNavigate();
  const { consejos } = useConsejo();
  const consejo = consejos.filter((a)=> a.modulo === "proveedores".toUpperCase() && a.activo );
  
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

  const fields: ModalField<ModelDTO>[] = [
    {
      name: "ruc",
      label: "RIF: ",
      icon: IdCard,
      colSpan: 3,
      required: true,
      type: "text",
    },
    {
      name: "razonSocial",
      label: "Razón Social: ",
      icon: WholeWord,
      colSpan: 3,
      required: true,
      type: "text",
    },
    {
      name: "telefono",
      label: "Teléfono: ",
      icon: Phone,
      colSpan: 3,
      required: false,
      type: "text",
    },
    {
      name: "email",
      label: "Correo: ",
      icon: AtSign,
      colSpan: 3,
      required: false,
      type: "text",
    },
    {
      name: "direccion",
      label: "Dirección: ",
      icon: MapPinned,
      colSpan: 3,
      required: false,
      type: "text",
    },
    {
      name: "tipo",
      label: "Tipo: ",
      icon: FileType,
      colSpan: 3,
      required: false,
      type: "text",
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
    if (!data.ruc || !data.razonSocial) {
      return sileo.warning({
        title: "¡Atención!",
        description:
          "Por favor, revisa los datos ingresados: RIF y Razon Social son obligatorios.",
      });
    }

    try {
      if (modalMode === "create") {
        await crear({
          ruc: data.ruc,
          razonSocial: data.razonSocial,
          telefono: data.telefono ?? "",
          email: data.email ?? "",
          direccion: data.direccion ?? "",
          tipo: data.tipo ?? "",
        });
        sileo.success({
          title: "¡Operación exitosa!",
          description: "El registro se guardó correctamente.",
        });
      }

      if (modalMode === "edit" && selected?.proveedorId) {
        await editar(selected.proveedorId, {
          proveedorId: "",
          ruc: data.ruc,
          razonSocial: data.razonSocial,
          telefono: data.telefono ?? "",
          email: data.email ?? "",
          direccion: data.direccion ?? "",
          tipo: data.tipo ?? "",
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
      text: `¿Desea ${item.activo ? 'anular' : 'activar'}: ${item.razonSocial}?`,
      icon: "question",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      isDarkMode,
    });

    if (result.isConfirmed) {
      try {
        item.activo = !item.activo;
        await editar(item.proveedorId, {
          proveedorId: item.proveedorId,
          ruc: item.ruc,
          razonSocial: item.razonSocial,
          telefono: item.telefono ?? "",
          email: item.email ?? "",
          direccion: item.direccion ?? "",
          tipo: item.tipo ?? "",
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

  const filtered = proveedores
    .filter((a) => (showActivo ? esActive(a) : !esActive(a)))
    .filter((u) =>
      `${u.razonSocial} ${u.ruc} ${u.tipo}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );

  const columns: TableColumn<ModelDTO>[] = [
    {
      key: "razonSocial",
      header: "Razón Social",
      render: (row) => <span className="font-semibold">{row.razonSocial}</span>,
    },
    {
      key: "ruc",
      header: "RIF",
      render: (row) => <span className="font-semibold">{row.ruc}</span>,
    },
    {
      key: "tipo",
      header: "Tipo",
      render: (row) => <span>{row.tipo}</span>,
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
            <Truck size={30} />
            Proveedores
          </h1>
          <p className="text-sm ml-15 text-neutral-500">
            Gestión de proveedores del sistema.
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
          title="Proveedores Activos"
          icon={Truck}
          value={proveedores.filter((a) => a.activo).length}
          footerIcon={TrendingUp}
          footerText="Elementos más usados."
          trend="positive"
          delay={100}
        />
        <StatCard
          title="Total Proveedores"
          icon={Truck}
          value={proveedores.length}
          footerIcon={TrendingUp}
          footerText="Control total."
          trend="positive"
          delay={200}
        />
        {consejo.map((c) => (
          <TipCard
            key={c.nombre}
            title={`${c.nombre ? c.nombre : "Regla de Oro" } `} 
            icon={Lightbulb}
            description={`${c.descripcion ? c.descripcion : "Una cocina profesional no improvisa: organiza, estandariza y limpia sobre la marcha." } `}  
            linkText="Ver más"
            href={c.valor}
            delay={400}
            fecha={c.fechaDesde ? `${formatearFecha(c.fechaDesde.toString())}${c.fechaHasta ? ` al ${formatearFecha(c.fechaHasta.toString())}` : ""}` : ""}
          />
        ))}
      </div>

      <SearchFilter<ModelFilter>
        filterValue={filterBy}
        searchValue={search}
        placeholder="Buscar..."
        options={[
          { value: "razonSocial", label: "Razón Social" },
          { value: "ruc", label: "RIF" },
          { value: "tipo", label: "Tipo" },
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
          rowKey={(row) => row?.proveedorId}
          emptyMessage="No se encontraron resultados."
          isDarkMode={isDarkMode}
        />
      </div>
      
      {/* ================= MOBILE ================= */}
      <div className="block md:hidden">
        <DataCardList<ModelDTO>
          data={filtered}
          getKey={(row) =>
            row.proveedorId
              ? row.proveedorId.toString()
              : ""
          }
          title={(row) => row.razonSocial}
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
              {row.email}
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
        key={`${modalMode}-${selected?.proveedorId ?? "new"}`}
        title={
          modalMode === "create"
            ? "Crear"
            : modalMode === "edit"
              ? "Editar"
              : "Detalles"
        }
        headerIcon={UserPlus2}
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
