import { Appearance } from "react-native";
import { create } from "zustand";

import type { Theme } from "../theme/colors";
import { useUserStore } from "./useUserStore";

const initialTheme: Theme =
  Appearance.getColorScheme() === "dark" ? "dark" : "light";

type ThemeStore = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: initialTheme,
  toggleTheme: () => {
    const newTheme = get().theme === "dark" ? "light" : "dark";
    set({ theme: newTheme });

    const { currentUser, setDarkMode } = useUserStore.getState();
    if (currentUser) {
      setDarkMode(newTheme === "dark");
    }
  },
  setTheme: (theme) => {
    set({ theme });

    const { currentUser, setDarkMode } = useUserStore.getState();
    if (currentUser && currentUser.darkMode !== (theme === "dark")) {
      setDarkMode(theme === "dark");
    }
  },
}));