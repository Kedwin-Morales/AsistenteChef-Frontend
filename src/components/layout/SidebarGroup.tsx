import { ChevronDown } from "lucide-react";

interface SidebarGroupProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isDarkMode: boolean;
  openGroup: string | null;
  setOpenGroup: (id: string | null) => void;
}

export function SidebarGroup({
  id,
  title,
  children,
  isDarkMode,
  openGroup,
  setOpenGroup,
}: SidebarGroupProps) {
  const isOpen = openGroup === id;

  return (
    <div>
      {/* HEADER */}
      <button
        type="button"
        onClick={() => setOpenGroup(isOpen ? null : id)}
        className={`
          w-full flex items-center justify-between
          px-3 py-2 text-xs font-bold tracking-widest uppercase
          transition-colors rounded-xl
          ${isDarkMode
            ? "text-neutral-400 hover:bg-neutral-600 hover:text-neutral-200"
            : "text-neutral-500 hover:bg-neutral-300 hover:text-neutral-500"}
        `}
      >
        <span>{title}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* CONTENT (animated) */}
      <div
        className={`
          overflow-hidden transition-all duration-300
          ${isOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="mt-2 space-y-1">
          {children}
        </div>
      </div>
    </div>
  );
}
