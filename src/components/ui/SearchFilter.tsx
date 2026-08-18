import type { ChangeEvent, ReactNode } from "react";
import { Search } from "lucide-react";
import ScrollReveal from '@/components/ui/ScrollReveal';
export interface SelectOption<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface Props<T extends string> {
  filterValue: T;
  searchValue: string;

  options: SelectOption<T>[];

  placeholder?: string;
  isDarkMode?: boolean;

  onFilterChange: (value: T) => void;
  onSearchChange: (value: string) => void;
}

export default function SearchFilter<T extends string>({
  filterValue,
  searchValue,
  options,
  placeholder = "Buscar...",
  isDarkMode = false,
  onFilterChange,
  onSearchChange,
}: Props<T>) {
  return (
    <ScrollReveal>
      <div className="w-full flex justify-center items-center pb-3">
        <div className="flex flex-col sm:flex-row gap-3 min-w-full sm:min-w-2xl">
          {/* SELECT */}
          <select
            value={filterValue}
            id="framework-select"
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onFilterChange(e.target.value as T)
            }
            className={`border-b-5 border-(--bordes)
              min-w-[30%] px-4 h-12 items-center rounded-xl transition-all 
              outline-none 
              ${
                isDarkMode
                  ? "bg-(--bg-form) border-neutral-600 text-neutral-100"
                  : "bg-(--bg-form) border-neutral-200 text-neutral-900"
              }
            `}
          >
            {options.map((opt) => (
              <option className="option" key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* INPUT */}
          <div className="relative w-full">
            <Search
              size={20}
              className={`absolute left-3 top-[45%] -translate-y-1/2 pointer-events-none 
          ${isDarkMode ? "text-neutral-300" : "text-neutral-500"}
        `}
            />

            <input
              value={searchValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onSearchChange(e.target.value)
              }
              placeholder={placeholder}
              className={`w-full pl-10 pr-4 h-12 rounded-xl border-b-5 border-(--bordes)  transition-all outline-none
                ${
                  isDarkMode
                    ? "bg-(--bg-form) border-neutral-600 text-neutral-100 placeholder-neutral-300"
                    : "bg-(--bg-form) border-neutral-200 text-neutral-900"
                }`}
            />
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
