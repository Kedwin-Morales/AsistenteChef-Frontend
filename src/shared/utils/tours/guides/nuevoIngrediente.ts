import type { TourDefinition } from "../types";
import { isMobile } from "../core/environment";
import { SELECTORS } from "./selectors";

export const nuevoIngrediente: TourDefinition = {
  id: "nuevoIngrediente",
  steps: [
    {
      id: "intro",
      mode: "info",
      title: "Nuevo Ingrediente",
      description:
        "Te guío en pocos pasos: primero crea el tipo de ingrediente, la unidad de medida y después registra el ingrediente.",
    },
    {
      id: "abrir-maestro",
      mode: "action",
      target: () =>
        isMobile() ? SELECTORS.menuHamburguesa : SELECTORS.navMaestro,
      title: () => (isMobile() ? "Abre el menú lateral" : "Entra a Maestro de Cocina"),
      description: () =>
        isMobile()
          ? "Pulsa el icono del menú para mostrar las opciones del sistema."
          : "Pulsa «Maestro de Cocina» en el menú lateral.",
    },
    {
      id: "nav-maestro-movil",
      mode: "action",
      when: isMobile,
      target: SELECTORS.navMaestro,
      title: "Maestro de Cocina",
      description: "Ahora entra a «Maestro de Cocina».",
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
      id: "maestro-tipo",
      mode: "action",
      route: "/maestro",
      target: SELECTORS.maestroTipo,
      title: "Tipo de Ingrediente",
      description:
        "Todo ingrediente pertenece a un tipo: proteína, vegetal, lácteo, etc.",
    },
    {
      id: "tipo-nuevo",
      mode: "action",
      route: "/tipo-ingredientes",
      target: SELECTORS.tipoNuevo,
      title: "Crea primero el tipo",
      description:
        "Registra aquí el tipo que usarás. Después vuelve al Maestro para crear el ingrediente.",
    },
    {
      id: "formulario-tipo",
      mode: "info",
      when: () => !isMobile(),
      route: "/tipo-ingredientes",
      target: SELECTORS.modalFormulario,
      title: "Formulario de tipo de ingrediente",
      description:
        "Aquí completas los datos y guardas.",
    },
    {
      id: "tipo-volver",
      mode: "action",
      route: "/tipo-ingredientes",
      target: SELECTORS.tipoVolver,
      title: "Vuelve al Maestro",
      description: "Del mismo modo puedes crear las Unidades de Medidas. Pulsa la flecha para regresar a los módulos del Maestro.",
    },
    {
      id: "maestro-ingrediente",
      mode: "action",
      route: "/maestro",
      target: SELECTORS.maestroIngrediente,
      title: "Ingredientes y/o Utensilios",
      description: "Esta es la sección donde se registran los ingredientes.",
    },
    {
      id: "ingrediente-nuevo",
      mode: "action",
      when: () => !isMobile(),
      route: "/ingredientes",
      target: SELECTORS.ingredienteNuevo,
      title: "Nuevo ingrediente",
      description: "Pulsa «Nuevo» para abrir el formulario.",
    },
    {
      id: "formulario-ingrediente",
      mode: "info",
      when: () => !isMobile(),
      route: "/ingredientes",
      target: SELECTORS.modalFormulario,
      title: "Formulario de ingrediente",
      description:
        "Aquí completas los datos y guardas. La guía no registra nada por ti.",
    },
  ],
};
