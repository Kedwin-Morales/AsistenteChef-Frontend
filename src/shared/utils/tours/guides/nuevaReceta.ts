import type { TourDefinition } from "../types";
import { isMobile } from "../core/environment";
import { SELECTORS } from "./selectors";

export const nuevaReceta: TourDefinition = {
  id: "nuevaReceta",
  steps: [
    {
      id: "intro",
      mode: "info",
      title: "Nueva receta",
      description:
        "Te guío por el asistente de creación de recetas con sus 3 pasos: Información base, Ingredientes y Preparación.",
    },
    {
      id: "abrir-recetas",
      mode: "action",
      target: () =>
        isMobile() ? SELECTORS.menuHamburguesa : SELECTORS.navRecetas,
      title: () => (isMobile() ? "Abre el menú lateral" : "Entra a Recetas"),
      description: () =>
        isMobile()
          ? "Pulsa el icono del menú para mostrar las opciones del sistema."
          : "Pulsa «Recetas» en el menú lateral.",
    },
    {
      id: "nav-recetas-movil",
      mode: "action",
      when: isMobile,
      target: SELECTORS.navRecetas,
      title: "Recetas",
      description: "Ahora entra a «Recetas».",
    },
    {
      id: "cerrar-menu-movil",
      mode: "action",
      when: isMobile,
      target: SELECTORS.menuCerrar,
      title: "Cierra el menú",
      description: "Ciérralo para ver el contenido de la página.",
    },
    {
      id: "receta-nueva",
      mode: "action",
      route: "/recetas",
      target: SELECTORS.recetaNueva,
      title: "Crear receta",
      description: "Pulsa «Nuevo» para abrir el asistente de Recetas.",
    },
    {
      id: "intro-wizard",
      mode: "info",
      route: "/recetas/nueva",
      target: SELECTORS.recetaWizard,
      title: "Crear Receta - Dividido en 3 secciones",
      description:
        "1) Información base, 2) Ingredientes y 3) Método de Preparación.",
    },
    {
      id: "paso1-titulo",
      mode: "info",
      route: "/recetas/nueva",
      target: SELECTORS.recetaWizard,
      title: "1. Información base",
      description:
        "En esta sección defines la información principal de la receta. Los campos marcados con (*) son obligatorios para poder continuar.",
    },
    {
      id: "paso1-nombre",
      mode: "info",
      route: "/recetas/nueva",
      target: SELECTORS.recetaNombre,
      title: "Nombre",
      description:
        "Completa el nombre con el que identificarás esta receta (Campo Requerido).",
      waitFor: 180,
    },
    {
      id: "paso1-familia",
      mode: "info",
      route: "/recetas/nueva",
      target: SELECTORS.recetaFamiliaMenu,
      title: "Familia del Menú",
      description:
        "Selecciona la familia a la que pertenece la receta (Campo Requerido).",
      waitFor: 180,
    },
    {
      id: "paso1-area",
      mode: "info",
      route: "/recetas/nueva",
      target: SELECTORS.recetaAreaPreparacion,
      title: "Área de Preparación",
      description:
        "Indica el Área donde se prepara esta receta (Campo Requerido).",
      waitFor: 180,
    },
    {
      id: "paso1-siguiente",
      mode: "action",
      route: "/recetas/nueva",
      target: SELECTORS.recetaSiguiente,
      title: "Siguiente",
      description:
        "Cuando hayas completado los campos obligatorios, pulsa «Siguiente» para pasar al siguiente paso.",
    },
    {
      id: "paso2-titulo",
      mode: "info",
      route: "/recetas/nueva",
      target: SELECTORS.recetaWizard,
      title: "2. Ingredientes",
      description:
        "Aquí agregas los Ingredientes que forman parte de la Receta.",
    },
    {
      id: "paso2-area",
      mode: "info",
      route: "/recetas/nueva",
      target: SELECTORS.recetaIngredientes,
      title: "Agregar ingrediente",
      description:
        "Selecciona un ingrediente, para cada uno indica una cantidad mayor a 0, elige la unidad de medida y agrégalo a la receta.",
    },
    {
      id: "paso2-siguiente",
      mode: "action",
      route: "/recetas/nueva",
      target: SELECTORS.recetaSiguiente,
      title: "Siguiente",
      description:
        "Cuando exista al menos un ingrediente agregado, pulsa «Siguiente» para continuar con los Métodos de Preparación.",
    },
    {
      id: "paso3-titulo",
      mode: "info",
      route: "/recetas/nueva",
      target: SELECTORS.recetaWizard,
      title: "3. Métodos de Preparación",
      description:
        "En esta sección defines el proceso de elaboración: agrega los pasos en el orden en que deben realizarse. No es obligatorio agregar un paso para guardar.",
    },
    {
      id: "paso3-area",
      mode: "info",
      route: "/recetas/nueva",
      target: SELECTORS.recetaPreparacion,
      title: "Agregar pasos",
      description:
        "Escribe cada paso y agrégalo. Puedes agregar varios pasos y eliminarlos si lo necesitas.",
    },
    {
      id: "fin",
      mode: "action",
      route: "/recetas/nueva",
      target: SELECTORS.recetaGuardar,
      title: "¡Listo!",
      description:
        "Ya conoces los tres pasos para crear una receta de la misma manera puedes crear una Sub-Receta y Montaje. Cuando completes la Preparación, pulsa «Guardar» para registrar la receta. La guía termina aquí.",
    },
  ],
};
