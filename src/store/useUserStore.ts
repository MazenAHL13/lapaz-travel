import { auth } from "@/src/services/firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";
import { create } from "zustand";

type UserState = {
  currentUser: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
};

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  setUser: (user) => set({ currentUser: user }),
  logout: async () => {
    await auth.signOut();
    set({ currentUser: null });
  },
}));

onAuthStateChanged(auth, (user) => {
  useUserStore.getState().setUser(user);
});