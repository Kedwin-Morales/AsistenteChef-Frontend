import {
  PlusCircle,
  Eye,
  Pencil,
  Ban,
  CircleCheckBig,
  TrendingUp,
  Lightbulb,
  HandPlatter,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import SearchFilter from "@/components/ui/SearchFilter";
import DataTable, { type TableColumn } from "@/components/ui/DataTable";
import { useMontaje } from "../hooks/useMontaje";
import { anular } from "../services/montaje.service";
import type { ModelDTO } from "../types/montaje.types";
import { useLoginUI } from "@/features/auth/hooks/useLoginUI";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { getErrorMessage } from "@/shared/services/error.utils";
import { confirm } from "@/shared/utils/swal";
import { sileo } from "sileo";
import { useConsejo } from "@/features/consejo/hooks/useConsejo";
import StatCard from "@/components/ui/StatCard";
import TipCard from "@/components/ui/TipCard";
import DataCardList from "@/components/ui/DataCardList";
import { BiDish } from "react-icons/bi";
import { ReportAction } from "@/features/reportes/components/ReportAction";
import { generateReportPdf } from "@/features/reportes/utils/pdfActions";
import { MontajeReport } from "@/features/reportes/documents/MontajeReport";
import { createPdfFileName } from "@/features/reportes/utils/pdfFileName";

type ModelFilter = "nombre" | "descripcion";

export default function MontajePage() {
  const { montajes, loading, refetch } = useMontaje();
  const { isDarkMode } = useLoginUI();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState<ModelFilter>("nombre");
  const [showActivo, setShowActivo] = useState(false);
  const { consejos } = useConsejo();
  const consejo = consejos.filter(
    (a) => a.modulo === "montajes".toUpperCase() && a.activo,
  );

  const formatearFecha = (fechaString: string) => {
    if (!fechaString) return "";

    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const confirmarAnular = async (item: ModelDTO) => {
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
        const updatedItem = { ...item, activo: !item.activo };
        await anular(item.montajeId, updatedItem);
        sileo.success({
          title: "¡Operación exitosa!",
          description: `El registro se ${item.activo ? "anuló" : "activó"} correctamente.`,
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

  const filtered = montajes
    .filter((a) => (showActivo ? esActive(a) : !esActive(a)))
    .filter((u) =>
      `${u.nombre} ${u.descripcion}`.toLowerCase().includes(search.toLowerCase()),
    );

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
            onClick={() => navigate(`/montajes/ver/${row.montajeId}`)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
          >
            <Eye size={16} />
          </button>
          {row.activo ? (
            <button
              onClick={() => navigate(`/montajes/editar/${row.montajeId}`)}
              className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg"
            >
              <Pencil size={16} />
            </button>
          ) : (
            <></>
          )}
          <ReportAction
            document={<MontajeReport data={row} />}
            fileName={createPdfFileName("Montaje", row.nombre, row.fecha)}
          />
          <button
            onClick={() => confirmarAnular(row)}
            className={`p-2 ${row.activo ? "text-red-500 hover:bg-red-100" : "text-emerald-600 hover:bg-emerald-100"} rounded-lg`}
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
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-(--primary) mb-2">
            <BiDish size={30} />
            Montajes
          </h1>
          <p className="text-sm text-neutral-500">
            Gestión para los Montajes del sistema
          </p>
        </div>
        <button
          onClick={() => navigate("/montajes/nueva")}
          className="bg-gradient btn-gradient shadow-xl-secondary"
        >
          <PlusCircle size={18} /> Nuevo
        </button>
      </div>

      <div className="my-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Montajes Activos"
          icon={HandPlatter}
          value={montajes.filter((a) => a.activo).length}
          footerIcon={TrendingUp}
          footerText="Elementos más usados."
          trend="positive"
          delay={100}
        />
        <StatCard
          title="Total Montajes"
          icon={HandPlatter}
          value={montajes.length}
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
          rowKey={(row) => row?.montajeId}
          emptyMessage="No se encontraron resultados."
          isDarkMode={isDarkMode}
        />
      </div>

      <div className="block md:hidden">
        <DataCardList<ModelDTO>
          data={filtered}
          getKey={(row) =>
            row.montajeId ? row.montajeId.toString() : ""
          }
          title={(row) => row.nombre}
          badges={(row) => [
            {
              label: row.activo ? "Activo" : "Inactivo",
              variant: row.activo ? "success" : "danger",
            },
          ]}
          renderExtra={(row) => (
            <div className="">{row.descripcion}</div>
          )}
          onView={(row) => navigate(`/montajes/ver/${row.montajeId}`)}
          onEdit={(row) => navigate(`/montajes/editar/${row.montajeId}`)}
          onPdf={(row) =>
            generateReportPdf(
              <MontajeReport data={row} />,
              createPdfFileName("Montaje", row.nombre, row.fecha),
            )
          }
          onDelete={(row) => {
            confirmarAnular(row);
          }}
          emptyMessage="No se encontraron resultados."
          isDarkMode={isDarkMode}
        />
      </div>
    </AppLayout>
  );
}