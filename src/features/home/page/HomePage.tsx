import { BookOpen, Bot, ShoppingCart, TriangleAlert, Zap } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import StatCard from "@/components/ui/StatCard";
import DataTable, { type TableColumn } from "@/components/ui/DataTable";
import { useIngrediente } from "@/features/ingrediente/hooks/useIngrediente";
import { useReceta } from "@/features/receta/hooks/useReceta";
import { useSubReceta } from "@/features/subReceta/hooks/useSubReceta";
import { useMontaje } from "@/features/montaje/hooks/useMontaje";
import { useMerma } from "@/features/merma/hooks/useMerma";
import type { ModelDTO as IngredienteDTO } from "@/features/ingrediente/types/ingrediente.types";
import { useLoginUI } from "@/features/auth/hooks/useLoginUI";
import QuickActionsGrid from "@/features/home/components/QuickActionsGrid";
import WasteAlertList from "@/features/home/components/WasteAlertList";
import { GiCook } from "react-icons/gi";
import DataCardList from "@/components/ui/DataCardList";

type Uso = "Alto" | "Regular";

function deriveUso(costo: number): Uso {
  return costo > 50 ? "Alto" : "Regular";
}

export default function HomePage() {
  const { isDarkMode } = useLoginUI();
  const { ingredientes } = useIngrediente();
  const { recetas } = useReceta();
  const { subRecetas } = useSubReceta();
  const { montajes } = useMontaje();
  const { mermas } = useMerma();

  const recetasActivas = recetas.filter((r) => r.activo);
  const produccionHoy =
    recetasActivas.length +
    subRecetas.filter((s) => s.activo).length +
    montajes.filter((m) => m.activo).length;
  const totalMermas = mermas.filter((m) => m.activo).length;

  const columns: TableColumn<IngredienteDTO>[] = [
    {
      key: "nombre",
      header: "Nombre",
      render: (row) => <span className="font-semibold">{row.nombre}</span>,
    },
    {
      key: "familia",
      header: "Tipo",
      render: (row) => (
        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
          {row.tipoIngrediente?.nombre ?? "—"}
        </span>
      ),
    },
    {
      key: "unidad",
      header: "Ud. Medida",
      render: (row) => (
        <span className="px-2 py-1 rounded-full text-xs bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300">
          {row.unidadMedida?.nombre ?? "—"}
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
      key: "uso",
      header: "Costo",
      render: (row) => {
        const uso = deriveUso(Number(row.costo) || 0);
        return uso === "Alto" ? (
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-300">
            {uso}
          </span>
        ) : (
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300">
            {uso}
          </span>
        );
      },
    },
  ];

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-3xl md:text-4xl font-bold tracking-tight text-(--primary)">
          <GiCook size={50} />
          Bienvenido Chef
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Resumen general de tu cocina.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total de Recetas"
          icon={BookOpen}
          value={recetasActivas.length}
          footerText="Recetas activas"
          trend="positive"
          delay={0}
        />
        <StatCard
          title="Producción de Hoy"
          icon={Bot}
          value={produccionHoy}
          footerText="Recetas, sub-recetas y montajes"
          trend="positive"
          delay={150}
        />
        <StatCard
          title="Alertas de Merma"
          icon={TriangleAlert}
          value={totalMermas}
          footerText="Registros de merma"
          trend={totalMermas > 0 ? "negative" : "neutral"}
          delay={300}
          className="animate-gradient-move rounded-3xl ring-2 ring-red-400/50 shadow-lg shadow-red-500/20"
        />
      </div>
      {/* /KPIs */}

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-[65%_1fr] gap-6">
        {/* Columna izquierda: tabla */}
        <div className="flex flex-col rounded-3xl border border-b-5 border-(--bordes) bg-(--bg-form) p-5 shadow-sm h-fit">
           <h2 className="flex items-center gap-3 mb-4 text-lg font-bold text-(--texto)   tracking-tight">
            <div
              className={`
                flex items-center justify-center w-10 h-10 rounded-xl
                transition-all duration-300 ease-out
                ${isDarkMode
                  ? "bg-(--primary)/10 text-(--primary) border border-(--primary)/20"
                  : "bg-(--primary)/10 text-(--primary) border border-(--primary)/20"}
              `}
                aria-hidden="true"
              >
                <ShoppingCart size={20} />
            </div> 
            
            Últimos Ingredientes Creados
          </h2>
          <div className="hidden md:block">
            <DataTable<IngredienteDTO>
              data={ingredientes}
              columns={columns}
              rowKey={(row) => row.ingredienteId}
              emptyMessage="No hay ingredientes registrados."
              isDarkMode={isDarkMode}
              pageSize={10}
            />
          </div>
          {/* ================= MOBILE ================= */}
          <div className="block md:hidden">
            <DataCardList<IngredienteDTO>
              data={ingredientes}
              getKey={(row) =>
                row.ingredienteId ? row.ingredienteId.toString() : ""
              }
              title={(row) => row.nombre}
              badges={(row) => [
                {
                  label: row.activo ? "Activo" : "Inactivo",
                  variant: row.activo ? "success" : "danger",
                },
              ]}
              renderExtra={(row) => <div className="">{row.descripcion}</div>}
              emptyMessage="No se encontraron resultados."
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* Columna derecha: acciones y alertas */}
        <div className="flex flex-col gap-3">
          <section className="flex flex-col gap-2 bg-linear-to-t from-(--secondary)/60 to-transparent to-60% p-5 rounded-3xl border-b-5 border-(--bordes) shadow-sm" aria-labelledby="acciones-titulo">
            
            <h2
              id="acciones-titulo"
              className="flex items-center gap-3 text-lg font-bold text-(--texto)"
            >
              <div
              className={`
                flex items-center justify-center w-10 h-10 rounded-xl
                transition-all duration-300 ease-out
                ${isDarkMode
                  ? "bg-(--primary)/10 text-(--primary) border border-(--primary)/20"
                  : "bg-(--primary)/10 text-(--primary) border border-(--primary)/20"}
              `}
                aria-hidden="true"
              >
                <Zap size={20} />
              </div>              
              Acciones Rápidas
            </h2>
            <QuickActionsGrid />
          </section>

          <WasteAlertList mermas={mermas} />
        </div>
      </div>
      {/* /Contenido principal */}
    </AppLayout>
  );
}
