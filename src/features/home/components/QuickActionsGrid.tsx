import { Scale, Tags, ChefHat, History } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickAction {
  label: string;
  description: string;
  to: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
}

const actions: QuickAction[] = [
  {
    label: "Pesar Merma",
    description: "Registrar desperdicio",
    to: "/mermas",
    icon: Scale,
  },
  {
    label: "Etiquetas",
    description: "Tipos de ingredientes",
    to: "/tipo-ingredientes",
    icon: Tags,
  },
  {
    label: "Producción",
    description: "Recetas y montajes",
    to: "/recetas",
    icon: ChefHat,
  },
  {
    label: "Historial",
    description: "Registro de mermas",
    to: "/mermas",
    icon: History,
  },
];

export default function QuickActionsGrid() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map(({ label, description, to, icon: Icon }) => (
        <button
          key={label}
          type="button"
          onClick={() => navigate(to)}
          className="card-skew border-b-5 group flex flex-col items-start gap-2 rounded-2xl border border-(--bordes) bg-(--bg-form) p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:bg-gradient hover:text-(--secondary) active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--secondary)"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--primary)/10 text-(--primary) transition-colors duration-300 group-hover:bg-(--secondary)/20 group-hover:text-(--secondary) ">
            <Icon size={20} />
          </span>
          <span className="text-sm font-bold leading-tight">{label}</span>
          <span className="text-xs text-neutral-500 transition-colors duration-300 group-hover:text-(--secondary)/80">
            {description}
          </span>
        </button>
      ))}
    </div>
  );
}
