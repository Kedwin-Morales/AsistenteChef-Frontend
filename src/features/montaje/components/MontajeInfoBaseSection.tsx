import {
  WholeWord,
  SquareDashedText,
  Users,
  CircleDollarSign,
  UtensilsCrossed,
  LandPlot,
  CalendarArrowDown,
  ImagePlus, // Importamos un icono para la carga de imágenes
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import InputField from "@/components/ui/InputField";
import { toNumber } from "@/features/receta/utils/number.utils";
import type { CreateDTO } from "../types/montaje.types";
import type { ModelDTO as CategoriaPlatoDTO } from "@/features/categoriaPlato/types/categoria.types";
import type { ModelDTO as AreaPreparacionDTO } from "@/features/areaPreparacion/types/areaPreparacion.types";
import { BiDish } from "react-icons/bi";

interface Props {
  isDarkMode: boolean;
  form: CreateDTO;
  categorias: CategoriaPlatoDTO[];
  areas: AreaPreparacionDTO[];
  required: Record<string, boolean>;
  onChange: (patch: Partial<CreateDTO>) => void;
  readOnly?: boolean;
}

const SELECT_CLASS =
  "w-full h-10 appearance-none rounded-xl border border-(--bordes) bg-(--bg-form) px-3 pr-10 text-(--texto) outline-none transition-all duration-300 focus:border-(--secondary) focus:ring-2 focus:ring-(--secondary)";

const formatDateInputValue = (value?: string | Date | null) => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

function SelectField({
  id,
  label,
  icon: Icon,
  required,
  value,
  options,
  isDarkMode,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  icon?: LucideIcon;
  required: boolean;
  value: string;
  options: { value: string; label: string }[];
  isDarkMode: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className={`block mb-1 font-semibold text-base ${
          isDarkMode ? "text-(--texto)" : "text-(--texto)"
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
          />
        )}
        <select
          id={id}
          value={value}
          required={required}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={`${SELECT_CLASS} items-center ${Icon ? "pl-10" : "pl-4"} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <option value="">Seleccione...</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function MontajeInfoBaseSection({
  isDarkMode,
  form,
  categorias,
  areas,
  required,
  onChange,
  readOnly = false,
}: Props) {
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
          <BiDish size={20} />
        </span>
        Información Base
      </h2>

      {/* Contenedor principal de la cuadrícula: 2 columnas en desktop, 1 en mobile */}
      <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
        
        {/* Columna izquierda (Datos): Ocupa 7/10 de la cuadrícula en desktop */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
          <div className="md:col-span-6">
            <InputField
              label="Nombre: "
              icon={WholeWord}
              type="text"
              value={form.nombre ?? ""}
              required={required.nombre}
              isDarkMode={isDarkMode}
              placeholder="Ej. Salsa Bechamel"
              onChange={(e) => onChange({ nombre: e.target.value })}
              disabled={readOnly}
            />
          </div>

          <div className="md:col-span-6">
            <label
              className={`block mb-1 font-semibold text-md ${
                isDarkMode ? "text-(--texto)" : "text-(--texto)"
              }`}
            >
              Descripción:
              {required.descripcion && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            <div className="relative">
              <SquareDashedText
                size={18}
                className="absolute left-3 top-3 text-neutral-500"
              />
              <textarea
                rows={3}
                value={form.descripcion ?? ""}
                required={required.descripcion}
                onChange={(e) => onChange({ descripcion: e.target.value })}
                disabled={readOnly}
                className="w-full rounded-xl border border-(--bordes) bg-(--bg-form) py-2 pl-10 pr-4 text-(--texto) outline-none transition-all duration-300 focus:border-(--secondary) focus:ring-2 focus:ring-(--secondary) resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="Breve descripción de la preparación"
              />
            </div>
          </div>
          <div className="md:col-span-3">
            <SelectField
              id="categoriaId"
              label="Categoria del Plato:"
              icon={UtensilsCrossed}
              required={required.categoriaId}
              value={form.categoriaId ?? ""}
              options={categorias.map((f) => ({
                value: f.categoriaPlatoId,
                label: f.nombre,
              }))}
              isDarkMode={isDarkMode}
              onChange={(value) => onChange({ categoriaId: value })}
              disabled={readOnly}
            />
          </div>

          <div className="md:col-span-3">
            <SelectField
              id="areaPreparacionId"
              label="Área de Preparación:"
              icon={LandPlot}
              required={required.areaPreparacionId}
              value={form.areaPreparacionId ?? ""}
              options={areas.map((a) => ({
                value: a.areaPreparacionId,
                label: a.nombre ?? "",
              }))}
              isDarkMode={isDarkMode}
              onChange={(value) => onChange({ areaPreparacionId: value })}
              disabled={readOnly}
            />
          </div>
          <div className="md:col-span-3">
            <InputField
              label="Porciones:"
              icon={Users}
              type="number"
              value={form.porciones ?? ""}
              required={required.porciones}
              isDarkMode={isDarkMode}
              onChange={(e) => onChange({ porciones: toNumber(e.target.value) })}
              disabled={readOnly}
            />
          </div>

          <div className="md:col-span-3">
            <InputField
              label="Costo por Porcion:"
              icon={CircleDollarSign}
              type="text"
              value={form.costoPorcion ?? ""}
              required={required.costoPorcion}
              isDarkMode={isDarkMode}
              placeholder="10$"
              onChange={(e) =>
                onChange({ costoPorcion: toNumber(e.target.value) })
              }
              disabled={readOnly}
            />
          </div>

          <div className="md:col-span-3">
            <InputField
              label="Costo por Unidad:"
              icon={CircleDollarSign}
              type="text"
              value={form.costoUnidad ?? ""}
              required={required.costoUnidad}
              isDarkMode={isDarkMode}
              placeholder="10$"
              onChange={(e) =>
                onChange({ costoUnidad: toNumber(e.target.value) })
              }
              disabled={readOnly}
            />
          </div>

          <div className="md:col-span-3">
            <InputField
              label="Precio de venta:"
              icon={CircleDollarSign}
              type="text"
              value={form.costoUnidad ?? ""}
              required={required.costoUnidad}
              isDarkMode={isDarkMode}
              placeholder="10$"
              onChange={(e) => onChange({ precio: toNumber(e.target.value) })}
              disabled={readOnly}
            />
          </div>
          <div className="md:col-span-3">
            <InputField
              label="Fecha:"
              icon={CalendarArrowDown}
              type="date"
              value={formatDateInputValue(form.fecha)}
              required={required.fecha}
              isDarkMode={isDarkMode}
              onChange={(e) => onChange({ fecha: new Date(e.target.value) })}
              disabled={readOnly}
            />
          </div>
        </div>
        
        {/* Columna derecha (Carga de Foto) */}
        <div className="md:col-span-3 flex flex-col h-full">
          <label
            className={`block mb-1 font-semibold text-base ${
              isDarkMode ? "text-(--texto)" : "text-(--texto)"
            }`}
          >
            Subir foto del plato:
            {required.urlImagen && <span className="text-red-500 ml-1">*</span>}
          </label>
        
          <label
            htmlFor="image-upload"
            className={`flex grow flex-col items-center justify-center rounded-xl border-2 border-dashed border-(--bordes) px-4 py-12 text-center transition-all duration-300       hover:border-(--secondary) hover:bg-(--secondary)/5 cursor-pointer ${
              isDarkMode ? "bg-neutral-800/30" : "bg-(--bg-form)"
            } group`}
          >
            {form.file || form.urlImagen ? (
              // Vista previa (prioriza el archivo físico cargado usando URL.createObjectURL)
              <div className="relative w-full h-full min-h-37 flex items-center justify-center">
                <img
                  src={
                    form.file
                      ? URL.createObjectURL(form.file)
                      : form.urlImagen
                  }
                  alt="Vista previa del plato"
                  className="max-h-full max-w-full rounded-lg object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="text-white text-sm font-medium">Cambiar imagen</p>
                </div>
              </div>
            ) : (
              // Estado vacío
              <>
                <ImagePlus
                  size={32}
                  className="mb-4 text-neutral-500 group-hover:text-(--secondary)"
                />
                <p className="text-sm font-medium text-(--texto)">
                  Arrastrar archivo o clic para subir
                </p>
                <p className="mt-1 text-xs text-neutral-400">(JPG, PNG, Máx 5MB)</p>
              </>
            )}
        
            <input
              id="image-upload"
              type="file"
              className="hidden"
              accept="image/*"
              disabled={readOnly}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Se envía el nombre del archivo a urlImagen y el objeto File a imagenFile
                  onChange({
                    urlImagen: file.name, // Ej: "plato1.png"
                    file: file,    // Objeto File físico
                  });
                }
              }}
            />
          </label>
        </div>        
      </div>
    </section>
  );
}