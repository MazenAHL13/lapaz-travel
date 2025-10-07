import { create } from "zustand";

type FavState = {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

export const useFavoritesStore = create<FavState>((set, get) => ({
  favorites: [],
  toggleFavorite: (id) => {
    const { favorites } = get();
    if (favorites.includes(id)) {
      set({ favorites: favorites.filter((f) => f !== id) });
    } else {
      set({ favorites: [...favorites, id] });
    }
  },
  isFavorite: (id) => get().favorites.includes(id),
}));