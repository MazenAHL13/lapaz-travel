import { auth, db } from "@/src/services/firebase/config";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteField,
  serverTimestamp,
} from "firebase/firestore";
import { Appearance } from "react-native";
import { create } from "zustand";
import { useThemeStore } from "./useThemeStore";

export type AppUser = {
  uid: string;
  name?: string;
  email: string;
  avatar?: string | null;
  darkMode?: boolean;
  role?: "user" | "admin";
};

type UserState = {
  currentUser: AppUser | null;
  setUser: (user: AppUser | null) => void;

  setName: (name: string) => Promise<void>;
  setAvatar: (avatarUrl: string) => Promise<void>;
  clearAvatar: () => Promise<void>;
  setDarkMode: (darkMode: boolean) => Promise<void>;

  logout: () => Promise<void>;
};

const getDeviceTheme = () =>
  (Appearance.getColorScheme() === "dark" ? "dark" : "light") as
    | "dark"
    | "light";

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,

  setUser: (user) => set({ currentUser: user }),

  setName: async (name: string) => {
    const current = useUserStore.getState().currentUser;
    if (!current) return;

    await updateDoc(doc(db, "users", current.uid), { name: name.trim() });

    set((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, name } : null,
    }));
  },

  setAvatar: async (avatarUrl: string) => {
    const current = useUserStore.getState().currentUser;
    if (!current) return;

    await updateDoc(doc(db, "users", current.uid), { avatar: avatarUrl });

    set((state) => ({
      currentUser: state.currentUser
        ? { ...state.currentUser, avatar: avatarUrl }
        : null,
    }));
  },

  clearAvatar: async () => {
    const current = useUserStore.getState().currentUser;
    if (!current) return;

    await updateDoc(doc(db, "users", current.uid), { avatar: deleteField() });

    set((state) => ({
      currentUser: state.currentUser
        ? { ...state.currentUser, avatar: undefined }
        : null,
    }));
  },

  setDarkMode: async (darkMode: boolean) => {
    const current = useUserStore.getState().currentUser;
    if (!current) return;

    await updateDoc(doc(db, "users", current.uid), { darkMode });

    set((state) => ({
      currentUser: state.currentUser
        ? { ...state.currentUser, darkMode }
        : null,
    }));

    useThemeStore.getState().setTheme(darkMode ? "dark" : "light");
  },

  logout: async () => {
    await auth.signOut();
    set({ currentUser: null });
    useThemeStore.getState().setTheme(getDeviceTheme());
  },
}));

onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
  if (firebaseUser) {
    const ref = doc(db, "users", firebaseUser.uid);
    let snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        email: firebaseUser.email || "",
        createdAt: serverTimestamp(),
      });
      snap = await getDoc(ref);
    }

    const data = snap.data() || {};
    const appUser: AppUser = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      name: data.name,
      avatar: data.avatar ?? undefined,
      darkMode: data.darkMode,
      role: (data.role as "user" | "admin") ?? "user",
    };
    useUserStore.getState().setUser(appUser);

    useUserStore.getState().setUser(appUser);

    if (appUser.darkMode !== undefined) {
      useThemeStore.getState().setTheme(appUser.darkMode ? "dark" : "light");
    } else {
      useThemeStore.getState().setTheme(getDeviceTheme());
    }
  } else {
    useUserStore.getState().setUser(null);
    useThemeStore.getState().setTheme(getDeviceTheme());
  }
});