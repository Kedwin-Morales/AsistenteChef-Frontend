import { useState, useRef } from "react";
import {
  Upload,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle,
  Download,
  CircleX,
  FolderSearch,
  TriangleAlert,
} from "lucide-react";
import * as XLSX from "xlsx";
import type {
  ImportConfig,
  ImportResult,
} from "@/shared/utils/import/types/import.types";
import { importEntities } from "@/shared/utils/import/services/import.service";
import { sileo } from "sileo";

type ImportStep = "upload" | "preview" | "result";

interface Props {
  isDarkMode: boolean;
  onClose: () => void;
  config: ImportConfig;
  onSuccess?: () => void;
}

const STOP_WORDS = new Set([
  "de",
  "del",
  "la",
  "el",
  "los",
  "las",
  "un",
  "una",
  "y",
  "e",
  "o",
  "a",
  "en",
  "por",
  "para",
]);

function normalizeHeader(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .split(/[\s_-]+/)
    .filter((w) => !STOP_WORDS.has(w))
    .join("");
}

function buildColumnMapping(
  excelHeaders: string[],
  config: ImportConfig,
): Record<string, string> {
  const mapping: Record<string, string> = {};
  const used = new Set<number>();

  const normalizedExcel = excelHeaders.map((h, i) => ({
    original: h,
    normalized: normalizeHeader(h),
    index: i,
  }));

  const tryMatch = (value: string, field: string) => {
    const normalized = value.toLowerCase().replace(/[\s_-]+/g, "");
    const idx = normalizedExcel.findIndex(
      (eh) => !used.has(eh.index) && eh.normalized === normalized,
    );
    if (idx !== -1) {
      used.add(idx);
      mapping[normalizedExcel[idx].original] = field;
      return true;
    }
    return false;
  };

  for (const col of config.columns) {
    if (tryMatch(col.header, col.field)) continue;
    if (tryMatch(col.field, col.field)) continue;
    for (const alias of col.aliases ?? []) {
      if (tryMatch(alias, col.field)) break;
    }
  }

  return mapping;
}

export default function ImportModal({
  isDarkMode,
  onClose,
  config,
  onSuccess,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<ImportStep>("upload");
  const [excelHeaders, setExcelHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>(
    {},
  );
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["xlsx", "xls"].includes(ext)) {
      sileo.warning({
        title: "¡Atención!",
        description: "Solo se permiten archivos (Excel) .xlsx o .xls",
      });
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const raw: (string | number | undefined)[][] = XLSX.utils.sheet_to_json(
          worksheet,
          { header: 1 },
        );

        if (raw.length < 2) {
          sileo.warning({
            title: "¡Atención!",
            description:
              "Por favor, el archivo debe tener el formato indicado y al menos un registro (Fila).",
          });
          return;
        }

        const headers = (raw[0] ?? [])
          .map((h) => String(h ?? "").trim())
          .filter(Boolean);
        const dataRows = raw
          .slice(1)
          .filter((r) =>
            r.some((cell) => cell !== undefined && String(cell).trim() !== ""),
          );

        if (dataRows.length === 0) {
          //toast.error("El archivo no contiene datos");
          sileo.error({
            title: "Error de sistema",
            description: "El archivo de importación no contiene datos.",
          });
          return;
        }

        const mapping = buildColumnMapping(headers, config);

        const mappedRows = dataRows.map((row) => {
          const obj: Record<string, string> = {};
          for (let i = 0; i < headers.length; i++) {
            const excelHeader = headers[i];
            const fieldName = mapping[excelHeader];
            if (fieldName) {
              obj[fieldName] = String(row[i] ?? "").trim();
            }
          }
          return obj;
        });

        setExcelHeaders(headers);
        setColumnMapping(mapping);
        setRows(mappedRows);
        setStep("preview");
      } catch {
        sileo.error({
          title: "Error de sistema",
          description: "Error al leer el archivo. Verifique sea un formato válido de Excel.",
        });
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleImport = async () => {
    setIsSubmitting(true);
    try {
      const res = await importEntities(config.entityType, rows);
      setResult(res);
      setStep("result");
      if (res.successCount > 0) {
        //toast.success(`${res.successCount} registros importados correctamente`);
        onSuccess?.();
        // Añadimos un retraso de 1.5 segundos (1500ms) antes de cerrar
        setTimeout(() => {
          onClose();
        }, 1500);
        sileo.success({
          title: "¡Operación exitosa!",
          description: `${res.successCount} registros importados correctamente.`,
        });
      }
    } catch {
      sileo.error({
        title: "Error de sistema",
        description: "Error al importar los datos.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const matchedHeaders = excelHeaders.filter((h) => columnMapping[h]);

  const bg = isDarkMode
    ? "bg-(--color-bg) text-(--texto)"
    : "bg-(--color-bg) text-(--texto)";
  const border = isDarkMode ? "border-neutral-600" : "border-neutral-200";
  const tableBg = isDarkMode ? "bg-neutral-600/50" : "bg-olive-400/50";

  return (
    <div
      className={`fixed inset-0 z-100 flex items-end md:items-center justify-center ${isDarkMode ? "bg-neutral-600/50" : "bg-neutral-900/80"}`}
    >
      <div
        className={`w-full md:max-w-4xl h-[90vh] md:h-auto md:max-h-[90vh] rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col ${bg}`}
      >
        {/* HEADER */}
        <div className="p-3 flex justify-between items-center bg-gradient text-neutral-200">
          <div className="flex gap-3 ml-3 items-center">
            <FileSpreadsheet size={30} className="opacity-90" />
            <div>
              <h2 className="text-xl font-bold">{config.title}</h2>
              <p className="text-sm opacity-90">
                {step === "upload" &&
                  "Selecciona un archivo Excel para importar."}
                {step === "preview" &&
                  `Revisa los datos antes de importar (${rows.length} filas)`}
                {step === "result" && "Resultado de la importación"}
              </p>
            </div>
          </div>
          <button className="mr-3 hover:text-rose-600" onClick={onClose}>
            <CircleX />
          </button>
        </div>

        <div className="flex-1 p-4 md:p-5 overflow-y-auto">
          {/* STEP: UPLOAD */}
          {step === "upload" && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed cursor-pointer transition-colors
                ${isDarkMode ? "border-neutral-600 hover:border-blue-500" : "border-neutral-300 hover:border-blue-500"}`}
            >
              <Upload size={48} className="text-blue-500 mb-4" />
              <p className="text-lg font-semibold mb-2">
                Haz clic para seleccionar un archivo.
              </p>
              <p className="text-xl opacity-70">Formatos Excel: .xlsx, .xls</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          )}

          {/* STEP: PREVIEW */}
          {step === "preview" && (
            <>
              <div
                className={`flex items-center gap-2 mb-4 p-3 rounded-xl ${isDarkMode ? "bg-neutral-800" : "bg-neutral-200"}`}
              >
                <FileSpreadsheet size={20} className="text-(--secondary)" />
                <span className="font-medium">{fileName}</span>
                <span className="text-sm opacity-70 ml-auto">
                  {rows.length} filas encontradas.
                </span>
              </div>
              {/* Column mapping info */}
              {excelHeaders.some((h) => !columnMapping[h]) && (
                <div
                  className={`mb-4 p-3 gap-2 flex rounded-xl text-sm ${isDarkMode ? "bg-amber-900/30 text-amber-300" : "bg-amber-100 text-amber-600"}`}
                >
                  <TriangleAlert size={18} />
                  <span className="font-semibold ">
                    Columnas no reconocidas:
                  </span>{" "}
                  {excelHeaders.filter((h) => !columnMapping[h]).join(", ")}
                </div>
              )}
              <p className="text-sm mb-4 opacity-70">{config.description}</p>

              <div className={`overflow-x-auto max-h-96 border rounded-xl overflow-hidde ${border}`}>
                <table className={`w-full ${border}`}>
                  <thead className={tableBg}>
                    <tr>
                      <th className="p-3 text-center font-semibold text-sm">
                        #
                      </th>
                      {matchedHeaders.map((header) => (
                        <th
                          key={header}
                          className="p-3 text-center font-semibold text-sm"
                        >
                          {header}
                          {config.columns.find(
                            (c) => c.field === columnMapping[header],
                          )?.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 50).map((row, i) => (
                      <tr
                        key={i}
                        className={`border-t ${border} ${isDarkMode ? "bg-(--bg-form) hover:bg-neutral-700 " : "bg-(--bg-form) hover:bg-olive-200 border-b border-neutral-200"}`}
                      >
                        <td className="p-3 text-center text-sm opacity-60">
                          {i + 1}
                        </td>
                        {matchedHeaders.map((header) => {
                          const field = columnMapping[header];
                          return (
                            <td
                              key={header}
                              className="p-3 text-center text-sm"
                            >
                              {row[field] ?? "-"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rows.length > 1 && (
                  <p className="text-center text-sm p-3 opacity-60">
                    Mostrando 50 de {rows.length} filas
                  </p>
                )}
              </div>
              <p className="text-sm mt-2 opacity-70">
                Los campos con (*) son requeridos para el registro.
              </p>
            </>
          )}

          {/* STEP: RESULT */}
          {step === "result" && result && (
            <div className="space-y-4">
              <div
                className={`flex gap-4 p-4 rounded-xl ${isDarkMode ? "bg-neutral-800" : "bg-neutral-200"}`}
              >
                <div className="flex-1 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {result.totalRows}
                  </p>
                  <p className="text-sm opacity-70 font-semibold">Total</p>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {result.successCount}
                  </p>
                  <p className="text-sm opacity-70 font-semibold">Correctos</p>
                </div>
                <div className="flex-1 text-center">
                  <p
                    className={`text-2xl font-bold ${result.errorCount > 0 ? "text-red-600" : "text-green-600"}`}
                  >
                    {result.errorCount}
                  </p>
                  <p className="text-sm opacity-70 font-semibold">Errores</p>
                </div>
              </div>

              {result.rows.some((r) => !r.success) && (
                <div
                  className={`overflow-x-auto max-h-64 ${border} rounded-xl overflow-hidden`}
                >
                  <table className={`w-full ${border}`}>
                    <thead className={tableBg}>
                      <tr>
                        <th className="p-3 text-center font-semibold">
                          Fila #
                        </th>
                        <th className="p-3 text-center font-semibold">
                          Estado
                        </th>
                        <th className="p-3 text-center font-semibold">
                          Error: Descripción
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows
                        .filter((r) => !r.success)
                        .map((r) => (
                          <tr
                            key={r.rowIndex}
                            className={`border-t ${border}
                          ${isDarkMode ? "bg-(--bg-form) hover:bg-neutral-700 " : "bg-(--bg-form) hover:bg-olive-200 border-b border-neutral-200"}`}
                          >
                            <td className="p-3 text-center">
                              {r.rowIndex + 1}
                            </td>
                            <td className="p-3 text-center">
                              <span className="inline-flex items-center gap-1 text-red-600">
                                <AlertTriangle size={14} /> Error
                              </span>
                            </td>
                            <td className="p-3 text-sm">{r.error}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {result.rows.filter((r) => r.success).length > 0 && (
                <div className="overflow-x-auto max-h-48 border rounded-xl overflow-hidden">
                  <table className={`w-full ${border}`}>
                    <thead className={tableBg}>
                      <tr>
                        <th className="p-3 text-center font-semibold">Fila</th>
                        <th className="p-3 text-center font-semibold">
                          Estado
                        </th>
                        <th className="p-3 text-center font-semibold">ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows
                        .filter((r) => r.success)
                        .slice(0, 20)
                        .map((r) => (
                          <tr key={r.rowIndex} className={`border-t ${border}`}>
                            <td className="p-3 text-center">
                              {r.rowIndex + 1}
                            </td>
                            <td className="p-3 text-center">
                              <span className="inline-flex items-center gap-1 text-green-600">
                                <CheckCircle size={14} /> OK
                              </span>
                            </td>
                            <td className="p-3 text-sm">{r.entityId}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div
          className={`flex flex-col items-center justify-center md:flex-row p-4 gap-3 border-t ${border}`}
        >
          {step === "upload" && (
            <button
              type="button"
              onClick={onClose}
              className="btn-cancelar"
            >
              <CircleX size={18} />
              Cancelar
            </button>
          )}

          {step === "preview" && (
            <>
              <button
                onClick={() => {
                  setStep("upload");
                  setRows([]);
                  setFileName("");
                  setExcelHeaders([]);
                  setColumnMapping({});
                }}
                className="px-4 h-10 flex items-center justify-center gap-2 rounded-xl bg-neutral-500 shadow-lg shadow-teal-500 hover:bg-teal-500 text-white font-bold"
              >
                <FolderSearch size={18} />
                Cambiar archivo
              </button>
              <button
                onClick={handleImport}
                disabled={isSubmitting}
                className={`btn-guardar ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02]"}`}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Importando...
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    Importar {rows.length} registro(s).
                  </>
                )}
              </button>
            </>
          )}

          {step === "result" && (
            <button
              onClick={onClose}
              className="btn-cancelar"
            >
              <CircleX size={18} />
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
