import { Eye, Pencil, Ban, CircleCheckBig, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import React from "react";

/* ================= BADGE TYPES ================= */

type BadgeVariant = "neutral" | "success" | "danger" | "warning" | "info" | "accent";

interface BadgeItem {
  label: string | undefined;
  variant?: BadgeVariant;
}

/* ================= PROPS ================= */

interface DataCardListProps<T> {
  data: T[];
  getKey: (row: T) => string;
  title: (row: T) => string | undefined;
  subtitle?: (row: T) => string | undefined;
  badges?: (row: T) => BadgeItem[] | string[];
  renderExtra?: (row: T) => React.ReactNode;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  isActive?: (row: T) => boolean;
  emptyMessage?: string;
  isDarkMode?: boolean;
  pageSize?: number;
}

/* ================= BADGE STYLE HELPER ================= */

function getBadgeStyles(
  variant: BadgeVariant = "neutral",
  isDarkMode?: boolean,
) {
  const base = "px-2.5 py-1 text-xs font-semibold rounded-lg border";

  const variants = {
    neutral: isDarkMode
      ? "bg-neutral-800 border-neutral-700 text-neutral-200"
      : "bg-neutral-100 border-neutral-200 text-neutral-700",

    success: isDarkMode
      ? "bg-emerald-900/40 border-emerald-700 text-emerald-300"
      : "bg-emerald-50 border-emerald-200 text-emerald-700",

    danger: isDarkMode
      ? "bg-red-900/40 border-red-700 text-red-300"
      : "bg-red-50 border-red-200 text-red-700",

    warning: isDarkMode
      ? "bg-amber-900/40 border-amber-700 text-amber-300"
      : "bg-amber-50 border-amber-200 text-amber-700",

    info: isDarkMode
      ? "bg-blue-900/40 border-blue-700 text-blue-300"
      : "bg-blue-50 border-blue-200 text-blue-700",

    accent: isDarkMode
      ? "bg-purple-900/30 text-purple-300 border border-purple-700/50"
      : "bg-purple-100 text-purple-800 border border-purple-200",
  };

  return `${base} ${variants[variant]}`;
}

/* ================= COMPONENT ================= */

export default function DataCardList<T>({
  data,
  getKey,
  title,
  subtitle,
  badges,
  renderExtra,
  onView,
  onEdit,
  onDelete,
  isActive,
  emptyMessage = "No hay registros",
  isDarkMode,
  pageSize = 4,
}: DataCardListProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  const pageData = data.slice(start, end);

  const goTo = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (!data.length) {
    return (
      <div className="text-center text-sm text-slate-500 py-8">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pageData.map((row) => {
        const badgeData = badges?.(row);
        const rowActivo = isActive
          ? isActive(row)
          : Boolean((row as Record<string, unknown>).activo);

        return (
          <div
            key={getKey(row)}
            className={`rounded-2xl p-5 border border-b-5 transition-all duration-200 ${
              isDarkMode
                ? "bg-(--bg-form) border-(--bordes)"
                : "bg-(--bg-form) border-(--bordes)"
            }`}
          >
            {/* HEADER */}
            <div>
              <h3 className="font-semibold text-base">{title(row)}</h3>

              {subtitle && (
                <p className="text-sm text-slate-500 mt-1">{subtitle(row)}</p>
              )}
            </div>

            {/* BADGES */}
            {badgeData && badgeData.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {badgeData.map((badge, index) => {
                  if (typeof badge === "string") {
                    return (
                      <span
                        key={index}
                        className={getBadgeStyles("neutral", isDarkMode)}
                      >
                        {badge}
                      </span>
                    );
                  }

                  return (
                    <span
                      key={index}
                      className={getBadgeStyles(badge.variant, isDarkMode)}
                    >
                      {badge.label}
                    </span>
                  );
                })}
              </div>
            )}

            {/* EXTRA CONTENT */}
            {renderExtra && (
              <div
                className={`mt-4 text-sm ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}
              >
                {renderExtra(row)}
              </div>
            )}

            {/* ACTIONS */}
            {(onView || onEdit || onDelete) && (
              <div className="mt-5 flex justify-end gap-3">
                {onView && (
                  <button
                    onClick={() => onView(row)}
                    className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition"
                  >
                    <Eye size={18} />
                  </button>
                )}

                {onEdit && (
                  <button
                    onClick={() => onEdit(row)}
                    className="p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl transition"
                  >
                    <Pencil size={18} />
                  </button>
                )}

                {onDelete && (
                  <button
                    onClick={() => onDelete(row)}
                    className={`p-2 rounded-xl transition ${
                      rowActivo
                        ? "text-red-500 bg-red-50 hover:bg-red-100"
                        : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                    }`}
                  >
                    {rowActivo ? (
                      <Ban size={16} />
                    ) : (
                      <CircleCheckBig size={16} />
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {data.length > pageSize && (
        <div
          className={`flex items-center justify-between mt-4 text-sm ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}
        >
          <span>
            {start + 1}-{Math.min(end, data.length)} de {data.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goTo(safePage - 1)}
              disabled={safePage === 1}
              className={`p-2 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed ${
                isDarkMode ? "hover:bg-neutral-600" : "hover:bg-neutral-300"
              }`}
              aria-label="Página anterior"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => goTo(p)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  p === safePage
                    ? "bg-(--secondary) text-white"
                    : isDarkMode
                      ? "hover:bg-neutral-600"
                      : "hover:bg-neutral-300"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => goTo(safePage + 1)}
              disabled={safePage === totalPages}
              className={`p-2 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed ${
                isDarkMode ? "hover:bg-neutral-600" : "hover:bg-neutral-300"
              }`}
              aria-label="Página siguiente"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
