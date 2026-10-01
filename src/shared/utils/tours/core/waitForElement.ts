import type { TourTarget } from "../types";

export const DEFAULT_WAIT_TIMEOUT = 6000;
export const POLL_INTERVAL = 120;

export interface WaitForElementOptions {
  timeout?: number;
  signal?: AbortSignal;
  requireVisible?: boolean;
}

export function resolveTarget(target: TourTarget | undefined): Element | null {
  const resolved = typeof target === "function" ? target() : target;
  if (!resolved) return null;
  if (typeof resolved === "string") return document.querySelector(resolved);
  return resolved;
}

export function isElementVisible(element: Element): boolean {
  const node = element as HTMLElement;

  if (typeof node.getClientRects !== "function") return false;
  if (node.getClientRects().length === 0) return false;

  const style = window.getComputedStyle(node);
  return style.visibility !== "hidden" && style.display !== "none";
}

export function waitForElement(
  target: TourTarget | undefined,
  options: WaitForElementOptions = {}
): Promise<Element | null> {
  const {
    timeout = DEFAULT_WAIT_TIMEOUT,
    signal,
    requireVisible = true,
  } = options;

  return new Promise<Element | null>((resolve) => {
    if (signal?.aborted) {
      resolve(null);
      return;
    }

    let settled = false;
    let observer: MutationObserver | null = null;
    const cleanups: Array<() => void> = [];

    function onAbort() {
      finish(null);
    }

    function finish(element: Element | null) {
      if (settled) return;
      settled = true;
      observer?.disconnect();
      observer = null;
      while (cleanups.length) cleanups.pop()?.();
      signal?.removeEventListener("abort", onAbort);
      resolve(element);
    }

    function check() {
      const element = resolveTarget(target);
      if (element && (!requireVisible || isElementVisible(element))) {
        finish(element);
      }
    }

    signal?.addEventListener("abort", onAbort, { once: true });

    if (signal?.aborted) {
      finish(null);
      return;
    }

    observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style", "hidden"],
    });

    const intervalId = window.setInterval(check, POLL_INTERVAL);
    cleanups.push(() => window.clearInterval(intervalId));

    const timeoutId = window.setTimeout(() => finish(null), timeout);
    cleanups.push(() => window.clearTimeout(timeoutId));

    check();
  });
}
