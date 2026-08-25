import {
  PlusCircle,
  Eye,
  Pencil,
  Ban,
  CircleCheckBig,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import SearchFilter from "@/components/ui/SearchFilter";
import DataTable, { type TableColumn } from "@/components/ui/DataTable";
import { useReceta } from "../hooks/useReceta";
import { editar } from "../services/receta.service";
import type { ModelDTO } from "../types/receta.types";
import { useLoginUI } from "@/features/auth/hooks/useLoginUI";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { getErrorMessage } from "@/shared/services/error.utils";
import { confirm } from "@/shared/utils/swal";
import { sileo } from "sileo";
import { IoReceiptOutline } from "react-icons/io5";


type ModelFilter = "nombre" | "descripcion";

export default function AreaPreparacionPage() {
  const { recetas, loading, refetch } = useReceta();
  const { isDarkMode } = useLoginUI();
  const navigate = useNavigate();

  /* FILTER */
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState<ModelFilter>("nombre");
  const [showActivo, setShowActivo] = useState(false);

  /* Anular */
  const confirmarDelete = async (item: ModelDTO) => {
    const result = await confirm({
      title: `${item.activo ? "Anular" : "Activar"}`,
      text: `¿Desea ${item.activo ? "Anular" : "Activar"}: ${item.nombre}?`,
      icon: "question",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      isDarkMode,
    });
    if (result.isConfirmed) {
      try {
        item.activo = !item.activo;
        await editar(item.recetaId, {
          recetaId: item.recetaId,
          nombre: item.nombre,
          descripcion: item.descripcion ?? "",
          porciones: item.porciones,
          rendimiento: item.rendimiento,
          familiaMenuId: item.familiaMenuId,
          familiaMenu: item.familiaMenu ?? null,
          areaPreparacionId: item.areaPreparacionId,
          areaPreparacion: item.areaPreparacion ?? null,
          detalle: item.detalle ?? [],
          detPreparacion: item.detPreparacion ?? [],
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

  const filtered = recetas
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
              onClick={() => navigate(`/recetas/ver/${row.recetaId}`)}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
            >
              <Eye size={16} />
            </button>
            {row.activo ? (
              <button
                onClick={() => navigate(`/recetas/editar/${row.recetaId}`)}
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
          <h1 className="flex items-center gap-2 text-2xl font-bold text-(--primary) mb-2">
            <IoReceiptOutline size={30} />
            Recetas
          </h1>
          <p className="text-sm text-neutral-500">
            Gestión para las Recetas del sistema
          </p>
        </div>
        <button
          onClick={() => navigate("/recetas/nueva")}
          className="bg-gradient btn-gradient shadow-xl-secondary"
        >
          <PlusCircle size={18} /> Nuevo
        </button>
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

      <DataTable<ModelDTO>
        data={filtered}
        columns={columns}
        rowKey={(row) => row?.recetaId}
        emptyMessage="No se encontraron resultados."
        isDarkMode={isDarkMode}
      />

    </AppLayout>
  );
}
