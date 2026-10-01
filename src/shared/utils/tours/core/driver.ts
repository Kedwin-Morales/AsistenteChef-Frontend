import { driver, type Driver } from "driver.js";

export const TOUR_POPOVER_CLASS = "driver-popover-asistente";
export const TOUR_WAIT_TIMEOUT = 6000;

export function createTourDriver(): Driver {
  return driver({
    animate: true,
    smoothScroll: true,
    allowScroll: true,
    allowClose: true,
    allowKeyboardControl: true,
    showProgress: true,
    progressText: "{{current}}/{{total}}",
    nextBtnText: "Siguiente",
    prevBtnText: "Anterior",
    doneBtnText: "Finalizar",
    popoverClass: TOUR_POPOVER_CLASS,
    stagePadding: 8,
    stageRadius: 12,
    disableActiveInteraction: false,
    waitForElement: TOUR_WAIT_TIMEOUT,
    skipMissingElement: false,
  });
}
