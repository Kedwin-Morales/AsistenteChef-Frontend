import { nuevaReceta } from "./nuevaReceta";
import { nuevoIngrediente } from "./nuevoIngrediente";

export const guides = {
  nuevoIngrediente,
  nuevaReceta,
} as const;

export type TourId = keyof typeof guides;

export { SELECTORS } from "./selectors";
