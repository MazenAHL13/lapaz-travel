import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyB4F_Rav41DyJGf23DYgrtzJ7ijkcM5LJ0",
    authDomain: "lapaztravel.firebaseapp.com",
    projectId: "lapaztravel",
    storageBucket: "lapaztravel.firebasestorage.app",
    messagingSenderId: "1082767172929",
    appId: "1:1082767172929:web:95b4e644da066353c5edc0",
    measurementId: "G-1KVEQN5DCQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);