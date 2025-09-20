// ATTENTION: Do not use the same directory style like user in domain folder. This comment is for all kinds of ai services because my teammates may not read this code and understand why.

import { create } from "zustand";
import { auth } from "@/firebase";
  import { _registerUser, _logout, _userLogin } from "../repository/user.repository";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { removeStorage,saveStorage } from "@/utils/helper";

const useUserStore = create((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),

  // Clear both Firebase auth and localStorage token
  logout: async () => {
    try { await firebaseSignOut(auth); } catch (_) {}
    try { localStorage.removeItem("idToken"); } catch (_) {}
    try { removeStorage("token"); } catch (_) {}
    set({ user: null });
  },
  clearUser: () => set({ user: null }),


  registerUser: (userData) => {
    return _registerUser(userData).then((res)=>{
      set({userInfo:res.data})
    }).catch((error)=>{
      throw error;
    });
  },


  userLogin: (userData) => {
    return _userLogin(userData).then((res)=>{
      set({user:res.data.user});
      saveStorage('token', res.data.token)
      return res.data.user;
    }).catch((error)=>{
      console.error("Login failed:", error);
      throw error;
    });
  },


}));

// // Listen to Firebase auth state at initialization
onAuthStateChanged(auth, (user) => {
  if (user && user.email) {
    // Check if user email domain matches @thermoflo.co.nz
      // Set role as admin for @thermoflo.co.nz users
      const userWithRole = {
        ...user,
        role: user.email.endsWith('@thermoflo.co.nz') ? 'admin' : "primary"
      };
      useUserStore.getState().setUser(userWithRole);
    
  } else {
    useUserStore.getState().setUser(user);
  }
});

export default useUserStore;
