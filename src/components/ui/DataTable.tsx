import { useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface TableColumn<T> {
  key: string;
  header: string;
  align?: "left" | "center" | "right";
  render: (row: T) => ReactNode;
}

interface Props<T> {
  data: T[];
  columns: TableColumn<T>[];
  rowKey: (row: T) => string;
  isDarkMode?: boolean;
  emptyMessage?: string;
  pageSize?: number;
}

export default function DataTable<T>({
  data,
  columns,
  rowKey,
  isDarkMode = false,
  emptyMessage = "No hay datos disponibles",
  pageSize = 10,
}: Props<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageData = data.slice(start, end);

  const goTo = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div>
      <div className="w-full overflow-x-auto rounded-xl border border-neutral-200">
        <table className="min-w-0 md:min-w-162.5 w-full text-sm">
          <thead className="hidden md:table-header-group">
            <tr
              className={`text-[12px] uppercase font-bold ${
                isDarkMode
                  ? "bg-neutral-600/50 text-(--texto) "
                  : "bg-olive-400/40 text-(--texto)"
              }`}
            >
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 whitespace-nowrap ${
                    col.align === "center"
                      ? "text-center"
                      : col.align === "right"
                        ? "text-right"
                        : "text-left"
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>{emptyMessage}</td>
              </tr>
            ) : (
              pageData.map((row) => (
                <tr
                  key={rowKey(row)}
                  className={`
                      transition
                      md:table-row
                      block                 
                      ${isDarkMode ? "bg-(--bg-form) hover:bg-neutral-700 " : "bg-(--bg-form) hover:bg-olive-200 border-b border-neutral-200"}
                    `}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      data-label={col.header}
                      className={`
                          md:table-cell
                          grid grid-cols-[120px_1fr] md:grid-cols-none 
                          items-center gap-2 py-1.5 px-3 md:px-4 md:py-3
                          before:content-[attr(data-label)]
                          md:before:hidden
                          ${col.align === "center" ? "md:text-center" : col.align === "right" ? "md:text-right" : "md:text-left"}
                        `}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data.length > pageSize && (
        <div
          className={`flex items-center justify-between mt-4 text-sm ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}
        >
          <span>
            {start + 1}-{Math.min(end, data.length)} de {data.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goTo(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed ${
                isDarkMode ? "hover:bg-neutral-600" : "hover:bg-neutral-300"
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => goTo(p)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  p === currentPage
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
              onClick={() => goTo(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed ${
                isDarkMode ? "hover:bg-neutral-600" : "hover:bg-neutral-300"
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
