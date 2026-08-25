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
      className="relative w-full z-10"
      ref={wrapperRef}
    >
      <label
        className={`z-10 mb-1 font-semibold text-md ${
          isDarkMode ? "text-(--texto)" : "text-(--texto)"
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div
        className={`
          relative rounded-xl border transition-all duration-300
          ${isDarkMode ? "border-(--bordes) bg-(--bg-form)" : "border-(--bordes) bg-(--bg-form)"}
          focus-within:ring-2 focus-within:ring-(--secondary) focus-within:border-(--secondary)
        `}
      >
        {Icon && (
          <Icon
            size={18}
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              isDarkMode ? "text-neutral-500" : "text-neutral-500"
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
            w-full py-2 ${Icon ? "pl-10" : "pl-4"} text-md
            bg-transparent outline-none border-none
            text-(--texto) placeholder:text-neutral-500
          `}
        />
      </div>

      {open && filtered.length > 0 && (
        <div
          className={` 
            relative sm:absolute z-1000 mt-1 mb-1 w-full max-h-60 overflow-auto rounded-xl border shadow-lg transition-all
            ${isDarkMode
              ? "bg-(--bg-form) border-(--bordes)"
              : "bg-(--bg-form) border-(--bordes)"}
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
                px-4 py-2 text-sm cursor-pointer transition-colors duration-200                
                ${isDarkMode
                  ? "hover:bg-(--secondary)/20 hover:text-(--secondary)"
                  : "hover:bg-(--secondary)/20 hover:text-(--secondary)"}
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