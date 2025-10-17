import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "./useUserStore";

type FavState = {
  favoritesByUser: Record<string, string[]>; 
  toggleFavorite: (placeId: string) => void;
  isFavorite: (placeId: string) => boolean;
  getFavorites: () => string[];
  clearAll: () => void; 
};

export const useFavoritesStore = create<FavState>()(
  persist(
    (set, get) => ({
      favoritesByUser: {},

      toggleFavorite: (placeId) => {
        const userId = useUserStore.getState().currentUser?.id;
        if (!userId) return;

        const current = get().favoritesByUser[userId] ?? [];
        const updated = current.includes(placeId)
          ? current.filter((id) => id !== placeId)
          : [...current, placeId];

        set({
          favoritesByUser: { ...get().favoritesByUser, [userId]: updated },
        });
      },

      isFavorite: (placeId) => {
        const userId = useUserStore.getState().currentUser?.id;
        if (!userId) return false;
        const current = get().favoritesByUser[userId] ?? [];
        return current.includes(placeId);
      },

      getFavorites: () => {
        const userId = useUserStore.getState().currentUser?.id;
        if (!userId) return [];
        return get().favoritesByUser[userId] ?? [];
      },

      clearAll: () => set({ favoritesByUser: {} }),
    }),
    {
      name: "favorites-store",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);