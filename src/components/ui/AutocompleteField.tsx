import { useState, useMemo, useRef, useEffect } from "react";
import type { LucideIcon } from "lucide-react";

interface Option {
  label: string;
  value: string | number;
}

interface Props {
  label: string;
  value?: string | number;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  isDarkMode?: boolean;
  onChange: (value: string | number) => void;
}

export default function AutocompleteField({
  label,
  value,
  options,
  required,
  disabled,
  icon: Icon,
  isDarkMode,
  onChange,
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = useMemo(
    () => options.find((o) => o.value === value),
    [value, options]
  );

  const displayValue = open ? query : selectedOption?.label ?? "";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    return options.filter((o) =>
      o.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, options]);

  return (
    <div
      className="relative w-full"
      ref={wrapperRef}
    >
      <label
        className={`block mb-1 font-semibold text-md ${
          isDarkMode ? "text-(--primary)" : "text-(--primary)"
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div
        className={`
          relative rounded-xl border transition-all duration-300
          ${isDarkMode ? "border-slate-700 bg-slate-800" : "border-slate-300 bg-white"}
          focus-within:ring-2 focus-within:ring-amber-400/50 focus-within:border-amber-500
        `}
      >
        {Icon && (
          <Icon
            size={18}
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              isDarkMode ? "text-slate-400" : "text-slate-500"
            }`}
          />
        )}

        <input
          type="text"
          disabled={disabled}
          required={required}
          value={displayValue}
          onFocus={() => {
            setOpen(true);
            setQuery(selectedOption?.label ?? "");
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          className={`
            w-full py-3 pr-4 ${Icon ? "pl-10" : "pl-4"} text-md
            bg-transparent outline-none border-none
            text-slate-900 dark:text-slate-100 placeholder:text-slate-400
          `}
        />
      </div>

      {open && filtered.length > 0 && (
        <div
          className={`
            absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-xl border shadow-lg transition-all
            ${isDarkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-slate-200"}
          `}
        >
          {filtered.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setQuery(option.label);
                setOpen(false);
              }}
              className={`
                px-4 py-2 cursor-pointer transition-colors duration-200
                rounded-lg
                ${isDarkMode
                  ? "hover:bg-amber-500/30 hover:text-white"
                  : "hover:bg-amber-500/20 hover:text-amber-900"}
              `}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}