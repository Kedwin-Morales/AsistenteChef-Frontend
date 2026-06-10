import { useUIStore } from "@/stores/ui.store";

export const useLoginUI = () => {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const viewMode = useUIStore((s) => s.viewMode);
  const designVersion = useUIStore((s) => s.designVersion);

  const toggleDarkMode = useUIStore((s) => s.toggleDarkMode);
  const toggleView = useUIStore((s) => s.toggleView);
  const toggleDesign = useUIStore((s) => s.toggleDesign);

  return {
    isDarkMode,
    viewMode,
    designVersion,
    toggleDarkMode,
    toggleView,
    toggleDesign,
  };
};
