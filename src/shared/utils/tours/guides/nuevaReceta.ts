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
      description: "Pulsa «Nuevo» para abrir el asistente de recetas.",
    },
    {
      id: "intro-wizard",
      mode: "info",
      route: "/recetas/nueva",
      target: SELECTORS.recetaWizard,
      title: "Asistente de recetas (3 pasos)",
      description:
        "Este asistente se divide en: 1) Información base, 2) Ingredientes y 3) Preparación. No realiza acciones por ti: tú completas cada paso.",
    },
    {
      id: "paso1-titulo",
      mode: "info",
      route: "/recetas/nueva",
      target: SELECTORS.recetaWizard,
      title: "1. Información base",
      description:
        "En esta sección defines la información principal de la receta. Los campos marcados con * son obligatorios para poder continuar.",
    },
    {
      id: "paso1-nombre",
      mode: "info",
      route: "/recetas/nueva",
      target: SELECTORS.recetaNombre,
      title: "Nombre",
      description: "Completa el nombre con el que identificarás esta receta (*).",
      waitFor: 180,
    },
    {
      id: "paso1-familia",
      mode: "info",
      route: "/recetas/nueva",
      target: SELECTORS.recetaFamiliaMenu,
      title: "Familia del Menú",
      description: "Selecciona la familia a la que pertenece la receta (*).",
      waitFor: 180,
    },
    {
      id: "paso1-area",
      mode: "info",
      route: "/recetas/nueva",
      target: SELECTORS.recetaAreaPreparacion,
      title: "Área de Preparación",
      description: "Indica el área donde se prepara esta receta (*).",
      waitFor: 180,
    },
    {
      id: "paso1-siguiente",
      mode: "info",
      route: "/recetas/nueva",
      target: SELECTORS.recetaSiguiente,
      title: "Siguiente",
      description:
        "Cuando hayas completado los 3 campos obligatorios, pulsa «Siguiente» para pasar a Ingredientes.",
    },
    {
      id: "paso2-titulo",
      mode: "info",
      route: "/recetas/nueva",
      target: SELECTORS.recetaWizard,
      title: "2. Ingredientes",
      description:
        "Aquí agregas los ingredientes que forman parte de la receta. Para cada uno indica una cantidad mayor a 0 y su unidad de medida.",
    },
    {
      id: "paso2-area",
      mode: "info",
      route: "/recetas/nueva",
      target: SELECTORS.recetaIngredientes,
      title: "Agregar ingrediente",
      description:
        "Selecciona un ingrediente, indica la cantidad > 0, elige la unidad de medida y agrégalo a la receta.",
    },
    {
      id: "paso2-siguiente",
      mode: "info",
      route: "/recetas/nueva",
      target: SELECTORS.recetaSiguiente,
      title: "Siguiente",
      description:
        "Cuando exista al menos un ingrediente agregado, pulsa «Siguiente» para continuar con la Preparación.",
    },
    {
      id: "paso3-titulo",
      mode: "info",
      route: "/recetas/nueva",
      target: SELECTORS.recetaWizard,
      title: "3. Preparación",
      description:
        "En esta sección defines el proceso de elaboración. Agrega los pasos en el orden en que deben realizarse. No es obligatorio agregar un paso para guardar.",
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
      mode: "info",
      route: "/recetas/nueva",
      target: SELECTORS.recetaGuardar,
      title: "¡Listo!",
      description:
        "Ya conoces los tres pasos para crear una receta. Cuando completes la preparación, pulsa «Guardar» para registrar la receta. La guía termina aquí.",
    },
  ],
};
