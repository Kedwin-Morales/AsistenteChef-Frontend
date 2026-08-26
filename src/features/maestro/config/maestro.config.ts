import {
  ShoppingBasket,
  UtensilsCrossed,
  LandPlot,
  RulerDimensionLine,
  Layers2,
  Truck,
  MessagesSquare,
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
    title: "Ingredientes y/o Utensilios",
    description:
      "Gestión completa de materias primas, utensilios y productos base.",
    icon: ShoppingBasket,
    image: "/imgMaestro/ingredientes.png",
    route: "/ingredientes",
    badge: "IMPORTANTE",
    variant: "highlighted",
  },
    {
    id: "area-preparacion",
    feature: "Áreas",
    title: "Áreas de Preparación",
    description:
      "Definición de estaciones y centros de producción. Asignación de responsables, equipos y flujos de trabajo por área operativa.",
    icon: LandPlot,
    image: "/imgMaestro/area-preparacion.png",
    route: "/area-preparacion",
  },
  {
    id: "categoria-plato",
    feature: "Categorías",
    title: "Categoría del Plato",
    description:
      "Taxonomía de platos o concepto gastronómico: Entradas, Platos Principales, Postres, Bebidas.",
    icon: Layers2,
    image: "/imgMaestro/categoria-plato.png",
    route: "/categoria-plato",
  },
  {
    id: "consejos",
    feature: "Consejos",
    title: "Consejos",
    description:
      "Gestión de consejos del sistema.",
    icon: MessagesSquare,
    image: "/imgMaestro/consejo.png",
    route: "/consejos",
  },
  {
    id: "familia-menu",
    feature: "Familias",
    title: "Familias del Menú",
    description:
      "Agrupación estratégica de las recetas por concepto culinario. Facilita la ingeniería de menús y la asignación por área.",
    icon: UtensilsCrossed,
    image: "/imgMaestro/familia-menu.png",
    route: "/familia-menu",
  },
  {
    id: "proveedores",
    feature: "Proveedores",
    title: "Proveedores",
    description:
      "Gestión de proveedores homologados, condiciones comerciales, certificaciones y trazabilidad de abastecimiento.",
    icon: Truck,
    image: "/imgMaestro/proveedores.png",
    route: "/proveedores",
  },
  {
    id: "tipo-ingredientes",
    feature: "Tipos",
    title: "Tipo de Ingrediente",
    description:
      "Clasificación jerárquica de ingredientes por naturaleza. Define categorías como: proteínas, vegetales, lácteos, secos, entre otros.",
    icon: UtensilsCrossed,
    image: "/imgMaestro/tipo-ingrediente.png",
    route: "/tipo-ingredientes",
  },
  {
    id: "unidad-medida",
    feature: "Unidad de Medida",
    title: "Unidad de Medida",
    description:
      "Gestión de unidades de medidas y trazabilidad de ingredientes.",
    icon: RulerDimensionLine,
    image: "/imgMaestro/unidad-medida.png",
    route: "/unidad-medida",
  },
  // {
  //   id: "subrecetas",
  //   feature: "Subrecetas",
  //   title: "Subrecetas",
  //   description:
  //     "Construcción de preparaciones base reutilizables. Estandarización de rendimientos, costos y procedimientos técnicos anidados.",
  //   icon: Copy,
  //   image: "/imgMaestro/subrecetas.png",
  //   route: "/subrecetas",
  //   badge: "Próximamente",
  // },
];

export const MAESTRO_DASHBOARD_CONFIG = {
  title: "Maestro de Cocina",
  subtitle: "Centro de configuración del sistema gastronómico",
  description:
    "Administra los datos bases que sustentan la funcionalidad del sistema.",
} as const;
