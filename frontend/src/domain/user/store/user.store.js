import { create } from "zustand";
import { auth } from "@/firebase";
  import { _registerUser, _logout, _userLogin } from "../repository/user.repository";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { removeStorage,saveStorage } from "@/utils/helper";


const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => {
    // Clear both Firebase auth and localStorage token
    firebaseSignOut(auth);
    removeStorage("token");
    set({ user: null });
  },
  clearUser: () => set({ user: null }),


  registerUser: async (userData) => {
    await _registerUser(userData).then((res)=>{
      set({userInfo:res.data})
    }).catch((error)=>{
      throw error;
    });
  },


  userLogin: async (userData) => {
    await _userLogin(userData).then((res)=>{
      set({user:res.data.user});
      saveStorage('token', res.data.token)
    }).catch((error)=>{
      console.error("Login failed:", error);
      throw error;
    });
  },


}));

// Listen to Firebase auth state at initialization
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