import { useState } from "react";
import { BookOpen, Trash2, Plus } from "lucide-react";
import { sileo } from "sileo";
import type { AreaPreparacionDETCreate } from "../types/receta.types";

interface Props {
  isDarkMode: boolean;
  pasos: AreaPreparacionDETCreate[];
  onAdd: (descripcion: string) => void;
  onRemove: (index: number) => void;
  onDirty: () => void;
  readOnly?: boolean;
}

export default function RecetaPreparacionSection({
  isDarkMode,
  pasos,
  onAdd,
  onRemove,
  onDirty,
  readOnly = false,
}: Props) {
  const [draft, setDraft] = useState("");

  const handleAdd = () => {
    if (readOnly) return;
    const descripcion = draft.trim();
    if (descripcion === "") {
      sileo.warning({
        title: "¡Atención!",
        description: "Escribe la descripción del paso antes de agregarlo.",
      });
      return;
    }

    onAdd(descripcion);
    setDraft("");
  };

  return (
    <section
      className={`rounded-3xl border p-6 border-b-5 border-(--bordes) ${
        isDarkMode
          ? "bg-neutral-800/50 border-neutral-700/50"
          : "bg-(--bg-form) border-(--bordes)"
      }`}
    >
      <h2 className="flex items-center gap-2 text-lg font-bold text-(--primary) mb-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--primary)/10 text-(--secondary)">
          <BookOpen size={20} />
        </span>
        Método de Preparación
      </h2>

      {!readOnly && (
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1">
            <label
              htmlFor="paso-descripcion"
              className={`block mb-1 font-semibold text-md ${
                isDarkMode ? "text-(--texto)" : "text-(--texto)"
              }`}
            >
              Descripción del Paso:
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              id="paso-descripcion"
              rows={3}
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                onDirty();
              }}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                  handleAdd();
                }
              }}
              className="w-full rounded-xl border border-(--bordes) bg-(--bg-form) p-3 text-(--texto) outline-none transition-all duration-300 focus:border-(--secondary) focus:ring-2 focus:ring-(--secondary) resize-none"
              placeholder="Describe el paso de preparación..."
            />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            // className="bg-gradient btn-gradient shadow-xl-secondary md:h-10"
            className="px-4 h-10 flex items-center justify-center gap-2 rounded-xl bg-neutral-500 shadow-lg shadow-teal-500 hover:bg-teal-500 text-white font-bold"
          >
            <Plus size={18} /> Agregar
          </button>
        </div>
      )}

      {pasos.length > 0 ? (
        <ol className="mt-2 space-y-1">
          {pasos.map((paso, i) => (
            <li
              key={i}
              className={`flex items-center gap-3 rounded-xl border border-(--bordes) p-3 ${
                isDarkMode
                  ? "bg-neutral-800/30 border-neutral-700/50"
                  : "bg-(--bg-form)"
              }`}
            >
              <span className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-(--secondary) text-white font-bold">
                {paso.nroPaso}
              </span>
              <p className="flex-1 text-(--texto) leading-relaxed">
                {paso.Descripcion}
              </p>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  aria-label={`Eliminar paso ${paso.nroPaso}`}
                  className="shrink-0 p-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-6 text-sm text-neutral-500">
          Aún no has agregado pasos de preparación.
        </p>
      )}
    </section>
  );
}
