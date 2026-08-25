import { Fragment } from "react";
import { Check } from "lucide-react";

export interface WizardStepConfig {
  id: number;
  label: string;
  shortLabel: string;
}

interface Props {
  currentStep: number;
  onStepClick: (step: number) => void;
}

const STEPS: WizardStepConfig[] = [
  { id: 1, label: "Información Base", shortLabel: "Información" },
  { id: 2, label: "Ingredientes y Recetas", shortLabel: "Ingredientes y/o Recetas" },
  { id: 3, label: "Método de Preparación", shortLabel: "Preparación" },
];

export default function RecetaWizardSteps({ currentStep, onStepClick }: Props) {
  return (
    <div className="mb-8">
      {/* DESKTOP */}
      <nav aria-label="Progreso del formulario" className="hidden md:block">
        <ol className="flex items-center">
          {STEPS.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const isClickable = isCompleted;

            return (
              <Fragment key={step.id}>
                {index > 0 && (
                  <li
                    aria-hidden="true"
                    className={`flex-1 h-1 mx-3 rounded-full transition-colors duration-300 ${
                      currentStep >= step.id ? "bg-(--secondary)" : "bg-(--bordes)"
                    }`}
                  />
                )}
                <li>
                  <button
                    type="button"
                    onClick={() => isClickable && onStepClick(step.id)}
                    disabled={!isClickable}
                    aria-current={isActive ? "step" : undefined}
                    aria-label={`${step.label}${isClickable ? " (completado)" : ""}`}
                    className="flex flex-col items-center gap-2 disabled:cursor-default"
                  >
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-full font-bold transition-all duration-300 ${
                        isActive
                          ? "bg-gradient text-white shadow-xl-secondary scale-105"
                          : isCompleted
                            ? "bg-(--secondary) text-white hover:scale-105"
                            : "bg-(--bordes) text-neutral-500"
                      }`}
                    >
                      {isCompleted ? <Check size={18} /> : step.id}
                    </span>
                    <span
                      className={`text-sm font-semibold transition-colors duration-300 ${
                        isActive
                          ? "text-(--secondary)"
                          : isCompleted
                            ? "text-(--texto)"
                            : "text-neutral-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>
                </li>
              </Fragment>
            );
          })}
        </ol>
      </nav>

      {/* MOBILE */}
      <div className="md:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-500">
              Paso {currentStep} de {STEPS.length}
            </p>
            <p className="text-lg font-bold text-(--secondary)">
              {STEPS.find((s) => s.id === currentStep)?.label}
            </p>
          </div>
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {STEPS.map((s) => (
              <span
                key={s.id}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s.id === currentStep
                    ? "w-6 bg-(--secondary)"
                    : s.id < currentStep
                      ? "w-2 bg-(--secondary)"
                      : "w-2 bg-(--bordes)"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
