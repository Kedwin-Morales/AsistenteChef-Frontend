import { driver, type Driver } from "driver.js";

export const TOUR_POPOVER_CLASS = "driver-popover-asistente";
export const TOUR_WAIT_TIMEOUT = 1000;

export function createTourDriver(onDestroyed?: () => void): Driver {
  // 1. Guardamos la instancia en una variable (driverObj)
  const driverObj = driver({
    animate: true,
    smoothScroll: true,
    allowScroll: true,
    allowClose: false,
    allowKeyboardControl: true,
    showProgress: true,
    showButtons: ['next', 'previous', 'close'],
    progressText: '{{current}}/{{total}}',
    nextBtnText: 'Siguiente',
    prevBtnText: 'Anterior',
    doneBtnText: 'Finalizar',    
    popoverClass: TOUR_POPOVER_CLASS,
    stagePadding: 8,
    stageRadius: 12,
    disableActiveInteraction: false,
    waitForElement: TOUR_WAIT_TIMEOUT,
    skipMissingElement: false,
    onDestroyed,
    
    onPopoverRender: (popover) => {
      if (popover.wrapper.querySelector('.custom-driver-close')) return;

      const closeBtn = document.createElement("button");
      closeBtn.innerHTML = "&times;";
      closeBtn.className = "custom-driver-close";
      
      Object.assign(closeBtn.style, {
        position: "absolute",
        top: "10px",
        right: "12px",
        border: "none",
        background: "transparent",
        fontSize: "22px",
        cursor: "pointer",
        color: "#EF5350",
        padding: "5px",
        lineHeight: "1",
        zIndex: "100"
      });

      // 2. Destruimos utilizando la constante creada arriba
      closeBtn.onclick = () => {
        driverObj.destroy();
      };

      popover.wrapper.appendChild(closeBtn);
    },
  });

  // 3. Retornamos la instancia
  return driverObj;
}