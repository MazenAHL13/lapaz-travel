import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import usersData from "../data/users.json";

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  password: string;
};

type UserState = {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setAvatar: (uri: string) => Promise<void>;
  clearAvatar: () => Promise<void>;
};

type PersistedMods = {
  [userId: string]: Partial<User>; 
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: null,

      
      login: async (email, password) => {
        const baseUser = usersData.users.find(
          (u) =>
            (u.email.toLowerCase() === email.toLowerCase() ||
              u.name.toLowerCase().includes(email.toLowerCase())) &&
            u.password === password
        );

        if (!baseUser) return false;

        
        const raw = (await AsyncStorage.getItem("user-mods")) || "{}";
        const mods: PersistedMods = JSON.parse(raw);

        
        const mergedUser = { ...baseUser, ...(mods[baseUser.id] ?? {}) };
        set({ currentUser: mergedUser });

        return true;
      },

     
      logout: () => set({ currentUser: null }),

        setAvatar: async (uri) => {
        const u = get().currentUser;
        if (!u) return;

        const updated = { ...u, avatar: uri };
        set({ currentUser: updated });

        const raw = (await AsyncStorage.getItem("user-mods")) || "{}";
        const mods: PersistedMods = JSON.parse(raw);
        mods[u.id] = { ...(mods[u.id] ?? {}), avatar: uri };
        await AsyncStorage.setItem("user-mods", JSON.stringify(mods));
      },

      clearAvatar: async () => {
        const u = get().currentUser;
        if (!u) return;

        const updated = { ...u, avatar: undefined };
        set({ currentUser: updated });

        const raw = (await AsyncStorage.getItem("user-mods")) || "{}";
        const mods: PersistedMods = JSON.parse(raw);
        if (mods[u.id]) {
          delete mods[u.id].avatar;
          if (Object.keys(mods[u.id]).length === 0) delete mods[u.id];
        }
        await AsyncStorage.setItem("user-mods", JSON.stringify(mods));
      },
    }),
    {
      name: "user-storage", 
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);