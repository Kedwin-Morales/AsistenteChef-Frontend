import { useState, useRef } from "react";
import {
  Download,
  FileSpreadsheet,
  X,
  Check,
  ChevronDown,
  CircleX,
} from "lucide-react";
import type { ExportConfig, ExportOptions } from "../types/export.types";
import { exportToExcel } from "../services/export.service";
import { sileo } from "sileo";

interface Props {
  isDarkMode: boolean;
  onClose: () => void;
  config: ExportConfig;
  data: any[];
  onSuccess?: () => void;
  format: boolean,
}

export default function ExportModal({
  isDarkMode,
  onClose,
  config,
  data,
  onSuccess,
  format = false,
}: Props) {
  const [selectedFormat, setSelectedFormat] = useState<"xlsx" | "xls">("xlsx");
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [customFileName, setCustomFileName] = useState(config.fileName);
  const [isExporting, setIsExporting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    try {
      const options: ExportOptions = {
        format: selectedFormat,
        includeHeaders,
        fileName: customFileName.trim() || config.fileName,
      };
      exportToExcel(data, config, options);
      
      if(format){
        sileo.success({
        title: "¡Exportación exitosa!",
        description: "Formato exportado correctamente.",
      });
      }else{
        sileo.success({
        title: "¡Exportación exitosa!",
        description: `${data.length} registros exportados como .${selectedFormat.toUpperCase()}.`,
      });
      }
      
      
      onSuccess?.();
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      sileo.error({
        title: "Error de sistema",
        description: "Error al exportar el archivo.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const bg = isDarkMode
    ? "bg-(--color-bg) text-(--texto)"
    : "bg-(--color-bg) text-(--texto)";
  const border = isDarkMode ? "border-neutral-600" : "border-neutral-200";
  const inputBg = isDarkMode ? "bg-neutral-800" : "bg-white";

  return (
    <div
      className={`fixed inset-0 z-100 flex items-end md:items-center justify-center ${isDarkMode ? "bg-neutral-600/50" : "bg-neutral-900/80"}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full md:max-w-lg h-auto md:h-auto md:max-h-[90vh] rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col ${bg}`}
      >
        {/* HEADER */}
        <div className="p-3 flex justify-between items-center bg-gradient text-neutral-200">
          <div className="flex gap-3 ml-3 items-center">
            <FileSpreadsheet size={30} className="opacity-90" />
            <div>
              <h2 className="text-xl font-bold">{config.title}</h2>
                {!format ? (
                <>
                  <p className="text-sm opacity-90">
                  {data.length} registro(s) listos para exportar
                  </p>
                </>
                ) : (
                <>
                </>
                )}           
            </div>
          </div>
          <button className="mr-3 hover:text-rose-600" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 p-4 md:p-5 overflow-y-auto">
          {!format ? (
            <>
              <div
                className={`flex items-center gap-2 mb-4 p-3 rounded-xl ${isDarkMode ? "bg-neutral-800" : "bg-neutral-200"}`}
              >
                <FileSpreadsheet size={20} className="text-(--secondary)" />
                <span className="font-medium">{data.length} filas a exportar</span>
                </div>
              </>
          ) : (
            <>
            </>
          )}
          
          <div className="space-y-4">
            {/* Format Selection */}
            {/* <div>
              <label className="block text-sm font-medium mb-2">
                Formato de archivo
              </label>
              <div className="relative">
                <button
                  ref={dropdownRef}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border ${border} ${inputBg} text-left`}
                >
                  <span className="capitalize">
                    {selectedFormat.toUpperCase()} {selectedFormat === "xlsx" ? "(Recomendado)" : ""}
                  </span>
                  <ChevronDown 
                    size={18} 
                    className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} 
                  />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute bg-(--bg-form) top-full left-0 right-0 mt-1 z-10 rounded-xl border ${border} ${inputBg} shadow-lg overflow-hidden">
                    {["xlsx", "xls"].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => {
                          setSelectedFormat(fmt as "xlsx" | "xls");
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 ${selectedFormat === fmt ? "bg-(--primary)/10" : ""}`}
                      >
                        <Check 
                          size={16} 
                          className={selectedFormat === fmt ? "text-(--secondary)" : "invisible"} 
                        />
                        <span className="capitalize">
                          {fmt.toUpperCase()} {fmt === "xlsx" ? "(Recomendado)" : "(Legacy)"}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div> */}

            {/* Include Headers */}
            {/* <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="includeHeaders"
                checked={includeHeaders}
                onChange={(e) => setIncludeHeaders(e.target.checked)}
                className="w-5 h-5 text-(--secondary) border-neutral-300 rounded focus:ring-(--secondary)"
              />
              <label htmlFor="includeHeaders" className="text-sm">
                Incluir encabezados de columna
              </label>
            </div> */}

            {/* Custom File Name */}
            <div>
              <label htmlFor="fileName" className="block text-sm font-medium mb-2">
                Nombre del archivo (sin extensión)
              </label>
              <input
                id="fileName"
                type="text"
                value={customFileName}
                onChange={(e) => setCustomFileName(e.target.value)}
                className={`w-full p-3 rounded-xl border ${border} ${inputBg} text-sm`}
                placeholder={config.fileName}
              />
            </div>

            {/* Preview Columns */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Columnas a exportar
              </label>
              <div className={`max-h-48 overflow-y-auto border ${border} rounded-xl p-3 ${inputBg}`}>
                <ul className="space-y-1 text-sm">
                  {config.columns.map((col, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-6 h-6 flex items-center justify-center rounded text-xs font-medium text-(--secondary)">
                        {i + 1}
                      </span>
                      <span>{col.header}</span>
                      {col.formatter && (
                        <span className="text-xs text-neutral-500 ml-auto">(formato)</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          className={`flex flex-col items-center justify-center md:flex-row p-4 gap-3 border-t ${border}`}
        >
          <button
            type="button"
            onClick={onClose}
            className="w-full md:w-30 py-3 flex items-center justify-center gap-2 rounded-xl bg-neutral-500 shadow-lg shadow-orange-500/50 hover:bg-orange-500/70 text-white font-bold"
          >
            <CircleX size={18} />
            Cancelar
          </button>
          {!format ? (
            <>
              <button
                onClick={handleExport}
                disabled={isExporting || data.length === 0}
                className={`w-full md:w-70 py-3 flex items-center justify-center gap-2 rounded-xl     font-bold text-white bg-neutral-500 shadow-lg shadow-blue-500/80    hover:bg-blue-500 transition-all duration-300 ${isExporting || data.  length ===    0 ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02]"}`}
              >
                {isExporting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Exportando...
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    Exportar {data.length} registro(s)
                  </>
                )}
              </button>
            </>
          ) : (
                <>
                  <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className={`w-70 py-3 flex items-center justify-center gap-2 rounded-xl font-bold text-white bg-neutral-500 shadow-lg shadow-blue-500/80 hover:bg-blue-500 transition-all duration-300 ${isExporting ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02]"}`}
                  >
                    {isExporting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Exportando...
                  </>
                   ) : (
                  <>
                    <Download size={18} />
                    Exportar Formato
                  </>
                )}
              </button>
                </>
          )}          
        </div>
      </div>
    </div>
  );
}