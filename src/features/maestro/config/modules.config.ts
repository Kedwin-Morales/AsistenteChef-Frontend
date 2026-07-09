import type { LucideIcon } from "lucide-react";
import {
  Package,
  UtensilsCrossed,
  Factory,
  ChefHat,
  Tag,
  TagIcon,
  Truck,
} from "lucide-react";

export interface ModuleConfig {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  image: string;
  route: string;
  badge?: string;
  variant?: "default" | "highlighted";
}

export const modules: ModuleConfig[] = [
  {
    id: "ingredientes",
    title: "Ingredientes e Insumos",
    description:
      "Gestión completa de materias primas, insumos y productos base para la operación culinaria.",
    icon: Package,
    image: "/background.png",
    route: "/ingredientes",
    badge: "Core",
    variant: "highlighted",
  },
  {
    id: "familia-menu",
    title: "Familias del Menú",
    description:
      "Organización jerárquica de familias y subfamilias para estructurar la oferta gastronómica.",
    icon: UtensilsCrossed,
    image: "/background.png",
    route: "/familia-menu",
    badge: "Estructura",
    variant: "default",
  },
  {
    id: "area-preparacion",
    title: "Áreas de Preparación",
    description:
      "Configuración de estaciones y zonas de trabajo en cocina para optimizar flujos de producción.",
    icon: Factory,
    image: "/background.png",
    route: "/area-preparacion",
    badge: "Operaciones",
    variant: "default",
  },
  {
    id: "subrecetas",
    title: "Subrecetas",
    description:
      "Creación y gestión de preparaciones base reutilizables para estandarizar recetas complejas.",
    icon: ChefHat,
    image: "/background.png",
    route: "/subrecetas",
    badge: "Próximamente",
    variant: "default",
  },
  {
    id: "categoria-plato",
    title: "Categoría del Plato",
    description:
      "Clasificación tipológica de platos para menús, costos y análisis de rendimiento por categoría.",
    icon: Tag,
    image: "/background.png",
    route: "/categoria-plato",
    badge: "Clasificación",
    variant: "default",
  },
  {
    id: "tipo-ingrediente",
    title: "Tipo de Ingrediente",
    description:
      "Taxonomía de ingredientes para control de inventario, compras y análisis nutricional.",
    icon: TagIcon,
    image: "/background.png",
    route: "/tipo-ingredientes",
    badge: "Taxonomía",
    variant: "default",
  },
  {
    id: "proveedores",
    title: "Proveedores",
    description:
      "Gestión de proveedores, condiciones comerciales, catálogos y trazabilidad de abastecimiento.",
    icon: Truck,
    image: "/background.png",
    route: "/proveedores",
    badge: "Supply Chain",
    variant: "highlighted",
  },
];

export const modulesConfig = {
  title: "Maestro de Cocina",
  subtitle: "Centro de configuración y administración del sistema gastronómico.",
  modules,
};