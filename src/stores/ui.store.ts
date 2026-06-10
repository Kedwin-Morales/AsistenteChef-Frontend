import { create } from "zustand";

interface UIState {
  isDarkMode: boolean;
  viewMode: "desktop" | "mobile";
  designVersion: 1 | 2;

  toggleDarkMode: () => void;
  toggleView: () => void;
  toggleDesign: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isDarkMode: false,
  viewMode: "desktop",
  designVersion: 1,

  toggleDarkMode: () =>
    set((state) => {
      const next = !state.isDarkMode;

      // sincroniza con Tailwind dark mode
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");

      return { isDarkMode: next };
    }),

  toggleView: () =>
    set((state) => ({
      viewMode: state.viewMode === "desktop" ? "mobile" : "desktop",
    })),

  toggleDesign: () =>
    set((state) => ({
      designVersion: state.designVersion === 1 ? 2 : 1,
    })),
}));
