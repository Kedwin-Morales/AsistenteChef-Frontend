/* eslint-disable @typescript-eslint/no-explicit-any */
import { Trash2, Pencil, CloudCheck, CircleX } from "lucide-react";
import { useState } from "react";
import InputField from "@/components/ui/InputField";
import type { LucideIcon } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import AutocompleteField from "@/components/ui/AutocompleteField";
import { useToast } from "./toast/useToast";

export type ModalMode = "create" | "edit" | "view";

export type FieldType =
  | "text"
  | "password"
  | "number"
  | "email"
  | "date"
  | "boolean"
  | "select"
  | "autocomplete"
  | "textarea";

interface ModalAction<T> {
  label: string;
  modulo: string;
  codigo: string;
  allowedStatuses?: (string | number)[];
  getStatus: (item: T) => string | number | undefined;
  onClick: (item: T) => void;
  className?: string;
}
export interface ModalField<T> {
  name: keyof T;
  label: string;
  icon?: LucideIcon;
  type?: FieldType;
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6;
  required?: boolean;
  readOnly?: boolean;
  content?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];

  options?: {
    label?: string;
    value?: string | number;
    [key: string]: any;
  }[];

  dependsOn?: keyof T;
  filterOptions?: (
    parentValue: any,
    options: any[],
  ) => { label?: string; value?: string | number }[];

  permission?: {
    modulo: string;
    codigo: string;
  };
}

export interface ModalDetailField<T> {
  name: keyof T;
  label: string;
  type?: FieldType;
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6;
  icon?: LucideIcon;
  required?: boolean;
  options?: {
    label: string;
    value: string | number;
  }[];

  dependsOn?: keyof T;
  filterOptions?: (
    parentValue: any,
    options: any[],
  ) => { label: string; value: string | number }[];

  permission?: {
    modulo: string;
    codigo: string;
  };
}

interface Props<T extends object, D extends object = any> {
  open: boolean;
  title: string;
  mode: ModalMode;
  data?: T | null;
  fields: ModalField<T>[];
  headerIcon?: LucideIcon;
  readOnly?: boolean;

  /**  DETALLE */
  detailKey?: keyof T;
  detailFields?: ModalDetailField<D>[];
  detailColumns?: { key: keyof D; label: string }[];

  isDarkMode: boolean;
  onClose: () => void;
  onSubmit?: (data: Partial<T>) => void;

  isSubmitting?: boolean;
  viewActions?: ModalAction<T>[];
  mergeDetailBy?: keyof D;
  accumulateField?: keyof D;
}

const COL_SPAN_CLASS: Record<number, string> = {
  1: "md:col-span-1",
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
};

export default function EntityModal<T extends object, D extends object = any>({
  open,
  title,
  mode,
  data,
  fields,
  headerIcon: HeaderIcon,
  detailKey,
  detailFields,
  detailColumns,
  isDarkMode,
  onClose,
  onSubmit,
  viewActions,
  isSubmitting = false,
  mergeDetailBy,
  accumulateField,
}: Props<T, D>) {
  const isReadOnly = mode === "view";

  const [form, setForm] = useState<Partial<T>>(data ?? {});
  const [detailForm, setDetailForm] = useState<Partial<D>>({});
  const [detailErrors, setDetailErrors] = useState<Record<string, boolean>>({});
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const toast = useToast();

  const visibleFields = fields.filter((field) => {
    if (!field.permission) return true;
  });

  const visibleFieldsDetails = detailFields?.filter((field) => {
    if (!field.permission) return true;
  });

  const [details, setDetails] = useState<D[]>(
    (data?.[detailKey as keyof T] as D[]) ?? [],
  );

  if (!open) return null;

  const handleChange = <K extends keyof T>(name: K, value: T[K]) => {
    setForm((prev) => {
      const updated: Partial<T> = {
        ...prev,
        [name]: value,
      };

      fields.forEach((f) => {
        if (f.dependsOn === name) {
          updated[f.name] = undefined;
        }
      });

      return updated;
    });
  };

  const handleDetailChange = <K extends keyof D>(name: K, rawValue: any) => {
    const field = detailFields?.find((f) => f.name === name);

    let value: any = rawValue;

    if (field?.type === "number") {
      value = rawValue === "" ? undefined : Number(rawValue);
    }

    if (field?.type === "boolean") {
      value = Boolean(rawValue);
    }

    setDetailForm((prev) => {
      const updated: Partial<D> = {
        ...prev,
        [name]: value,
      };

      // limpiar dependientes
      detailFields?.forEach((f) => {
        if (f.dependsOn === name) {
          updated[f.name] = undefined;
        }
      });

      return updated;
    });
  };

  const addDetail = () => {
    if (!detailFields || detailFields.length === 0) return;

    // Validar si hay algún valor real
    const hasAnyValue = Object.values(detailForm).some((v) => {
      if (typeof v === "string") return v.trim() !== "";
      return v !== undefined && v !== null;
    });

    if (!hasAnyValue) return;

    // Validar required dinámico
    const missingRequired = detailFields.find((f) => {
      if (!f.required) return false;

      const value = detailForm[f.name];

      if (typeof value === "string") return value.trim() === "";
      return value === undefined || value === null;
    });

    if (missingRequired) {
      setDetailErrors({ [String(missingRequired.name)]: true });

      toast.warning(`El campo "${missingRequired.label}" es obligatorio.`);

      const element = document.querySelector(
        `[name="${String(missingRequired.name)}"]`,
      );

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        (element as HTMLElement).focus();
      }

      return;
    }

    setDetailErrors({});

    const newItem = detailForm as D;

    setDetails((prev) => {
      // Si se esta editando
      if (editingIndex !== null) {
        const updated = [...prev];
        updated[editingIndex] = newItem;
        return updated;
      }

      // Si no hay merge configurado
      if (!mergeDetailBy) {
        return [...prev, newItem];
      }

      const existingIndex = prev.findIndex(
        (item) => item[mergeDetailBy] === newItem[mergeDetailBy],
      );

      if (existingIndex === -1) {
        return [...prev, newItem];
      }

      if (!accumulateField) {
        const updated = [...prev];
        updated[existingIndex] = newItem;
        return updated;
      }

      const updated = [...prev];

      updated[existingIndex] = {
        ...updated[existingIndex],
        [accumulateField]:
          Number(updated[existingIndex][accumulateField] ?? 0) +
          Number(newItem[accumulateField] ?? 0),
      };

      return updated;
    });

    setDetailForm({});
    setEditingIndex(null);
  };

  const removeDetail = (index: number) => {
    setDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const editDetail = (index: number) => {
    const cloned = JSON.parse(JSON.stringify(details[index]));
    setDetailForm(cloned);
    setEditingIndex(index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      ...form,
      ...(detailKey ? { [detailKey]: details } : {}),
    };

    // Inyectar campos con content
    fields.forEach((f) => {
      if (f.content !== undefined) {
        payload[f.name] = f.content;
      }
    });

    onSubmit?.(payload);
  };

  return (
    <div
      className={`fixed inset-0 z-100 flex items-end md:items-center justify-center 
        ${isDarkMode ? "bg-neutral-600/50" : "bg-neutral-900/80"}`}
    >
      <div
        className={`w-full md:max-w-3xl h-[95vh] md:h-auto md:max-h-[90vh] rounded-t-3xl 
          md:rounded-3xl overflow-hidden flex flex-col
          ${isDarkMode ? "bg-(--color-bg)" : "bg-(--color-bg)"}`}
      >
        {/* HEADER */}
        <div className="p-3 flex justify-between items-center bg-gradient text-neutral-200">
          <div className="justify-between flex gap-3 items-center ml-3">
            {HeaderIcon && (
              <HeaderIcon size={30} className="text-neutral-200" />
            )}
            <div>
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-sm">Información del sistema.</p>
            </div>
          </div>
          <button className="mr-3 hover:text-rose-500" onClick={onClose}>
            <CircleX />
          </button>
        </div>

        {/* BODY */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 p-4 md:px-6 space-y-3 overflow-y-auto"
        >
          {/* MAIN FIELDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
            {visibleFields.map((field) => {
              const value =
                field.content !== undefined ? field.content : form[field.name];

              const colSpan = field.colSpan ?? 1;
              const colSpanClass = COL_SPAN_CLASS[colSpan];

              if (field.type === "select") {
                const Icon = field.icon;

                const parentValue = field.dependsOn
                  ? form[field.dependsOn]
                  : undefined;

                const finalOptions =
                  field.dependsOn && field.filterOptions
                    ? field.filterOptions(parentValue, field.options ?? [])
                    : field.options;

                const isDisabled =
                  isReadOnly || (field.dependsOn && !parentValue);

                return (
                  <div key={String(field.name)} className={colSpanClass}>
                    <label className="block mb-1 font-semibold text-(--texto) dark:text-neutral-100">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>

                    <div className="relative">
                      {Icon && (
                        <Icon size={18} className={`absolute left-3 top-1/2 -translate-y-1/2
                          ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}
                        />
                      )}

                      <select
                        disabled={isDisabled}
                        required={field.required}
                        value={String(value ?? "")}
                        onChange={(e) =>
                          handleChange(
                            field.name,
                            e.target.value as unknown as T[keyof T],
                          )
                        }
                        className={`w-full py-2 rounded-xl border appearance-none transition-all duration-300
                          focus:outline-none focus:ring-2 focus:ring-(--secondary) focus:border-(--secondary)
                          ${Icon ? "pl-10" : "pl-4"} pr-10
                          ${isDarkMode
                            ? "bg-(--form) border-(--bordes) text-(--texto)"
                            : "bg-(--form) border-(--bordes) text-(--texto)"
                          }
                          ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
                      >
                        <option value="">Seleccione...</option>
                        {finalOptions?.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              }

              if (field.type === "boolean") {
                const checked = Boolean(value);

                return (
                  <div key={String(field.name)} className={colSpanClass}>
                    {/* LABEL */}
                    <label className="block mb-1 font-semibold text-md text-(--texto)">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1 text-md">*</span>
                      )}
                    </label>

                    {/* CONTROL */}
                    <button
                      type="button"
                      disabled={isReadOnly}
                      onClick={() =>
                        handleChange(field.name, !checked as T[keyof T])
                      }
                      className={`w-full flex items-center justify-between px-4 py-3
                        rounded-xl border transition-all duration-300
                        focus:outline-none focus:ring-2 focus:ring-(--secondary)/50 focus:border-(--secondary)
                        ${isDarkMode
                          ? "bg-(--bg-form) border-neutral-700/30 text-(--texto)"
                          : "bg-(--bg-form) border-neutral-700/30 text-(--texto)"
                        }`}
                    >
                      {/* LEFT */}
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-sm
                            ${checked ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}
                        >
                          ✓
                        </span>
                        <span className="font-medium text-md text-(--texto)">
                          {checked ? "Activo" : "Inactivo"}
                        </span>
                      </div>

                      {/* SWITCH */}
                      <div
                        className={`w-12 h-7 rounded-full relative transition-colors
                          ${checked ? "bg-emerald-500" : "bg-red-500"}`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full
                            transition-transform ${checked ? "translate-x-5" : ""}`}
                        />
                      </div>
                    </button>
                  </div>
                );
              }

              if (field.type === "autocomplete") {
                const Icon = field.icon;

                const parentValue = field.dependsOn
                  ? form[field.dependsOn]
                  : undefined;

                const finalOptions =
                  field.dependsOn && field.filterOptions
                    ? field.filterOptions(parentValue, field.options ?? [])
                    : (field.options ?? []);

                const isDisabled =
                  isReadOnly || (field.dependsOn && !parentValue);

                return (
                  <div key={String(field.name)} className={colSpanClass}>
                    <AutocompleteField
                      label={field.label}
                      value={value as any}
                      options={finalOptions as any}
                      required={field.required}
                      disabled={isDisabled}
                      icon={Icon}
                      isDarkMode={isDarkMode}
                      onChange={(val) =>
                        handleChange(field.name, val as unknown as T[keyof T])
                      }
                    />
                  </div>
                );
}
              
              /* DATE */
              if (field.type === "date") {
                const Icon = field.icon;

                const formatDateForInput = (val: unknown): string => {
                  if (!val) return "";
                  const str = String(val);
                  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
                  const date = new Date(str);
                  if (isNaN(date.getTime())) return "";
                  return date.toISOString().split("T")[0];
                };

                return (
                  <div key={String(field.name)} className={colSpanClass}>
                    <label className="block mb-1 font-semibold text-(--texto) dark:text-neutral-100">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <div className="relative">
                      {Icon && (
                        <Icon
                          size={18}
                          className={`absolute left-3 top-1/2 -translate-y-1/2
                            ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}
                        />
                      )}
                      <input
                        type="date"
                        disabled={isReadOnly}
                        required={field.required}
                        value={formatDateForInput(value)}
                        onChange={(e) =>
                          handleChange(
                            field.name,
                            e.target.value as unknown as T[keyof T],
                          )
                        }
                        className={`w-full py-2 rounded-xl border transition-all duration-300
                          focus:outline-none focus:ring-2 focus:ring-(--secondary) focus:border-(--secondary)
                          ${Icon ? "pl-10" : "pl-4"} pr-4
                          ${isDarkMode
                            ? "bg-(--bg-form) border-(--bordes) text-(--texto)"
                            : "bg-(--bg-form) border-(--bordes) text-(--texto)"}
                          ${isReadOnly ? "opacity-60 cursor-not-allowed" : ""}`}
                      />
                    </div>
                  </div>
                );
              }

              /* Para componente textarea */
              if (field.type === "textarea") {
                const Icon = field.icon;

                return (
                  <div key={String(field.name)} className={colSpanClass}>
                    <label className="block mb-1 font-semibold text-(--texto) dark:text-neutral-100">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>

                    <div className="relative">
                      {Icon && (
                        <Icon
                          size={18}
                          className={`absolute left-3 top-3
                            ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}
                        />
                      )}

                      <textarea
                        disabled={isReadOnly}
                        required={field.required}
                        value={String(value ?? "")}
                        rows={3}
                        onChange={(e) =>
                          handleChange(
                            field.name,
                            e.target.value as unknown as T[keyof T],
                          )
                        }
                        className={`w-full py-2 px-4 rounded-xl border resize-none transition-all duration-300
                          focus:outline-none focus:ring-2 focus:ring-(--secondary) focus:border-(--secondary)
                          ${Icon ? "pl-10" : "pl-4"} pr-4
                          ${ isDarkMode
                            ? "bg-(--bg-form) border-(--bordes) text-(--texto)"
                            : "bg-(--bg-form) border-(--bordes) text-(--texto)"
                          }
                          ${isReadOnly ? "opacity-60 cursor-not-allowed" : ""}`}
                      />
                    </div>
                  </div>
                );
              }

              return (
                <div className={colSpanClass} key={String(field.name)}>
                  <InputField
                    label={field.label}
                    type={field.type ?? "text"}
                    value={String(value ?? "")}
                    disabled={isReadOnly}
                    icon={field.icon}
                    isDarkMode={isDarkMode}
                    required={field.required}
                    inputMode={field.inputMode}
                    onChange={(e) =>
                      handleChange(
                        field.name,
                        e.target.value as unknown as T[keyof T],
                      )
                    }
                  />
                </div>
              );
            })}
          </div>

          {/* DETAIL FORM */}
          {visibleFieldsDetails && (
            <>
              <fieldset className="border rounded-xl px-3 border-(--secondary)/20">
                <legend className="font-bold text-lg text-(--secondary)/80 px-3">Detalles</legend>
                {!isReadOnly && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
                      {visibleFieldsDetails.map((f) => {
                        const value = detailForm[f.name];
                        const colSpan = f.colSpan ?? 1;
                        const colSpanClass = COL_SPAN_CLASS[colSpan];
                        const hasError = detailErrors[String(f.name)];

                        /* SELECT */
                        if (f.type === "select") {
                          const Icon = f.icon;
                        
                          const parentValue = f.dependsOn
                            ? detailForm[f.dependsOn]
                            : undefined;
                        
                          const finalOptions =
                            f.dependsOn && f.filterOptions
                              ? f.filterOptions(parentValue, f.options ?? [])
                              : f.options;
                        
                          const isDisabled =
                            isReadOnly || (f.dependsOn && !parentValue);
                        
                          return (
                            <div key={String(f.name)} className={colSpanClass}>
                              <label className="block mb-1 font-semibold">
                                {f.label}
                              </label>
                          
                              <div className="relative">
                                {Icon && (
                                  <Icon
                                    size={18}
                                    className={`absolute left-3 top-1/2 -translate-y-1/2
                                      ${isDarkMode ? "text-neutral-500": "text-neutral-500"}`}
                                  />
                                )}

                                <select
                                  disabled={isDisabled}
                                  value={String(value ?? "")}
                                  onChange={(e) =>
                                    handleDetailChange(
                                      f.name,
                                      e.target.value as unknown as D[keyof D],
                                    )
                                  }
                                  className={`w-full py-2 rounded-xl border appearance-none transition-all duration-300
                                    focus:outline-none focus:ring-2 focus:ring-(--secondary) focus:border-(--secondary)
                                    ${Icon ? "pl-10" : "pl-4"} pr-10
                                    ${isDarkMode
                                        ? "bg-(--bg-form) border-(--bordes) text-(--texto)"
                                        : "bg-(--bg-form) border-(--bordes) text-(--texto)"
                                    }
                                    ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}
                                    ${hasError ? "border-red-500 ring-1 ring-red-400" : ""}`}
                                >
                                  <option value="">Seleccione...</option>
                                  {finalOptions?.map((o) => (
                                    <option key={o.value} value={o.value}>
                                      {o.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          );
                        }
                        
                        /* BOOLEAN */
                        if (f.type === "boolean") {
                          const checked = Boolean(value);
                          
                          return (
                            <div key={String(f.name)} className={colSpanClass}>
                              {/* LABEL */}
                              <label className="block mb-1 font-semibold">
                                {f.label}
                              </label>
                          
                              {/* CONTROL */}
                              <button
                                type="button"
                                disabled={isReadOnly}
                                onClick={() =>
                                  handleDetailChange(f.name, !checked as T[keyof T])
                                }
                                className={`w-full h-13 flex items-center justify-between px-4
                                  rounded-xl border transition-all duration-300
                                  focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500
                                  ${isDarkMode
                                      ? "bg-slate-800 border-slate-700 text-gray-100"
                                      : "bg-slate-100 border-slate-300 text-gray-900"
                                  }
                                  ${hasError ? "border-red-500 ring-1 ring-red-400" : ""}`}
                              >
                                {/* LEFT */}
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm
                                      ${checked ? "bg-emerald-500 text-white" : "bg-slate-400 text-white"}`}
                                  >
                                    ✓
                                  </span>
                                  <span className="font-medium">
                                    {checked ? "Activo" : "Inactivo"}
                                  </span>
                                </div>
                                    
                                {/* SWITCH */}
                                <div
                                  className={`w-12 h-7 rounded-full relative transition-colors
                                    ${checked ? "bg-emerald-500" : "bg-slate-400"}`}
                                >
                                  <span
                                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full
                                      transition-transform
                                      ${checked ? "translate-x-5" : ""}`}
                                  />
                                </div>
                              </button>
                            </div>
                          );
                        }
                    
                      /* DATE */
                      if (f.type === "date") {
                        const Icon = f.icon;

                        const formatDateForInput = (val: unknown): string => {
                          if (!val) return "";
                          const str = String(val);
                          if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
                          const date = new Date(str);
                          if (isNaN(date.getTime())) return "";
                          return date.toISOString().split("T")[0];
                        };

                        return (
                          <div key={String(f.name)} className={colSpanClass}>
                            <label className="block mb-1 font-semibold">
                              {f.label}
                            </label>
                            <div className="relative">
                              {Icon && (
                                <Icon
                                  size={18}
                                  className={`absolute left-3 top-1/2 -translate-y-1/2
                                    ${isDarkMode ? "text-neutral-500": "text-neutral-500"}`}
                                />
                              )}
                              <input
                                type="date"
                                disabled={isDisabled}
                                required={f.required}
                                value={formatDateForInput(value)}
                                onChange={(e) =>
                                  handleDetailChange(
                                    f.name,
                                    e.target.value as unknown as D[keyof D],
                                  )
                                }
                                className={`w-full py-2 rounded-xl border transition-all duration-300
                                  focus:outline-none focus:ring-2 focus:ring-(--secondary) focus:border-(--secondary)
                                  ${Icon ? "pl-10" : "pl-4"} pr-4
                                  ${isDarkMode
                                    ? "bg-(--bg-form) border-(--bordes) text-(--texto)"
                                    : "bg-(--bg-form) border-(--bordes) text-(--texto)"}
                                  ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}
                                  ${hasError ? "border-red-500 ring-1 ring-red-400" : ""}`}
                              />
                            </div>
                          </div>
                        );
                      }

                      /* AUTOCOMPLETE */
                        if (f.type === "autocomplete") {
                          const Icon = f.icon;
                        
                          const parentValue = f.dependsOn
                            ? detailForm[f.dependsOn]
                            : undefined;
                        
                          const finalOptions =
                            f.dependsOn && f.filterOptions
                              ? f.filterOptions(parentValue, f.options ?? [])
                              : (f.options ?? []);
                        
                          const isDisabled =
                            isReadOnly || (f.dependsOn && !parentValue);
                        
                          return (
                            <div key={String(f.name)} className={colSpanClass}>
                              <AutocompleteField
                                label={f.label}
                                value={value as any}
                                options={finalOptions as any}
                                disabled={isDisabled}
                                icon={Icon}
                                isDarkMode={isDarkMode}
                                onChange={(val) =>
                                  handleDetailChange(
                                    f.name,
                                    val as unknown as D[keyof D],
                                  )
                                }
                              />
                            </div>
                          );
                        }   

/* Para componente textarea */
                        if (f.type === "textarea") {
                        const Icon = f.icon;
                      
                        return (
                          <div key={String(f.name)} className={colSpanClass}>
                            <label className="block mb-1 font-semibold">
                              {f.label}
                            </label>
                        
                            <div className="relative">
                              {Icon && (
                                <Icon
                                  size={18}
                                  className={`absolute left-3 top-3
                                    ${isDarkMode ? "text-neutral-500" : "text-neutral-500"}`}
                                />
                              )}

                              <textarea
                                disabled={isReadOnly}
                                value={String(value ?? "")}
                                rows={3}
                                onChange={(e) =>
                                  handleDetailChange(
                                    f.name,
                                    e.target.value as unknown as D[keyof D],
                                  )
                                }
                                className={`w-full py-2 px-4 rounded-xl border resize-none transition-all duration-300
                                  focus:outline-none focus:ring-2 focus:ring-(--secondary) focus:border-(--secondary)
                                    ${Icon ? "pl-10" : "pl-4"} pr-4
                                    ${isDarkMode
                                      ? "bg-(--bg-form) border-(--bordes) text-(--texto)"
                                      : "bg-(--bg-form) border-(--bordes) text-(--texto)"
                                    }
                                    ${hasError ? "border-red-500 ring-1 ring-red-400" : ""}
                                    ${isReadOnly ? "opacity-60 cursor-not-allowed" : ""}`}
                              />
                            </div>
                          </div>
                        );
                        }
                      
                        /* DEFAULT INPUT */
                        return (
                          <div className={colSpanClass} key={String(f.name)}>
                            <InputField
                              disabled={isReadOnly}
                              label={f.label}
                              type={f.type ?? "text"}
                              value={String(value ?? "")}
                              isDarkMode={isDarkMode}
                              icon={f.icon}
                              onChange={(e) =>
                                handleDetailChange(
                                  f.name,
                                  e.target.value as unknown as D[keyof D],
                                )
                              }
                            />
                          </div>
                        );                      
                      })}
                    </div>
                    <div className="flex flex-col items-center justify-center md:flex-row gap-3">
                      <button
                        type="button"
                        onClick={addDetail}
                        disabled={
                          !Object.values(detailForm).some((v) => {
                            if (typeof v === "string") return v.trim() !== "";
                            return v !== undefined && v !== null;
                          })
                        }
                        className={`btn-guardar m-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100`}
                      >
                        {editingIndex !== null ? "Actualizar" : "Agregar"}
                      </button> 
                    </div>
                  </>
                )} 
                {/* DETAIL TABLE (Desktop) + CARDS (Mobile) */}
                {detailColumns && details.length > 0 && (
                  <>
                    <div className="hidden md:block w-full overflow-x-auto my-2 rounded-xl border border-(--bordes)">
                      <table className={`w-full overflow-hidden text-sm`}>
                        <thead
                          className={`text-[12px] uppercase font-bold 
                            ${isDarkMode
                            ? "bg-neutral-600/50 text-(--texto) "
                            : "bg-olive-400/50 text-(--texto)"
                          }`}
                        >
                          <tr>
                            {detailColumns.map((c) => (
                              <th
                                key={String(c.key)}
                                className="p-3 text-left text-sm font-semibold"
                              >
                                {c.label}
                              </th>
                            ))}
                            {!isReadOnly && (
                              <th className="p-3 text-center">Acciones</th>
                            )}
                          </tr>
                        </thead>                        
                        <tbody>
                          {details.map((row, i) => (
                            <tr
                              key={i}
                              className={`transition md:table-row block                 
                                ${isDarkMode ? "bg-(--bg-form) hover:bg-neutral-700 " 
                                : "bg-(--bg-form) hover:bg-olive-200 border-b border-neutral-200"}
                              `}
                            >
                              {detailColumns.map((c) => (
                                <td key={String(c.key)} className="p-3">
                                  {(() => {
                                    const field = detailFields?.find(
                                      (f) => f.name === c.key,
                                    );
                                
                                    if (field?.type === "select") {
                                      const option = field.options?.find(
                                        (o) => o.value === row[c.key],
                                      );
                                      return option?.label ?? "-";
                                    }
                                
                                    if (field?.type === "autocomplete") {
                                      const option = field.options?.find(
                                        (o) => o.value === row[c.key],
                                      );
                                      return option?.label ?? `${option?.value}`;
                                    }
                                
                                    if (field?.type === "boolean") {
                                      return row[c.key] ? "Sí" : "No";
                                    }
                                
                                    return String(row[c.key] ?? "");
                                  })()}
                                </td>
                              ))}
      
                              {!isReadOnly && (
                                <td className="p-3 flex gap-2 justify-center">
                                  <button
                                    type="button"
                                    onClick={() => editDetail(i)}
                                    className={`p-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500/50
                                    ${isDarkMode
                                      ? "hover:bg-blue-500/20 text-blue-400"
                                      : "hover:bg-blue-100 text-blue-600"
                                    }`}
                                  >
                                    <Pencil size={16} />
                                  </button>
                                  
                                  <button
                                    onClick={() => removeDetail(i)}
                                    type="button"
                                    className={`p-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-red-500/50
                                    ${isDarkMode
                                      ? "hover:bg-red-500/20 text-red-400"
                                      : "hover:bg-red-100 text-red-600"
                                    }`}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* MÓVIL: lista de cards */}
                    <div className="md:hidden my-3 space-y-3">
                      {details.map((row, i) => (
                        <div
                          key={i}
                          className={`rounded-xl border p-3 ${
                            isDarkMode
                              ? "bg-neutral-800/50 border-neutral-700/50"
                              : "bg-(--bg-form) border-(--bordes)"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-(--texto)">
                              {(() => {
                                const first = detailColumns[0];
                                const field = detailFields?.find((f) => f.name === first.key);
                                const val = row[first.key];
                                if (field?.type === "select" || field?.type === "autocomplete") {
                                  const opt = field.options?.find((o) => o.value === val);
                                  return opt?.label ?? String(val ?? `Fila ${i + 1}`);
                                }
                                return String(val ?? `Fila ${i + 1}`);
                              })()}
                            </p>
                            {!isReadOnly && (
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => editDetail(i)}
                                  className={`p-1.5 rounded-lg transition ${
                                    isDarkMode
                                      ? "text-blue-400 hover:bg-blue-500/20"
                                      : "text-blue-600 hover:bg-blue-100"
                                  }`}
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeDetail(i)}
                                  className={`p-1.5 rounded-lg transition ${
                                    isDarkMode
                                      ? "text-red-400 hover:bg-red-500/20"
                                      : "text-red-600 hover:bg-red-100"
                                  }`}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                            {detailColumns.slice(1).map((c) => {
                              const field = detailFields?.find((f) => f.name === c.key);
                              const val = row[c.key];
                              let display = String(val ?? "-");
                              if (field?.type === "select" || field?.type === "autocomplete") {
                                const opt = field.options?.find((o) => o.value === val);
                                display = opt?.label ?? String(val ?? "-");
                              } else if (field?.type === "boolean") {
                                display = val ? "Sí" : "No";
                              }
                              return (
                                <span key={String(c.key)}>
                                  {c.label}:{" "}
                                  <span className="font-medium text-(--texto)">{display}</span>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </fieldset>        
            </>
          )}
          {/* ACTIONS */}
          <div className="flex flex-col items-center justify-center md:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancelar"
            >
              <CircleX size={18} />
              Cancelar
            </button>

            {mode !== "view" && (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-guardar ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
                `}
              >
                <CloudCheck size={18} />
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Guardando...
                  </>
                ) : (
                  "Guardar"
                )}
              </button>
            )}

            {/* VIEW ACTIONS */}
            {mode === "view" &&
              data &&
              viewActions?.map((action) => {
                return (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => action.onClick(data)}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    {action.label}
                  </button>
                );
              })}
          </div>
        </form>
      </div>
    </div>
  );
}
