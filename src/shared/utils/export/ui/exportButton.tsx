import { Download, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import ExportModal from "./exportModal";
import type { ExportConfig } from "../types/export.types";

interface Props {
  isDarkMode: boolean;
  config: ExportConfig;
  data: any[];
  onSuccess?: () => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  format: boolean;
}

export default function ExportButton({
  isDarkMode,
  config,
  data,
  onSuccess,
  className = "",
  children,
  disabled = false,
  format = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  if (format) {
    return (
      <>
        <button 
          type="button"
          onClick={() => setIsOpen(true)}  
          className={`flex items-center justify-center gap-2 text-(--secondary) hover:text-(--primary) bg-transparent border-transparent 
                    ${isDarkMode ? "hover:bg-(--secondary)/20" : "hover:bg-(--secondary)/20"} 
                    font-medium rounded-xl text-sm px-4 py-2`} 
        >
          <Download size={18} />
          Exportar Formato (Excel)
        </button>
        {isOpen && (
          <ExportModal
            isDarkMode={isDarkMode}
            onClose={() => setIsOpen(false)}
            config={config}
            data={data}
            onSuccess={onSuccess}
            format={true}
          />
        )}
      </>
    );
  }else
  {
    if (disabled || data.length === 0) {
      return (
        <button
          type="button"
          disabled
          className={`flex items-center justify-center gap-2 text-neutral-500
                    bg-transparent border-transparent hover:bg-neutral-500/20           
                    font-medium rounded-xl text-sm px-4 py-2`}
        >
          {children || (
            <>
              <FileSpreadsheet size={18} />
              <span>Exportar Datos (Excel)</span>
            </>
          )}
        </button>
      );
    }
    return (
      <>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`flex items-center justify-center gap-2 text-(--secondary) hover:text-(--primary) bg-transparent border-transparent 
                    ${isDarkMode ? "hover:bg-(--secondary)/20" : "hover:bg-(--secondary)/20"} 
                    font-medium rounded-xl text-sm px-4 py-2 ${className}`}
        >
          {children || (
            <>
              <Download size={18} />
              <span>Exportar Datos (Excel)</span>
            </>
          )}
        </button>

        {isOpen && (
          <ExportModal
            isDarkMode={isDarkMode}
            onClose={() => setIsOpen(false)}
            config={config}
            data={data}
            onSuccess={onSuccess}
            format={false}
          />
        )}
      </>
    );
  }
}