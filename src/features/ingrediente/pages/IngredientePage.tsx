import {
  PlusCircle,
  Eye,
  Pencil,
  Tags,
  WholeWord,
  Ban,
  UtensilsCrossed,
  SquareDashedText,
  RulerDimensionLine,
  CircleDollarSign,
  Barcode,
  ShoppingBasket,
  Upload,
  MoveLeft,
  CircleCheckBig
} from "lucide-react";
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import SearchFilter from "@/components/ui/SearchFilter";
import DataTable, { type TableColumn } from "@/components/ui/DataTable";
import EntityModal, {
  type ModalField,
  type ModalMode,
} from "@/components/ui/EntityModal";
import { useIngrediente } from "../hooks/useIngrediente";
import { crear, editar } from "../services/ingrediente.service";
import type { ModelDTO } from "../types/ingrediente.types";
import { useLoginUI } from "@/features/auth/hooks/useLoginUI";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { getErrorMessage } from "@/shared/services/error.utils";
import { confirm } from "@/shared/utils/swal";
import { sileo } from "sileo";
import ImportModal from "@/shared/utils/import/ui/importModal";
import { importConfigs } from "@/shared/utils/import/config/importConfigs";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { exportConfigs } from "@/shared/utils/export/config/exportConfigs";
import ExportButton from "@/shared/utils/export/ui/exportButton";
import { useNavigate } from "react-router-dom";

type ModelFilter = "nombre" | "codigo" | "tipo" | "unidad";

export default function IngredientePage() {
  const { ingredientes, tipos, unidades, loading, refetch } = useIngrediente();
  const { isDarkMode } = useLoginUI();
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState<ModelFilter>("nombre");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selected, setSelected] = useState<ModelDTO | null>(null);
  const [showActivo, setShowActivo] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  /* IMPORT */
  const [importOpen, setImportOpen] = useState(false);

  const fields: ModalField<
    ModelDTO & { tipoIngredienteId?: string } & { unidadMedidaId?: string }
  >[] = [
    {
      name: "nombre",
      label: "Nombre: ",
      icon: WholeWord,
      colSpan: 6,
      required: true,
      type: "text",
    },
    {
      name: "tipoIngredienteId",
      label: "Tipo: ",
      icon: UtensilsCrossed,
      colSpan: 3,
      required: true,
      type: "select",
      options: tipos.map((t) => ({
        label: t.nombre,
        value: t.tipoIngredienteId,
      })),
    },
    {
      name: "unidadMedidaId",
      label: "Unidad de Medidad: ",
      icon: RulerDimensionLine,
      colSpan: 3,
      required: true,
      type: "select",
      options: unidades.map((t) => ({
        label: t.nombre,
        value: t.unidadMedidaId,
      })),
    },
    {
      name: "costo",
      label: "Costo (Opcional): ",
      icon: CircleDollarSign,
      colSpan: 3,
      required: false,
      type: "number",
    },
    {
      name: "codigo",
      label: "Código (Opcional): ",
      icon: Barcode,
      colSpan: 3,
      required: false,
      type: "text",
    },
    {
      name: "descripcion",
      label: "Descripción: ",
      icon: SquareDashedText,
      colSpan: 6,
      required: false,
      type: "textarea",
    },
    ...(modalMode === "edit"
      ? [
          {
            name: "activo" as keyof ModelDTO,
            label: "Activo: ",
            icon: Tags as typeof Tags,
            colSpan: 6,
            type: "boolean" as const,
          },
        ]
      : []),
  ];

  const handleSubmit = async (data: Partial<ModelDTO>) => {
    if (
      !data.nombre ||
      !(data as any).tipoIngredienteId ||
      !(data as any).unidadMedidaId
    ) {
      return sileo.warning({
        title: "¡Atención!",
        description:
          "Por favor, revisa los datos ingresados: Nombre, Tipo y Unidad son obligatorios.",
      });
    }

    try {
      if (modalMode === "create") {
        await crear({
          nombre: data.nombre,
          descripcion: data.descripcion ?? "",
          costo: data.costo ?? 0,
          codigo: data.codigo ?? "",
          tipoIngredienteId: (data as any).tipoIngredienteId,
          unidadMedidaId: (data as any).unidadMedidaId,
        });
        sileo.success({
          title: "¡Operación exitosa!",
          description: "El registro se guardó correctamente.",
        });
      }

      if (modalMode === "edit" && selected?.ingredienteId) {
        await editar(selected.ingredienteId, {
          ingredienteId: selected.ingredienteId,
          nombre: data.nombre,
          descripcion: data.descripcion ?? "",
          costo: data.costo ?? 0,
          codigo: data.codigo ?? "",
          activo: data.activo ?? true,
          tipoIngredienteId: (data as any).tipoIngredienteId,
          unidadMedidaId: (data as any).unidadMedidaId,
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
        await editar(item.ingredienteId, {
            ingredienteId: item.ingredienteId,
            nombre: item.nombre,
            descripcion: item.descripcion ?? "",
            activo: item.activo,
            costo: item.costo ?? 0,
            codigo: item.codigo ?? "",
            tipoIngredienteId: (item as any).tipoIngredienteId,
            unidadMedidaId: (item as any).unidadMedidaId,
        });               
        sileo.success({
          title: "¡Operación exitosa!",
          description: `El registro se ${item.activo ? 'anuló' : 'activo'} correctamente.`,
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

  const esActive = (a: any) => a.activo === false;

  const filtered = ingredientes
    .filter((a) => (showActivo ? esActive(a) : !esActive(a)))
    .filter((u) =>
      `${u.nombre} ${u.codigo} ${u.tipoIngrediente?.nombre} ${u.unidadMedida?.nombre}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );

  const columns: TableColumn<ModelDTO>[] = [
    {
      key: "nombre",
      header: "Nombre",
      render: (row) => <span className="font-semibold">{row.nombre}</span>,
    },
    {
      key: "codigo",
      header: "Código",
      render: (row) => <span>{row.codigo}</span>,
    },
    {
      key: "tipoIngrendiente",
      header: "Tipo",
      render: (row) => (
        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
          {row.tipoIngrediente?.nombre ?? "—"}
        </span>
      ),
    },
    {
      key: "unidadMedida",
      header: "Ud. Medida",
      render: (row) => (
        <span className="px-2 py-1 rounded-full text-xs bg-teal-100 text-teal-700">
          {row.unidadMedida?.nombre ?? "—"} ({row.unidadMedida?.simbolo ?? "—"})
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
            <ShoppingBasket size={30} />
            Ingredientes o Utensilios
          </h1>
          <p className="text-sm ml-15 text-neutral-500">
            Gestión para Ingredientes del sistema.
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

          {(user?.role === "Admin" || user?.role === "Gerente") && (
          <>
            <button
              onClick={() => setImportOpen(true)}
              className="btn-gradient bg-gradient-import"
            >
              <Upload size={18} />
              Importar
            </button>
          </>
          )}
        </div>
      </div>

      <SearchFilter<ModelFilter>
        filterValue={filterBy}
        searchValue={search}
        placeholder="Buscar..."
        options={[
          { value: "nombre", label: "Nombre" },
          { value: "codigo", label: "Código" },
          { value: "tipo", label: "Tipo" },
          { value: "unidad", label: "Ud. Medida" },
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
        <div className="hidden md:flex m-1">
          <ExportButton
            isDarkMode={isDarkMode}
            config={exportConfigs.IngredientesFormat}
            data={filtered}
            onSuccess={refetch}
            format={false}
          /> 
        </div>
      </div>

      <DataTable<ModelDTO>
        data={filtered}
        columns={columns}
        rowKey={(row) => row?.ingredienteId}
        emptyMessage="No se encontraron resultados."
        isDarkMode={isDarkMode}
      />

      {/* ================= IMPORT MODAL ================= */}
      {importOpen && (
        <ImportModal
          isDarkMode={isDarkMode}
          onClose={() => setImportOpen(false)}
          config={importConfigs.Ingredientes}
          onSuccess={refetch}
        />
      )}

      <EntityModal<
        ModelDTO & { tipoIngredienteId?: string } & { unidadMedidaId?: string }
      >
        open={modalOpen}
        key={`${modalMode}-${selected?.ingredienteId ?? "new"}`}
        title={
          modalMode === "create"
            ? "Crear"
            : modalMode === "edit"
              ? "Editar"
              : "Detalles"
        }
        headerIcon={ShoppingBasket}
        mode={modalMode}
        data={
          selected
            ? {
                ...selected,
                tipoIngredienteId:
                  selected.tipoIngrediente?.tipoIngredienteId ?? "",
                unidadMedidaId: selected.unidadMedida?.unidadMedidaId ?? "",
              }
            : null
        }
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
