import { auth, db } from "@/src/services/firebase/config";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Appearance } from "react-native";
import { create } from "zustand";
import { useThemeStore } from "./useThemeStore";


export type AppUser = {
  uid: string;
  name?: string;
  email: string;
  avatar?: string;
  darkMode?: boolean;
  role: "user";
};

type UserState = {
  currentUser: AppUser | null;
  setUser: (user: AppUser | null) => void;
  setName: (name: string) => void;
  setAvatar: (avatarUrl: string) => void;
  clearAvatar: () => void;
  setDarkMode: (darkMode: boolean) => Promise<void>;
  logout: () => Promise<void>;
};

const getDeviceTheme = () => 
  Appearance.getColorScheme() === "dark" ? "dark" : "light";

export const useUserStore = create<UserState>((set) => ({
    currentUser: null,

    setUser: (user) => set({ currentUser: user }),
    
    setName: (name: string) => {
        const currentUser = useUserStore.getState().currentUser;
        if (!currentUser) return;
      
        setDoc(doc(db, "users", currentUser.uid), { name }, { merge: true });
      
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, name }
            : null,
        }));
    },
    setAvatar: async (avatarUrl: string) => {
        const currentUser = useUserStore.getState().currentUser;
        if (!currentUser) return;
      
        await setDoc(doc(db, "users", currentUser.uid), { avatar: avatarUrl }, { merge: true });
      
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, avatar: avatarUrl }
            : null,
        }));
    },
      
    clearAvatar: async () => {
        const currentUser = useUserStore.getState().currentUser;
        if (!currentUser) return;
    
        await setDoc(doc(db, "users", currentUser.uid), { avatar: undefined }, { merge: true });
      
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, avatar: undefined }
            : null,
        }));
    },

    setDarkMode: async (darkMode: boolean) => {
        const currentUser = useUserStore.getState().currentUser;
        if (!currentUser) return;
      
        await setDoc(doc(db, "users", currentUser.uid), { darkMode }, { merge: true });
      
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, darkMode }
            : null,
        }));
    },

    logout: async () => {
        await auth.signOut();
        set({ currentUser: null });
        useThemeStore.getState().setTheme(getDeviceTheme());  
    },
}));

onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
  if (firebaseUser) {
    const docRef = doc(db, "users", firebaseUser.uid);
    const docSnap = await getDoc(docRef);

    const appUser: AppUser = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      name: docSnap.exists() ? docSnap.data()?.name : undefined,
      avatar: docSnap.exists() ? docSnap.data()?.avatar : undefined,
      darkMode: docSnap.exists() ? docSnap.data()?.darkMode : undefined,
      role: docSnap.exists() ? docSnap.data()?.role || "user" : "user",
    };

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