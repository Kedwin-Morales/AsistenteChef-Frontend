import type { LucideIcon } from "lucide-react";
import { useState, useCallback } from "react";
import {
  ShoppingBasket,
  Trash2,
  Plus,
  RulerDimensionLine,
  Search,
  X,
  BookOpen,
  Layers,
} from "lucide-react";
import InputField from "@/components/ui/InputField";
import AutocompleteField from "@/components/ui/AutocompleteField";
import { sileo } from "sileo";
import { confirm } from "@/shared/utils/swal";
import { toNumber } from "@/features/receta/utils/number.utils";
import type { ModelDETCreate } from "../types/montaje.types";
import type { ModelDTO as IngredienteDTO } from "@/features/ingrediente/types/ingrediente.types";
import type { ModelDTO as RecetaDTO } from "@/features/receta/types/receta.types";
import type { ModelSubDTO as SubRecetaDTO } from "@/features/subReceta/types/subReceta.types";
import type { UnidadMedidaDTO } from "@/features/ingrediente/types/ingrediente.types";
import { IoReceiptOutline } from "react-icons/io5";

interface Props {
  isDarkMode: boolean;
  detalle: ModelDETCreate[];
  ingredientes: IngredienteDTO[];
  recetas: RecetaDTO[];
  subRecetas: SubRecetaDTO[];
  unidades: UnidadMedidaDTO[];
  onAdd: (item: ModelDETCreate) => void;
  onUpdate: (index: number, cantidad: number, medida: string) => void;
  onRemove: (index: number) => void;
  onDirty: () => void;
  readOnly?: boolean;
  currentMontajeId?: string;
}

type DetailType = "ingrediente" | "receta" | "subReceta";

type ItemType = "ingrediente" | "receta" | "subReceta";

interface TypeOption {
  type: ItemType;
  label: string;
  icon: LucideIcon;
}

interface Draft {
  ingredienteId: string;
  recetaId: string;
  subRecetaId: string;
  cantidad: string;
  medida: string;
}

const EMPTY_DRAFT: Draft = {
  ingredienteId: "",
  recetaId: "",
  subRecetaId: "",
  cantidad: "",
  medida: "",
};

const SELECT_CLASS =
  "w-full h-10 appearance-none rounded-xl border border-(--bordes) bg-(--bg-form) px-3 pr-10 text-(--texto) outline-none transition-all duration-300 focus:border-(--secondary) focus:ring-2 focus:ring-(--secondary)";

function getTipoBadge({ isDarkMode, tipo }: { isDarkMode: boolean; tipo: DetailType }) {
  if (tipo === "ingrediente") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
          isDarkMode
            ? "bg-amber-900/30 text-amber-300 border border-amber-700/50"
            : "bg-amber-100 text-amber-800 border border-amber-200"
        }`}
      >
        <ShoppingBasket size={12} /> Ingrediente
      </span>
    );
  }  
  if (tipo === "subReceta") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
          isDarkMode
            ? "bg-purple-900/30 text-purple-300 border border-purple-700/50"
            : "bg-purple-100 text-purple-800 border border-purple-200"
        }`}
      >
        <ShoppingBasket size={12} /> SubReceta
      </span>
    );
  }  
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
        isDarkMode
          ? "bg-blue-900/30 text-blue-300 border border-blue-700/50"
          : "bg-blue-100 text-blue-800 border border-blue-200"
      }`}
    >
      <IoReceiptOutline size={12} /> Receta
    </span>
  );
}

function getNombre(
  item: ModelDETCreate,
  ingredientes: IngredienteDTO[],
  recetas: RecetaDTO[],
  subRecetas: SubRecetaDTO[]
): string {
  if (item.ingredienteId) {
    return ingredientes.find((i) => i.ingredienteId === item.ingredienteId)?.nombre ?? "—";
  }
  if (item.recetaId) {
    return recetas.find((r) => r.recetaId === item.recetaId)?.nombre ?? "—";
  }
  if (item.subRecetaId) {
    return subRecetas.find((r) => r.subRecetaId === item.subRecetaId)?.nombre ?? "—";
  }
  return "—";
}

function getTipo(item: ModelDETCreate): DetailType {
  return item.ingredienteId ? "ingrediente" : item.recetaId ? "receta" : "subReceta";
}

export default function MontajeIngredientesSection({
  isDarkMode,
  detalle,
  ingredientes,
  recetas,
  subRecetas,
  unidades,
  onAdd,
  onUpdate,
  onRemove,
  onDirty,
  readOnly = false,
  currentMontajeId,
}: Props) {
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [selectedType, setSelectedType] = useState<ItemType>("ingrediente");

  const typeOptions: TypeOption[] = [
    { type: "ingrediente", label: "Ingrediente", icon: ShoppingBasket },
    { type: "receta", label: "Receta", icon: BookOpen },
    { type: "subReceta", label: "Sub-Receta", icon: Layers },
  ];

  const handleTypeChange = useCallback(
    (type: ItemType) => {
      if (readOnly || type === selectedType) return;
      setSelectedType(type);
      setDraft((prev) => ({
        ...prev,
        ingredienteId: "",
        recetaId: "",
        subRecetaId: "",
      }));
      onDirty();
    },
    [readOnly, selectedType, onDirty],
  );

  const ingredienteOptions = ingredientes.map((i) => ({
    value: i.ingredienteId,
    label: i.nombre,
  }));

  const recetaOptions = recetas
    .filter((r) => r.recetaId !== currentMontajeId)
    .map((r) => ({
      value: r.recetaId,
      label: r.nombre,
    }));

  const subRecetaOptions = subRecetas
    .filter((r) => r.subRecetaId !== currentMontajeId)
    .map((r) => ({
      value: r.subRecetaId,
      label: r.nombre,
    }));

  const unidadOptions = unidades.map((u) => ({
    value: u.simbolo || u.nombre,
    label: u.simbolo ? `${u.nombre} (${u.simbolo})` : u.nombre,
  }));

  const handleChange = useCallback(
    <K extends keyof Draft>(name: K, value: Draft[K]) => {
      if (readOnly) return;

      if (name === "ingredienteId" && value) {
        setDraft((prev) => ({ ...prev, [name]: value, recetaId: "", subRecetaId: "" }));
      } else if (name === "recetaId" && value) {
        setDraft((prev) => ({ ...prev, [name]: value, ingredienteId: "", subRecetaId: "" }));
      } else if (name === "subRecetaId" && value) {
        setDraft((prev) => ({ ...prev, [name]: value, ingredienteId: "", recetaId: "" }));
      } else {
        setDraft((prev) => ({ ...prev, [name]: value }));
      }
      onDirty();
    },
    [readOnly, onDirty]
  );

  const validateCantidad = (value: string): number | null => {
    const num = toNumber(value);
    if (num === undefined || num <= 0) {
      return null;
    }
    return num;
  };

  const handleAdd = useCallback(() => {
    if (readOnly) return;

    const hasIngrediente = draft.ingredienteId !== "";
    const hasReceta = draft.recetaId !== "";
    const hasSubReceta = draft.subRecetaId !== "";

    if (!hasIngrediente && !hasReceta && !hasSubReceta) {
      sileo.warning({
        title: "¡Atención!",
        description: "Selecciona un ingrediente, una receta o una sub-receta.",
      });
      return;
    }

    const selectedCount = [hasIngrediente, hasReceta, hasSubReceta].filter(Boolean).length;
    if (selectedCount > 1) {
      sileo.warning({
        title: "¡Atención!",
        description: "Solo puede seleccionar un ingrediente, una receta O una sub-receta, no varios a la vez.",
      });
      return;
    }

    if (draft.cantidad.trim() === "") {
      sileo.warning({
        title: "¡Atención!",
        description: "Ingrese una cantidad.",
      });
      return;
    }

    const cantidad = validateCantidad(draft.cantidad);
    if (cantidad === null) {
      sileo.warning({
        title: "¡Atención!",
        description: "La cantidad debe ser un número mayor a cero.",
      });
      return;
    }

    if (!draft.medida) {
      sileo.warning({
        title: "¡Atención!",
        description: "Seleccione una unidad de medida.",
      });
      return;
    }

    let tipo: DetailType;
    let id: string;
    if (hasIngrediente) {
      tipo = "ingrediente";
      id = draft.ingredienteId;
    } else if (hasReceta) {
      tipo = "receta";
      id = draft.recetaId;
    } else {
      tipo = "subReceta";
      id = draft.subRecetaId;
    }

    const existingIndex = detalle.findIndex((item) => {
      if (tipo === "ingrediente") {
        return item.ingredienteId === id;
      }
      if (tipo === "receta") {
        return item.recetaId === id;
      }
      return item.subRecetaId === id;
    });

    if (existingIndex >= 0) {
      const existingItem = detalle[existingIndex];
      const nuevaCantidad = (existingItem.cantidad ?? 0) + cantidad;
      onUpdate(existingIndex, nuevaCantidad, existingItem.medida ?? "");
      const nombre = getNombre(existingItem, ingredientes, recetas, subRecetas);
      sileo.success({
        title: "Elemento actualizado",
        description: `Se sumó ${cantidad} ${draft.medida} a ${nombre}.`,
      });
    } else {
      const newItem: ModelDETCreate = {
        ...(tipo === "ingrediente" ? { ingredienteId: id } : tipo === "receta" ? { recetaId: id } : { subRecetaId: id }),
        cantidad,
        medida: draft.medida,
      };
      onAdd(newItem);
      const nombre = tipo === "ingrediente"
        ? ingredientes.find((i) => i.ingredienteId === id)?.nombre ?? "—"
        : tipo === "receta"
        ? recetas.find((r) => r.recetaId === id)?.nombre ?? "—"
        : subRecetas.find((r) => r.subRecetaId === id)?.nombre ?? "—";
      sileo.success({
        title: "Elemento agregado",
        description: `${nombre} agregado correctamente.`,
      });
    }

    setDraft(EMPTY_DRAFT);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    readOnly,
    draft,
    detalle,
    ingredientes,
    recetas,
    subRecetas,
    onAdd,
    onUpdate,
    onDirty,
  ]);

  const handleRemove = useCallback(
    async (index: number) => {
      if (readOnly) return;
      const item = detalle[index];
      const nombre = getNombre(item, ingredientes, recetas, subRecetas);
      const tipo = getTipo(item);

      const result = await confirm({
        title: "¿Eliminar elemento?",
        text: `Se eliminará "${nombre}" (${tipo === "ingrediente" ? "Ingrediente" : tipo === "receta" ? "Receta" : "Sub-Receta"}) de la composición.`,
        icon: "warning",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        isDarkMode,
      });

      if (result.isConfirmed) {
        onRemove(index);
      }
    },
    [readOnly, detalle, ingredientes, recetas, subRecetas, onRemove, isDarkMode]
  );

  return (
    <section
      className={`rounded-2xl border border-b-5 border-(--bordes) p-3 md:p-6 ${
        isDarkMode
          ? "bg-neutral-800/50 border-neutral-700/50"
          : "bg-(--bg-form) border-(--bordes)"
      }`}
    >
      <h2 className="flex items-center gap-2 text-lg font-bold text-(--primary) mb-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--primary)/10 text-(--secondary)">
          <ShoppingBasket size={20} />
        </span>
        Ingredientes y Recetas
      </h2>

      {!readOnly && (
        <>
          {/* SEGMENTED CONTROL DE TIPO */}
          <div
            role="group"
            aria-label="Tipo de elemento a agregar"
            className="mb-5 grid grid-cols-3 gap-1.5 rounded-2xl border border-(--bordes) bg-(--bg-form) p-1.5 place-items-center"
          >
            {typeOptions.map((opt) => {
              const Icon = opt.icon;
              const active = selectedType === opt.type;
              return (
                <button
                  key={opt.type}
                  type="button"
                  aria-pressed={active}
                  onClick={() => handleTypeChange(opt.type)}
                  className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-(--secondary) w-full md:w-[60%] 
                  ${active
                      ? "bg-gradient shadow-xl-secondary text-white md:scale-[1.02]"
                      : "text-(--texto) hover:bg-(--secondary)/10 focus-visible:bg-(--secondary)/10 md:active:scale-95"
                  }`}
                >
                  <Icon size={16} className={active ? "text-white" : "text-(--secondary)"} />
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* AUTOCOMPLETE DEL TIPO SELECCIONADO */}
          <div className="relative grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 sm:items-end z-100 animate-[fade-in-up_0.3s_ease-out]">
            {selectedType === "ingrediente" && (
              <div className="relative col-span-1 sm:col-span-2 lg:col-span-5">
                <AutocompleteField
                  label="Ingrediente: "
                  value={draft.ingredienteId}
                  options={ingredienteOptions}
                  icon={Search}
                  isDarkMode={isDarkMode}
                  disabled={draft.recetaId !== ""}
                  onChange={(v) => handleChange("ingredienteId", v as unknown as string)}
                />
                {draft.ingredienteId && !draft.recetaId && (
                  <button
                    type="button"
                    onClick={() => handleChange("ingredienteId", "")}
                    className="absolute right-1 top-2/3 -translate-y-1/2 z-20 p-1.5 text-neutral-400 hover:text-(--secondary) hover:bg-(--secondary)/30 dark:hover:bg-neutral-800 rounded-lg transition"
                    aria-label="Limpiar ingrediente"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}

            {selectedType === "receta" && (
              <div className="relative col-span-1 sm:col-span-2 lg:col-span-5">
                <AutocompleteField
                  label="Receta: "
                  value={draft.recetaId}
                  options={recetaOptions}
                  icon={Search}
                  isDarkMode={isDarkMode}
                  disabled={draft.ingredienteId !== "" || draft.subRecetaId !== ""}
                  onChange={(v) => handleChange("recetaId", v as unknown as string)}
                />
                {draft.recetaId && !draft.ingredienteId && !draft.subRecetaId && (
                  <button
                    type="button"
                    onClick={() => handleChange("recetaId", "")}
                    className="absolute right-1 top-2/3 -translate-y-1/2 z-20 p-1.5 text-neutral-400 hover:text-(--secondary) hover:bg-(--secondary)/30 dark:hover:bg-neutral-800 rounded-lg transition"
                    aria-label="Limpiar receta"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}

            {selectedType === "subReceta" && (
              <div className="relative col-span-1 sm:col-span-2 lg:col-span-5">
                <AutocompleteField
                  label="Sub-Receta: "
                  value={draft.subRecetaId}
                  options={subRecetaOptions}
                  icon={Search}
                  isDarkMode={isDarkMode}
                  disabled={draft.ingredienteId !== "" || draft.recetaId !== ""}
                  onChange={(v) => handleChange("subRecetaId", v as unknown as string)}
                />
                {draft.subRecetaId && !draft.ingredienteId && !draft.recetaId && (
                  <button
                    type="button"
                    onClick={() => handleChange("subRecetaId", "")}
                    className="absolute right-1 top-2/3 -translate-y-1/2 z-20 p-1.5 text-neutral-400 hover:text-(--secondary) hover:bg-(--secondary)/30 dark:hover:bg-neutral-800 rounded-lg transition"
                    aria-label="Limpiar sub-receta"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}

            <div className="col-span-2">
              <InputField
                label="Cantidad: "
                type="number"
                value={draft.cantidad}
                isDarkMode={isDarkMode}
                onChange={(e) => handleChange("cantidad", e.target.value)}
              />
            </div>

            <div className="col-span-2 lg:col-span-3">
              <label
                className={`block mb-1 font-semibold text-md ${
                  isDarkMode ? "text-(--texto)" : "text-(--texto)"
                }`}
              >
                U. Medida: 
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
                  disabled={draft.ingredienteId === "" && draft.recetaId === "" && draft.subRecetaId === ""}
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

            <div className="col-span-2">
              <button
                type="button"
                onClick={handleAdd}
                className="px-4 w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-neutral-500 shadow-lg shadow-teal-500 hover:bg-teal-500 text-white font-bold"
              >
                <Plus size={18} /> Agregar
              </button>
            </div>
          </div>
        </>
      )}

      <div className="mt-6 w-full overflow-hidden rounded-xl border border-(--bordes)">
        <table className="w-full text-sm">
          <thead className="hidden md:table-header-group">
            <tr
              className={`text-[12px] uppercase font-bold ${
                isDarkMode
                  ? "bg-neutral-600/50 text-(--texto)"
                  : "bg-olive-400/50 text-(--texto)"
              }`}
            >
              <th className="p-3 text-left font-semibold">Ingrediente / Receta / Sub-Receta</th>
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
                  Aún no has agregado ingredientes, recetas ni sub-recetas.
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
                    <div className="flex items-center gap-2">
                      {getTipoBadge({ isDarkMode, tipo: getTipo(row) })}
                      <span className="font-semibold">{getNombre(row, ingredientes, recetas, subRecetas)}</span>
                    </div>
                  </td>
                  <td className="p-3 md:px-4 md:py-3">{row.cantidad}</td>
                  <td className="p-3 md:px-4 md:py-3">{row.medida}</td>
                  {!readOnly && (
                    <td className="p-3 md:px-4 md:py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemove(i)}
                        aria-label={`Eliminar ${getNombre(row, ingredientes, recetas, subRecetas)}`}
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

        <div className="md:hidden space-y-3 p-3">
          {detalle.length === 0 ? (
            <p className="text-center text-sm text-neutral-500 py-4">
              Aún no has agregado ingredientes, recetas ni sub-recetas.
            </p>
          ) : (
            detalle.map((row, i) => (
              <div
                key={i}
                className={`rounded-xl border p-3 ${
                  isDarkMode
                    ? "bg-neutral-800/50 border-neutral-700/50"
                    : "bg-(--bg-form) border-(--bordes)"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getTipoBadge({ isDarkMode, tipo: getTipo(row) })}
                    <p className="font-semibold text-(--texto) truncate">
                      {getNombre(row, ingredientes, recetas, subRecetas)}
                    </p>
                  </div>
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => handleRemove(i)}
                      aria-label={`Eliminar ${getNombre(row, ingredientes, recetas, subRecetas)}`}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="mt-2 flex gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                  <span>
                    Cantidad:{" "}
                    <span className="font-medium text-(--texto)">{row.cantidad}</span>
                  </span>
                  <span>
                    U. Medida:{" "}
                    <span className="font-medium text-(--texto)">{row.medida}</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}