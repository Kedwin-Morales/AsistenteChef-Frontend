import { TriangleAlert, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ModelDTO as MermaDTO } from "@/features/merma/types/merma.types";

interface WasteAlert {
  id: string;
  titulo: string;
  detalle: string;
}

function buildAlerts(mermas: MermaDTO[]): WasteAlert[] {
  const remaining = mermas.filter((m) => m.activo);

  if (remaining.length === 0) {
    return [
      {
        id: "empty",
        titulo: "Sin alertas",
        detalle: "No hay picos de merma registrados.",
      },
    ];
  }

  const byNombre = new Map<string, MermaDTO[]>();
  remaining.forEach((m) => {
    const nombre = m.receta?.nombre ?? m.subReceta?.nombre ?? "Sin registro";
    const arr = byNombre.get(nombre) ?? [];
    arr.push(m);
    byNombre.set(nombre, arr);
  });

  const top = Array.from(byNombre.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 3)
    .map(([nombre, items]) => {
      const total = items.reduce<number>(
        (acc, m) => acc + (Number(m.cantidad) || 0),
        0,
      );
      return {
        id: items[0].mermaId,
        titulo: `Pico de Merma: ${nombre}`,
        detalle: `${items.length} registro${items.length > 1 ? "s" : ""} · ${total} unidades`,
      };
    });

  return top;
}

export default function WasteAlertList({ mermas }: { mermas: MermaDTO[] }) {
  const navigate = useNavigate();
  const alerts = buildAlerts(mermas);

  return (
    <div className="flex flex-col rounded-3xl border border-b-5 border-(--bordes)        bg-linear-to-b from-(--secondary)/60 to-transparent to-60% p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-500/20">
          <TriangleAlert size={18} />
        </span>
        <div>
          <h3 className="text-sm font-bold text-(--texto)">
            Alertas de Desperdicio
          </h3>
          <p className={`text-xs text-neutral-500`}>
            Picos de merma detectados
          </p>
        </div>
      </div>

      <ul className="flex flex-col divide-y divide-(--bordes)">
        {alerts.map((alert) => (
          <li key={alert.id} className="flex items-center gap-3 py-3">
            <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-(--texto)">
                {alert.titulo}
              </p>
              <p className="truncate text-xs text-neutral-500">
                {alert.detalle}
              </p>
            </div>
          </li>
        ))}
      </ul>
      
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => navigate("/mermas")}
          className="btn-gradient mt-4 w-fit bg-gradient shadow-xl-secondary active:scale-[0.98] transition-all duration-200"
        >
          <FileText size={18} />
          Generar Reporte
        </button>
      </div>
    </div>
  );
}
