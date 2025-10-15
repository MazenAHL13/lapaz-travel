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
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: null,

      login: (email, password) => {
        const user = usersData.users.find(
          (u) =>
            (u.email.toLowerCase() === email.toLowerCase() ||
              u.name.toLowerCase().includes(email.toLowerCase())) &&
            u.password === password
        );

        if (user) {
          set({ currentUser: user });
          return true;
        }
        return false;
      },

      logout: () => set({ currentUser: null }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);