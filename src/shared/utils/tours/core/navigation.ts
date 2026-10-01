type NavigateFn = (to: string) => void;
type PathFn = () => string;

let navigateFn: NavigateFn | null = null;
let pathFn: PathFn | null = null;

export function registerTourNavigation(
  navigate: NavigateFn,
  getPath: PathFn
): () => void {
  navigateFn = navigate;
  pathFn = getPath;

  return () => {
    if (navigateFn === navigate) {
      navigateFn = null;
      pathFn = null;
    }
  };
}

export function isNavigationReady(): boolean {
  return navigateFn !== null;
}

export function getCurrentPath(): string {
  return pathFn ? pathFn() : window.location.pathname;
}

export function isSamePath(from: string, to: string): boolean {
  return normalize(from) === normalize(to);
}

export function navigateTo(path: string): boolean {
  if (!navigateFn) {
    console.warn("[tours] Navegador no registrado: no se puede ir a", path);
    return false;
  }

  navigateFn(path);
  return true;
}

function normalize(path: string): string {
  const clean = path.split("?")[0].split("#")[0];
  return clean.length > 1 && clean.endsWith("/") ? clean.slice(0, -1) : clean;
}
