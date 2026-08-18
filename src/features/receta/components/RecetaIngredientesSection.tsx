import { useState } from "react";
import {
  ShoppingBasket,
  Trash2,
  Plus,
  RulerDimensionLine,
  Search,
} from "lucide-react";
import InputField from "@/components/ui/InputField";
import AutocompleteField from "@/components/ui/AutocompleteField";
import { sileo } from "sileo";
import { toNumber } from "../utils/number.utils";
import type { ModelDETCreate } from "../types/receta.types";
import type { ModelDTO as IngredienteDTO } from "@/features/ingrediente/types/ingrediente.types";
import type { UnidadMedidaDTO } from "@/features/ingrediente/types/ingrediente.types";

interface Props {
  isDarkMode: boolean;
  detalle: ModelDETCreate[];
  ingredientes: IngredienteDTO[];
  unidades: UnidadMedidaDTO[];
  onAdd: (item: ModelDETCreate) => void;
  onUpdate: (index: number, cantidad: number, medida: string) => void;
  onRemove: (index: number) => void;
  onDirty: () => void;
  readOnly?: boolean;
}

interface Draft {
  ingredienteId: string;
  cantidad: string;
  medida: string;
}

const EMPTY_DRAFT: Draft = { ingredienteId: "", cantidad: "", medida: "" };

const SELECT_CLASS =
  "w-full h-10 appearance-none rounded-xl border border-(--bordes) bg-(--bg-form) px-3 pr-10 text-(--texto) outline-none transition-all duration-300 focus:border-(--secondary) focus:ring-2 focus:ring-(--secondary)";

export default function RecetaIngredientesSection({
  isDarkMode,
  detalle,
  ingredientes,
  unidades,
  onAdd,
  onUpdate,
  onRemove,
  onDirty,
  readOnly = false,
}: Props) {
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);

  const ingredienteOptions = ingredientes.map((i) => ({
    value: i.ingredienteId,
    label: i.nombre,
  }));

  const unidadOptions = unidades.map((u) => ({
    value: u.simbolo || u.nombre,
    label: u.simbolo ? `${u.nombre} (${u.simbolo})` : u.nombre,
  }));

  const handleChange = <K extends keyof Draft>(name: K, value: Draft[K]) => {
    if (readOnly) return;
    setDraft((prev) => ({
      ...prev,
      [name]: value,
    }));
    onDirty();
  };

  const handleAdd = () => {
    if (readOnly) return;
    if (!draft.ingredienteId || draft.cantidad.trim() === "" || !draft.medida) {
      sileo.warning({
        title: "¡Atención!",
        description:
          "Selecciona el ingrediente, ingresa la cantidad y elige la unidad de medida.",
      });
      return;
    }

    const cantidad = toNumber(draft.cantidad);
    if (cantidad === undefined) {
      sileo.warning({
        title: "¡Atención!",
        description: "La cantidad debe ser un número válido.",
      });
      return;
    }

    const existingIndex = detalle.findIndex(
      (item) => item.ingredienteId === draft.ingredienteId
    );

    if (existingIndex >= 0) {
      const existingItem = detalle[existingIndex];
      const nuevaCantidad = (existingItem.cantidad ?? 0) + cantidad;
      onUpdate(existingIndex, nuevaCantidad, existingItem.medida);
      sileo.success({
        title: "Ingrediente actualizado",
        description: `Se sumó ${cantidad} ${draft.medida} a ${nombreDe(draft.ingredienteId)}.`,
      });
    } else {
      onAdd({ ingredienteId: draft.ingredienteId, cantidad, medida: draft.medida });
    }

    setDraft(EMPTY_DRAFT);
  };

  const nombreDe = (ingredienteId?: string) =>
    ingredientes.find((i) => i.ingredienteId === ingredienteId)?.nombre ?? "—";

  return (
    <section
      className={`rounded-2xl border border-b-5 border-(--bordes) p-6 ${
        isDarkMode
          ? "bg-neutral-800/50 border-neutral-700/50"
          : "bg-(--bg-form) border-(--bordes)"
      }`}
    >
      <h2 className="flex items-center gap-2 text-lg font-bold text-(--primary) mb-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--primary)/10 text-(--secondary)">
          <ShoppingBasket size={20} />
        </span>
        Ingredientes
      </h2>

      {!readOnly && (
        <>
          {/* ADD ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-2 lg:col-span-5 relative z-100">
            <AutocompleteField
              label="Ingrediente"
              value={draft.ingredienteId}
              options={ingredienteOptions}
              required
              icon={Search}
              isDarkMode={isDarkMode}
              onChange={(v) => handleChange("ingredienteId", v as unknown as string)}
            />
          </div>

          <div className="sm:col-span-1 lg:col-span-2">
            <InputField
              label="Cantidad"
              type="number"
              value={draft.cantidad}
              isDarkMode={isDarkMode}
              onChange={(e) => handleChange("cantidad", e.target.value)}
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label
              className={`block mb-1 font-semibold text-md ${
                isDarkMode ? "text-(--texto)" : "text-(--texto)"
              }`}
            >
              U. Medida
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <RulerDimensionLine
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
              />
              <select
                value={draft.medida}
                onChange={(e) => handleChange("medida", e.target.value)}
                className={`${SELECT_CLASS} pl-10 items-center`}
              >
                <option value="">Seleccione...</option>
                {unidadOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="sm:col-span-1 lg:col-span-2">
            <button
              type="button"
              onClick={handleAdd}
              // className="bg-gradient btn-gradient shadow-xl-secondary w-full"
              className="px-4 w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-neutral-500 shadow-lg shadow-teal-500 hover:bg-teal-500 text-white font-bold"
            >
              <Plus size={18} /> Agregar
            </button>
          </div>
        </div>
        </>
      )}

      {/* TABLE - Responsive: horizontal en desktop, cards en móvil */}
      <div className="mt-6 w-full overflow-hidden rounded-xl border border-(--bordes)">
        <table className="w-full text-sm ">
          <thead className="hidden md:table-header-group">
            <tr
              className={`text-[12px] uppercase font-bold ${
                isDarkMode
                  ? "bg-neutral-600/50 text-(--texto)"
                  : "bg-olive-400/50 text-(--texto)"
              }`}
            >
              <th className="p-3 text-left font-semibold">Ingrediente</th>
              <th className="p-3 text-left font-semibold">Cantidad</th>
              <th className="p-3 text-left font-semibold">U. Medida</th>
              {!readOnly && <th className="p-3 text-center font-semibold">Acciones</th>}
            </tr>
          </thead>
          <tbody className="hidden md:table-header-group">
            {detalle.length === 0 ? (
              <tr>
                <td
                  colSpan={readOnly ? 3 : 4}
                  className="p-6 text-center text-sm text-neutral-500"
                >
                  Aún no has agregado ingredientes.
                </td>
              </tr>
            ) : (
              detalle.map((row, i) => (
                <tr
                  key={i}
                  className={`transition ${
                    isDarkMode
                      ? "bg-(--bg-form) hover:bg-neutral-700"
                      : "bg-(--bg-form) hover:bg-olive-200 border-b border-neutral-200"
                  }`}
                >
                  <td className="p-3 md:px-4 md:py-3">
                    <span className="font-semibold">{nombreDe(row.ingredienteId)}</span>
                  </td>
                  <td className="p-3 md:px-4 md:py-3">{row.cantidad}</td>
                  <td className="p-3 md:px-4 md:py-3">{row.medida}</td>
                  {!readOnly && (
                    <td className="p-3 md:px-4 md:py-3 text-center">
                      <button
                        type="button"
                        onClick={() => onRemove(i)}
                        aria-label={`Eliminar ${nombreDe(row.ingredienteId)}`}
                        className="inline-flex p-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* MÓVIL: lista de cards */}
        <div className="md:hidden space-y-3">
          {detalle.map((row, i) => (
            <div
              key={i}
              className={`rounded-xl border p-3 ${
                isDarkMode
                  ? "bg-neutral-800/50 border-neutral-700/50"
                  : "bg-(--bg-form) border-(--bordes)"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-(--texto)">{nombreDe(row.ingredienteId)}</p>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => onRemove(i)}
                    aria-label={`Eliminar ${nombreDe(row.ingredienteId)}`}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <div className="mt-2 flex gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                <span>Cantidad: <span className="font-medium text-(--texto)">{row.cantidad}</span></span>
                <span>U. Medida: <span className="font-medium text-(--texto)">{row.medida}</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}