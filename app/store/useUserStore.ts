import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import usersData from "../data/users.json";

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  password: string;
};

type UserState = {
  currentUser: User | null;
  savedAvatars: Record<string, string | undefined>; 
  login: (emailOrName: string, password: string) => Promise<boolean>;
  logout: () => void;
  setAvatar: (uri: string) => void;
  clearAvatar: () => void;
  clearAll: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      savedAvatars: {},

      login: async (emailOrName, password) => {
        const found = usersData.users.find(
          (u) =>
            (u.email.toLowerCase() === emailOrName.toLowerCase() ||
              u.name.toLowerCase() === emailOrName.toLowerCase()) &&
            u.password === password
        );
        if (!found) return false;

        const avatar = get().savedAvatars[found.id];
        set({ currentUser: { ...found, avatar } });
        return true;
      },

      logout: () => set({ currentUser: null }),

      setAvatar: (uri) => {
        const u = get().currentUser;
        if (!u) return;
        const next = { ...get().savedAvatars, [u.id]: uri };
        set({
          currentUser: { ...u, avatar: uri },
          savedAvatars: next,
        });
      },

      clearAvatar: () => {
        const u = get().currentUser;
        if (!u) return;
        const next = { ...get().savedAvatars };
        delete next[u.id];
        set({
          currentUser: { ...u, avatar: undefined },
          savedAvatars: next,
        });
      },

      clearAll: () => set({ currentUser: null, savedAvatars: {} }),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);