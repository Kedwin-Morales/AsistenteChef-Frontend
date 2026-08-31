import {
  LogOut,
  ChefHat,
  UserCog,
  Shield,
  HomeIcon,
  ReceiptText,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { SidebarGroup } from "./SidebarGroup";
// import { useState } from "react";
import { useSidebarStore } from "@/stores//sidebar.store";
import { X } from "lucide-react";
import { IoReceiptOutline } from "react-icons/io5";
import { GiCook } from "react-icons/gi";
import { BiDish } from "react-icons/bi";

interface Props {
  isDarkMode: boolean;
  viewMode: "desktop" | "mobile";
  onClose?: () => void;
}

export default function AppSidebar({ isDarkMode, onClose }: Props) {
  const logout = useAuthStore((s) => s.logout);
  // const [openGroup, setOpenGroup] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);
  const openGroup = useSidebarStore((s) => s.openGroup);
  const setOpenGroup = useSidebarStore((s) => s.setOpenGroup);

  return (
    <aside
      className={`w-full h-full border-r flex flex-col p-6 transition-colors duration-300 relative 
        ${isDarkMode ? "bg-(--color-bg) border-(--secondary)/20" : "bg-(--color-bg) border-(--secondary)/20"}`}
    >
      <div className="flex items-center gap-3 justify-center mb-10">
        <div
          className="p-2 rounded-2xl flex items-center justify-center bg-gradient shadow-xl-secondary transform -rotate-3 hover:rotate-0 transition-transform duration-300"
        >
          <ChefHat color="white" size={24} />
        </div>
        <span className="font-extrabold bg-gradient bg-clip-text text-transparent text-xl flex items-center">
          AsistentePRO
        </span>
      </div>

      {/* NAV */}
      <nav className="flex-1 space-y-2 overflow-y-auto">
        <NavItem
          to="/"
          icon={HomeIcon}
          label="Inicio"
          isDarkMode={isDarkMode}
        />
        <NavItem
          to="/recetas"
          icon={IoReceiptOutline}
          label="Recetas"
          isDarkMode={isDarkMode}
        />
        <NavItem
          to="/sub-recetas"
          icon={ReceiptText}
          label="SubRecetas"
          isDarkMode={isDarkMode}
        />
        <NavItem
          to="/montajes"
          icon={BiDish}
          label="Montajes"
          isDarkMode={isDarkMode}
        />
        <NavItem
          to="/maestro"
          icon={GiCook}
          label="Maestro de Cocina"
          isDarkMode={isDarkMode}
        />
        {/* <SidebarGroup
          title="Maestro de Cocina"
          isDarkMode={isDarkMode}
          id="organizacion"
          openGroup={openGroup}
          setOpenGroup={setOpenGroup}
        >
          <NavItem
            to="/maestro"
            icon={CookingPot}
            label="Maestro"
            isDarkMode={isDarkMode}
          />
          <NavItem
            to="/ingredientes"
            icon={ShoppingBasket}
            label="Ingredientes y/o Utensilios"
            isDarkMode={isDarkMode}
          /> 
          <NavItem
            to="/area-preparacion"
            icon={LandPlot}
            label="Aréa de Preparación"
            isDarkMode={isDarkMode}
          />
          <NavItem
            to="/categoria-plato"
            icon={Layers2}
            label="Categoria de Platos"
            isDarkMode={isDarkMode}
          />
          <NavItem
            to="/familia-menu"
            icon={NotebookPen}
            label="Familia de Menú"
            isDarkMode={isDarkMode}
          />                   
          <NavItem
            to="/tipo-ingredientes"
            icon={UtensilsCrossed}
            label="Tipo de Ingredientes"
            isDarkMode={isDarkMode}
          />
          <NavItem
            to="/unidad-medida"
            icon={RulerDimensionLine}
            label="Unidad de Medida"
            isDarkMode={isDarkMode}
          />
          <NavItem
            to="/proveedores"
            icon={Truck}
            label="Proveedores"
            isDarkMode={isDarkMode}
          />
        </SidebarGroup> */}
        {user?.role === "Admin" && (
          <SidebarGroup
            title="Configuracion"
            isDarkMode={isDarkMode}
            id="configuracion"
            openGroup={openGroup}
            setOpenGroup={setOpenGroup}
          >
            <NavItem
              to="/roles"
              icon={Shield}
              label="Roles"
              isDarkMode={isDarkMode}
            />
            <NavItem
              to="/usuario"
              icon={UserCog}
              label="Usuarios"
              isDarkMode={isDarkMode}
            />
          </SidebarGroup>
        )}
      </nav>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:hidden p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          <X size={20} />
        </button>
      )}
      {/* USER INFO */}
      <div className="flex items-center gap-6 mb-3">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
            <span className="text-xl font-semibold text-emerald-800">
              {user?.nombre?.substring(0, 1).toUpperCase()}
            </span>
          </div>
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-green-500"></span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold">{user?.nombre}</span>
          <span className="text-xs text-neutral-400">{user?.role}</span>
        </div>
      </div>

      {/* LOGOUT */}
      <button
        type="button"
        onClick={() => {
          logout();
        }}
        className={`flex items-center gap-6 text-sm hover:text-red-600 
               ${isDarkMode ? "text-(--primary)" : "text-(--secondary)"}`}
      >
        <LogOut size={25} />
        Cerrar Sesión
      </button>
    </aside>
  );
}
interface NavItemProps {
  to: string;
  label: string;
  icon: React.ElementType;
  isDarkMode: boolean;
}

function NavItem({ to, label, icon: Icon, isDarkMode }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `w-full flex text-[15px] items-center gap-3 px-4 py-2 rounded-xl transition-all ${isActive ? (isDarkMode ? "bg-(--secondary) text-neutral-200" : "bg-(--secondary) text-neutral-100") : isDarkMode ? "text-neutral-400 hover:bg-neutral-600 hover:text-neutral-200" : "text-neutral-500 hover:bg-neutral-300 hover:text-neutral-500"}`
      }
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </NavLink>
  );
}
