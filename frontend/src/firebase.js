import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";


const app = initializeApp({
  apiKey: "AIzaSyDRARmNsfFszVO6zBKCJwVsG7U5BXuShQ0",
  authDomain: "group8-backend.firebaseapp.com",
  projectId: "group8-backend",
  storageBucket: "group8-backend.firebasestorage.app",
  messagingSenderId: "767925577514",
  appId: "1:767925577514:web:f698a9fef6266251aca053",
  measurementId: "G-6QEVS4PTVJ"
});

const auth = getAuth(app);

connectAuthEmulator(auth, "http://localhost:9099"); // 让登录注册都走本地

const provider = new GoogleAuthProvider();

// Firestore local
const db = getFirestore(app);
connectFirestoreEmulator(db, "localhost", 8081);

// Functions local
const functions = getFunctions(app);
connectFunctionsEmulator(functions, "localhost", 5001);


export const signInWithGoogle = () => signInWithPopup(auth, provider);

export { auth, db, functions };
