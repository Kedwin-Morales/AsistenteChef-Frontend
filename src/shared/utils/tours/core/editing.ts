import { getCurrentPath } from "./navigation";

export const FORM_SEGMENTS = ["editar", "nueva"] as const;

type EditingDetector = (pathname: string) => boolean;

const detectors: EditingDetector[] = [];

export function registerEditingDetector(detector: EditingDetector): () => void {
  detectors.push(detector);

  return () => {
    const index = detectors.indexOf(detector);
    if (index >= 0) detectors.splice(index, 1);
  };
}

export function isEditingPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);

  return segments.some((segment) =>
    (FORM_SEGMENTS as readonly string[]).includes(segment)
  );
}

export function isEditingScreen(pathname: string = getCurrentPath()): boolean {
  return (
    isEditingPath(pathname) || detectors.some((detector) => detector(pathname))
  );
}
