import type { AllowedButtons, DriveStep, Driver } from "driver.js";
import { confirm } from "@/shared/utils/swal";
import { useUIStore } from "@/stores/ui.store";
import { guides, type TourId } from "../guides";
import type { TourDefinition, TourStep, TourText } from "../types";
import { createTourDriver, TOUR_WAIT_TIMEOUT } from "./driver";
import { isEditingScreen } from "./editing";
import { getCurrentPath, isSamePath, navigateTo } from "./navigation";
import { resolveTarget, waitForElement } from "./waitForElement";

let activeDriver: Driver | null = null;
let activeController: AbortController | null = null;

export function isTourRunning(): boolean {
  return activeDriver !== null;
}

export function stopTour(): void {
  activeController?.abort();
  activeController = null;

  const driverInstance = activeDriver;
  activeDriver = null;
  driverInstance?.destroy();
}

export async function startTour(id: TourId): Promise<void> {
  const definition: TourDefinition | undefined = guides[id];
  if (!definition) return;

  const steps = definition.steps.filter((step) => (step.when ? step.when() : true));
  if (!steps.length) return;

  if (!(await confirmLeavingEditor())) return;

  stopTour();

  const controller = new AbortController();
  activeController = controller;

  const unlockedActions = new Set<number>();
  let driverInstance = createTourDriver();
  activeDriver = driverInstance;
  attachLifecycle(driverInstance, controller);

  function buildSteps(): DriveStep[] {
    return steps.map((step, index) =>
      buildDriveStep({
        step,
        index,
        goTo,
        isAction: step.mode === "action" && !unlockedActions.has(index),
      })
    );
  }

  function restartAt(index: number): void {
    const previous = driverInstance;

    driverInstance = createTourDriver();
    activeDriver = driverInstance;
    attachLifecycle(driverInstance, controller);

    driverInstance.setSteps(buildSteps());
    driverInstance.drive(index);

    previous.destroy();
  }

  async function goTo(index: number): Promise<void> {
    if (index < 0) return;
    if (index >= steps.length) {
      stopTour();
      return;
    }

    const step = steps[index];

    if (step.route && !isSamePath(getCurrentPath(), step.route)) {
      navigateTo(step.route);
    }

    const element = await waitForElement(step.target, {
      timeout: TOUR_WAIT_TIMEOUT,
      signal: controller.signal,
    });

    if (activeDriver !== driverInstance) return;

    if (!element && step.mode === "action") {
      unlockedActions.add(index);
      restartAt(index);
      return;
    }

    driverInstance.moveTo(index);
  }

  driverInstance.setSteps(buildSteps());
  driverInstance.drive(0);
}

async function confirmLeavingEditor(): Promise<boolean> {
  if (!isEditingScreen()) return true;

  const result = await confirm({
    title: "Tienes un formulario abierto",
    text: "Si continúas con la guía podrías perder los cambios que no has guardado. ¿Quieres continuar de todos modos?",
    icon: "warning",
    confirmButtonText: "Iniciar la guía",
    cancelButtonText: "Seguir editando",
    isDarkMode: useUIStore.getState().isDarkMode,
  });

  return result.isConfirmed;
}

function attachLifecycle(driverInstance: Driver, controller: AbortController) {
  driverInstance.setConfig({
    onDestroyed: () => {
      if (activeDriver !== driverInstance) return;
      controller.abort();
      if (activeController === controller) activeController = null;
      activeDriver = null;
    },
  });
}

function buildDriveStep({
  step,
  index,
  goTo,
  isAction,
}: {
  step: TourStep;
  index: number;
  goTo: (index: number) => Promise<void>;
  isAction: boolean;
}): DriveStep {
  const disableButtons: AllowedButtons[] = [
    ...(index === 0 ? (["previous"] as const) : []),
    ...(isAction ? (["next"] as const) : []),
  ];

  return {
    element: (() => resolveTarget(step.target) ?? undefined) as DriveStep["element"],
    advanceOnClick: isAction,
    ...(step.waitFor ? { waitForElement: step.waitFor } : {}),
    popover: {
      title: resolveText(step.title),
      description: resolveText(step.description),
      side: step.side,
      align: step.align,
      disableButtons,
      onNextClick: () => void goTo(index + 1),
      onPrevClick: () => void goTo(index - 1),
    },
  };
}

function resolveText(value: TourText): string {
  return typeof value === "function" ? value() : value;
}
