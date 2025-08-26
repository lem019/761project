import { create } from "zustand";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout:() => set({user:null}),
}));

// Listen to Firebase auth state at initialization
onAuthStateChanged(auth, (user) => {
  useAuthStore.getState().setUser(user);
});

export default useAuthStore;