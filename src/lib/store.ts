import { create } from "zustand";

interface AppStore {
  activeTool: string;
  setActiveTool: (id: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  expandedCategories: string[];
  toggleCategory: (id: string) => void;
  sidebarSearch: string;
  setSidebarSearch: (q: string) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  activeTool: "home",
  setActiveTool: (id) => set({ activeTool: id, sidebarOpen: false }),
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  theme: "dark",
  toggleTheme: () => {
    const newTheme = get().theme === "light" ? "dark" : "light";
    if (typeof window !== "undefined") {
      localStorage.setItem("abzarak-theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    }
    set({ theme: newTheme });
  },
  expandedCategories: [],
  toggleCategory: (id) =>
    set((state) => ({
      expandedCategories: state.expandedCategories.includes(id)
        ? state.expandedCategories.filter((c) => c !== id)
        : [...state.expandedCategories, id],
    })),
  sidebarSearch: "",
  setSidebarSearch: (q) => set({ sidebarSearch: q }),
}));
