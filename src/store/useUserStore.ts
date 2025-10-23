import { auth, db } from "@/src/services/firebase/config";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { create } from "zustand";

export type AppUser = {
  uid: string;
  name?: string;
  email: string;
  avatar?: string;
  darkMode?: boolean;
};

type UserState = {
  currentUser: AppUser | null;
  setUser: (user: AppUser | null) => void;
  setAvatar: (avatarUrl: string) => void;
  clearAvatar: () => void;
  setDarkMode: (darkMode: boolean) => void;
  logout: () => Promise<void>;
};

export const useUserStore = create<UserState>((set) => ({
    currentUser: null,

    setUser: (user) => set({ currentUser: user }),
    
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
    };

    useUserStore.getState().setUser(appUser);
  } else {
    useUserStore.getState().setUser(null);
  }
});