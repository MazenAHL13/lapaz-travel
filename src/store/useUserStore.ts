import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { create } from "zustand";
import { auth, db } from "../data/firebase";

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      set({ user: credential.user, loading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  register: async (email, password) => {
    set({ loading: true, error: null });

    if (!email.includes("@")) {
      set({ error: "Correo inválido.", loading: false });
      return false;
    }
    if (password.length < 3) {
      set({ error: "La contraseña debe tener al menos 3 caracteres.", loading: false });
      return false;
    }

    try {
      const userDocRef = doc(db, "users", email);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        set({ error: "El correo ya está en uso.", loading: false });
        return false;
      }

      const credential = await createUserWithEmailAndPassword(auth, email, password);


      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        email: credential.user.email,
        createdAt: new Date().toISOString(),
      });

      set({ user: credential.user, loading: false });
      return true;
    } catch (error: any) {
      let errorMessage = "Error al registrar usuario.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "El correo ya está en uso.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Correo inválido.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "La contraseña es demasiado débil.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      return false;
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },

  setUser: (user) => set({ user }),
}));

onAuthStateChanged(auth, (firebaseUser) => {
  useUserStore.getState().setUser(firebaseUser);
});