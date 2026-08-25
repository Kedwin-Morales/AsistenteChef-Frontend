import {
  WholeWord,
  SquareDashedText,
  Users,
  Scale,
  UtensilsCrossed,
  LandPlot,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import InputField from "@/components/ui/InputField";
import { toNumber } from "@/features/receta/utils/number.utils";
import type { CreateSubDTO } from "../types/subReceta.types";
import type { ModelDTO as FamiliaMenuDTO } from "@/features/familiaMenu/types/familiaMenu.types";
import type { ModelDTO as AreaPreparacionDTO } from "@/features/areaPreparacion/types/areaPreparacion.types";
import { IoReceiptOutline } from "react-icons/io5";

interface Props {
  isDarkMode: boolean;
  form: CreateSubDTO;
  familias: FamiliaMenuDTO[];
  areas: AreaPreparacionDTO[];
  required: Record<string, boolean>;
  onChange: (patch: Partial<CreateSubDTO>) => void;
  readOnly?: boolean;
}

const SELECT_CLASS =
  "w-full h-10 appearance-none rounded-xl border border-(--bordes) bg-(--bg-form) px-3 pr-10 text-(--texto) outline-none transition-all duration-300 focus:border-(--secondary) focus:ring-2 focus:ring-(--secondary)";

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

export default function SubRecetaInfoBaseSection({
  isDarkMode,
  form,
  familias,
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
          <IoReceiptOutline size={20} />
        </span>
        Información Base
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
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
            {required.descripcion && <span className="text-red-500 ml-1">*</span>}
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
          <InputField
            label="Porciones:"
            icon={Users}
            type="number"
            value={form.porciones ?? ""}
            required={required.porciones}
            isDarkMode={isDarkMode}
            onChange={(e) =>
              onChange({ porciones: toNumber(e.target.value) })
            }
            disabled={readOnly}
          />
        </div>

        <div className="md:col-span-3">
          <InputField
            label="Rendimiento:"
            icon={Scale}
            type="text"
            value={form.rendimiento ?? ""}
            required={required.rendimiento}
            isDarkMode={isDarkMode}
            placeholder="Ej. 2,5 Kg"
            onChange={(e) => onChange({ rendimiento: e.target.value })}
            disabled={readOnly}
          />
        </div>

        <div className="md:col-span-3">
          <SelectField
            id="familiaMenuId"
            label="Familia del Menú:"
            icon={UtensilsCrossed}
            required={required.familiaMenuId}
            value={form.familiaMenuId ?? ""}
            options={familias.map((f) => ({
              value: f.familiaMenuId,
              label: f.nombre,
            }))}
            isDarkMode={isDarkMode}
            onChange={(value) => onChange({ familiaMenuId: value })}
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
      </div>
    </section>
  );
}
