import { create } from "zustand";

interface SidebarState {
  openGroup: string | null;
  setOpenGroup: (id: string | null) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  openGroup: null,
  setOpenGroup: (id) => set({ openGroup: id }),
}));