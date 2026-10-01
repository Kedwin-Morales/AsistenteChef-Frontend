export const MOBILE_BREAKPOINT_PX = 768;

export function isMobile(): boolean {
  if (typeof window.matchMedia !== "function") return false;
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`).matches;
}
