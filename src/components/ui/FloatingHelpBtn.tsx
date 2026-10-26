import { useState, useEffect, useRef } from "react";
import { Download, BookOpen, X, ChevronRight, MessageCircleQuestionMark } from "lucide-react";
import { useLoginUI } from "@/features/auth/hooks/useLoginUI";
import { startTour } from "@/shared/utils/tours";

export default function FloatingHelpButton() {
  const { isDarkMode } = useLoginUI();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && open) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);


  return (
    <div className="fixed bottom-5 right-2 z-50">
      <div ref={menuRef} className="relative">
        <div
          className={`absolute bottom-14 right-0 w-64 bg-(--bg-form) rounded-2xl shadow-lg shadow-neutral-700 border border-(--bordes) overflow-hidden transition-all duration-300 ease-out ${open ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 translate-y-2 pointer-events-none"}`}
          role="menu"
          style={{ transformOrigin: "bottom right" }}
        >
          <div className="p-1 space-y-2">
            <button
              onClick={() => {
                setOpen(false);
              }}
              className={`group w-full flex items-center gap-3 px-2 py-3 rounded-xl ${isDarkMode ? "text-(--texto)/70 hover:bg-(--secondary)/20" : "text-(--texto)/40 hover:bg-(--secondary)/20"} transition-all duration-200`}
              role="menuitem"
              style={{ animation: open ? "slideIn 0.25s ease-out 0.05s both" : "none" }}
            >
              <div className={`shrink-0 w-10 h-10 rounded-lg ${isDarkMode ? "bg-(--secondary)/40" : "bg-(--secondary)/70"} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <Download size={20} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <span className="text-sm font-semibold text-(--text-info) group-hover:text-(--secondary) block">Manual de Usuario</span>
                <span className={`text-xs ${isDarkMode ? 'text-(--text-info)/60' : 'text-(--text-info)/80'} block mt-0.5`}>Guía de uso paso a paso</span>
              </div>
              <ChevronRight size={16} className="text-(--text-info) group-hover:text-(--secondary) transition-colors" />
            </button>
            <button
              onClick={() => {
                setOpen(false);
                void startTour("nuevoIngrediente");
              }}
              className={`group w-full flex items-center gap-3 px-2 py-3 rounded-xl ${isDarkMode ? "text-(--texto)/70 hover:bg-(--secondary)/20" : "text-(--texto)/40 hover:bg-(--secondary)/20"} transition-all duration-200`}
              role="menuitem"
              style={{ animation: open ? "slideIn 0.25s ease-out 0.1s both" : "none" }}
            >
              <div className={`shrink-0 w-10 h-10 rounded-lg ${isDarkMode ? "bg-(--secondary)/40" : "bg-(--secondary)/70"} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <BookOpen size={20} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <span className="text-sm font-semibold text-(--text-info) group-hover:text-(--secondary) block">¿Nuevo Ingrediente?</span>
                <span className={`text-xs ${isDarkMode ? 'text-(--text-info)/60' : 'text-(--text-info)/80'} block mt-0.5`}>Guía rápida interactiva</span>
              </div>
              <ChevronRight size={16} className="text-(--text-info) group-hover:text-(--secondary) transition-colors" />
            </button>
            <button
              onClick={() => {
                setOpen(false);
                void startTour("nuevaReceta");
              }}
              className={`group w-full flex items-center gap-3 px-2 py-3 rounded-xl ${isDarkMode ? "text-(--texto)/70 hover:bg-(--secondary)/20" : "text-(--texto)/40 hover:bg-(--secondary)/20"} transition-all duration-200`}
              role="menuitem"
              style={{ animation: open ? "slideIn 0.25s ease-out 0.1s both" : "none" }}
            >
              <div className={`shrink-0 w-10 h-10 rounded-lg ${isDarkMode ? "bg-(--secondary)/40" : "bg-(--secondary)/70"} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <BookOpen size={20} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <span className="text-sm font-semibold text-(--text-info) group-hover:text-(--secondary) block">¿Nueva Receta?</span>
                <span className={`text-xs ${isDarkMode ? 'text-(--text-info)/60' : 'text-(--text-info)/80'} block mt-0.5`}>Guía rápida interactiva</span>
              </div>
              <ChevronRight size={16} className="text-(--text-info) group-hover:text-(--secondary) transition-colors" />
            </button>
          </div>
          <style>{`
            @keyframes slideIn {
              from { opacity: 0; transform: translateX(10px); }
              to { opacity: 1; transform: translateX(0); }
            }
            @keyframes rotateIn {
              from { transform: rotate(-90deg); opacity: 0; }
              to { transform: rotate(0deg); opacity: 1; }
            }
            .animate-rotate-in { animation: rotateIn 0.3s ease-out forwards; }
          `}</style>
        </div>
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label={open ? "Cerrar ayuda" : "Abrir ayuda"}
          id="ayuda-flotante"
          className={`relative w-12 h-12 rounded-full flex items-center justify-center shadow-xl border-2 transition-all duration-300 bg-linear-to-br from-blue-500 to-blue-800 hover:from-blue-700 hover:to-blue-800 text-white border-blue-400/50 hover:shadow-2xl ${open ? "scale-110 rotate-90" : "hover:scale-105"}`}
        >
          <div className="transition-all duration-300 ease-out">
            {open ? (
              <X size={26} className="text-white animate-rotate-in" />
            ) : (
              <MessageCircleQuestionMark size={26} className="text-white" />
            )}
          </div>
          <div className={`absolute inset-0 rounded-full bg-white/10 opacity-0 transition-opacity duration-300 ${open ? "opacity-100 animate-pulse" : ""}`} />
        </button>
      </div>
    </div>
  );
}