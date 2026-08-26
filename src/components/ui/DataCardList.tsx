import { Eye, Pencil, Ban, CircleCheckBig } from "lucide-react";
import React from "react";

/* ================= BADGE TYPES ================= */

type BadgeVariant =
  | "neutral"
  | "success"
  | "danger"
  | "warning"
  | "info";

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
}

/* ================= BADGE STYLE HELPER ================= */

function getBadgeStyles(
  variant: BadgeVariant = "neutral",
  isDarkMode?: boolean
) {
  const base = "px-2.5 py-1 text-xs font-semibold rounded-lg border";

  const variants = {
    neutral: isDarkMode
      ? "bg-slate-800 border-slate-700 text-slate-200"
      : "bg-slate-100 border-slate-200 text-slate-700",

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
}: DataCardListProps<T>) {
  if (!data.length) {
    return (
      <div className="text-center text-sm text-slate-500 py-8">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((row) => {
        const badgeData = badges?.(row);
        const rowActivo = isActive ? isActive(row) : Boolean((row as Record<string, unknown>).activo);

        return (
          <div
            key={getKey(row)}
            className={`rounded-2xl p-5 border transition-all duration-200 ${
              isDarkMode
                ? "bg-slate-900/40 border-slate-800"
                : "bg-white border-slate-100 shadow-sm hover:shadow-md"
            }`}
          >
            {/* HEADER */}
            <div>
              <h3 className="font-semibold text-base">
                {title(row)}
              </h3>

              {subtitle && (
                <p className="text-sm text-slate-500 mt-1">
                  {subtitle(row)}
                </p>
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
                        className={getBadgeStyles(
                          "neutral",
                          isDarkMode
                        )}
                      >
                        {badge}
                      </span>
                    );
                  }

                  return (
                    <span
                      key={index}
                      className={getBadgeStyles(
                        badge.variant,
                        isDarkMode
                      )}
                    >
                      {badge.label}
                    </span>
                  );
                })}
              </div>
            )}

            {/* EXTRA CONTENT */}
            {renderExtra && (
              <div className="mt-4 text-sm">
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
                        ? 'text-red-500 bg-red-50 hover:bg-red-100'
                        : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                    }`}
                  >
                    {rowActivo ? <Ban size={16} /> : <CircleCheckBig size={16} />}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}