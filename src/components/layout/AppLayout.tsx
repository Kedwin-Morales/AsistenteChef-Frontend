import { LogOut, Moon, Sun } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useLoginUI } from "@/features/auth/hooks/useLoginUI";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
interface Props {
  children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
  const logout = useAuthStore(s => s.logout);
  const { isDarkMode, toggleDarkMode } = useLoginUI();
  const user = useAuthStore(s => s.user);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  return (
    <div
      className={`min-h-screen flex transition-colors duration-300 relative
        ${isDarkMode ? "bg-(--color-bg) text-white" : "bg-(--color-bg) text-slate-900"}
      `}
    >
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed md:relative inset-y-0 left-0 w-full md:w-72 z-50
          transform transition-transform duration-300    
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}    
          md:translate-x-0`}
      ></div>

      {/* RIGHT COLUMN */}
      <div className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <header className={`h-16 flex items-center px-6`}>
          {/* ESPACIO IZQUIERDO VACÍO */}
          <div className="flex items-center gap-4 flex-1">
            {/* BOTÓN HAMBURGUESA (solo móvil) */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <Menu size={22} />
            </button>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4">
            {/* USER INFO */}
            <div className="flex flex-col text-center leading-tight">
              <span className="text-base font-semibold">{user?.nombre}</span>
              <span className="text-xs text-slate-500">{user?.role}</span>
            </div>

            {/* DARK MODE BUTTON */}
            <button
              onClick={toggleDarkMode}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition
              ${isDarkMode ? 'bg-yellow-600 text-slate-900 hover:bg-(--secondary)' : 'bg-neutral-700 text-white hover:bg-neutral-500'}`}
              aria-label="Cambiar modo"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* LOGOUT */}
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className={`flex items-center gap-2 text-sm  hover:text-red-600   ${
                isDarkMode ? "text-(--primary)" : "text-(--primary)"
              }
      `}
            >
              <LogOut size={18} />
              Cerrar Sesión
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
