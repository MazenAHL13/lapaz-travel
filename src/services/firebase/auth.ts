import { db } from "@/src/data/firebase";
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { config } from "./config";

const app = initializeApp(config);
const auth = getAuth(app);

export const registerUser = async (email: string, password: string): Promise<User> => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  const userRef = doc(db, "users", cred.user.uid);
  await setDoc(userRef, {
    uid: cred.user.uid,
    email,
    role: "user",
    createdAt: new Date().toISOString(),
  });

  return cred.user;
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};