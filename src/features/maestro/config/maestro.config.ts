import {
  ShoppingBasket,
  UtensilsCrossed,
  LandPlot,
  Copy,
  Layers2,
  Truck,
} from "lucide-react";
import type { FeatureCardProps } from "@/components/ui/FeatureCard";

export interface MaestroModuleConfig extends FeatureCardProps {
  id: string;
  feature: string;
}

export const MAESTRO_MODULES: MaestroModuleConfig[] = [
  {
    id: "ingredientes",
    feature: "Ingredientes",
    title: "Ingredientes e Insumos",
    description:
      "Gestión completa de materias primas, insumos y productos base.",
    icon: ShoppingBasket,
    image: "/background1.webp",
    route: "/ingredientes",
    badge: "IMPORTANTE",
    variant: "highlighted",
  },
  {
    id: "tipo-ingredientes",
    feature: "Tipos",
    title: "Tipo de Ingrediente",
    description:
      "Clasificación jerárquica de ingredientes por naturaleza. Define categorías como proteínas, vegetales, lácteos, secos, entre otros.",
    icon: UtensilsCrossed,
    image: "/background.png",
    route: "/tipo-ingredientes",
  },
  {
    id: "familia-menu",
    feature: "Familias",
    title: "Familias del Menú",
    description:
      "Agrupación estratégica de platos por concepto culinario. Facilita la ingeniería de menús, costeo y análisis de rentabilidad.",
    icon: UtensilsCrossed,
    image: "/background.png",
    route: "/familia-menu",
  },
  {
    id: "area-preparacion",
    feature: "Áreas",
    title: "Áreas de Preparación",
    description:
      "Definición de estaciones y centros de producción. Asignación de responsables, equipos y flujos de trabajo por área operativa.",
    icon: LandPlot,
    image: "/background.png",
    route: "/area-preparacion",
  },
  {
    id: "subrecetas",
    feature: "Subrecetas",
    title: "Subrecetas",
    description:
      "Construcción de preparaciones base reutilizables. Estandarización de rendimientos, costos y procedimientos técnicos anidados.",
    icon: Copy,
    image: "/background.png",
    route: "/subrecetas",
    badge: "Próximamente",
  },
  {
    id: "categoria-plato",
    feature: "Categorías",
    title: "Categoría del Plato",
    description:
      "Taxonomía de platos por momento de consumo, tipo de servicio o concepto gastronómico. Entradas, principales, postres, bebidas.",
    icon: Layers2,
    image: "/background.png",
    route: "/categoria-plato",
  },
  {
    id: "proveedores",
    feature: "Proveedores",
    title: "Proveedores",
    description:
      "Gestión de proveedores homologados, condiciones comerciales, lead times, certificaciones y trazabilidad de abastecimiento.",
    icon: Truck,
    image: "/background.png",
    route: "/proveedores",
  },
];

export const MAESTRO_DASHBOARD_CONFIG = {
  title: "Maestro de Cocina",
  subtitle: "Centro de configuración del sistema gastronómico",
  description:
    "Administra los datos bases que sustentan la funcionalidad del sistema.",
} as const;
