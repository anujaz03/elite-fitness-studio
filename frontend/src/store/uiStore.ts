import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  activeNotification: string | null;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setNotification: (msg: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  activeNotification: null,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setNotification: (msg) => set({ activeNotification: msg })
}));

export default useUIStore;
