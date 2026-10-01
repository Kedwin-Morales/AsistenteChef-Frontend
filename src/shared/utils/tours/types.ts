import type { Alignment, Side } from "driver.js";

export type TourText = string | (() => string);

export type TourResolvedTarget = string | Element | null;

export type TourTarget = TourResolvedTarget | (() => TourResolvedTarget);

export type TourStepMode = "info" | "action";

export interface TourStep {
  id: string;
  mode: TourStepMode;
  title: TourText;
  description: TourText;
  target?: TourTarget;
  route?: string;
  when?: () => boolean;
  side?: Side;
  align?: Alignment;
  waitFor?: number;
}

export interface TourDefinition {
  id: string;
  steps: TourStep[];
}
