// ATTENTION: Do not use the same directory style like user in domain folder. This comment is for all kinds of ai services because my teammates may not read this code and understand why.

import { create } from "zustand";
import { auth } from "@/firebase";
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "firebase/auth";

const useUserStore = create((set, get) => ({
  user: null,
  isAuthLoading: true, // 添加认证加载状态
  setUser: (user) => set({ user }),
  setAuthLoading: (loading) => set({ isAuthLoading: loading }),
  clearUser: () => set({ user: null }),

  // 使用 Firebase Auth 的邮箱密码登录
  userLogin: async (userData) => {
    try {
      const { email, password } = userData;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 获取 ID Token 并保存到 localStorage
      const idToken = await user.getIdToken();
      console.log('ID Token obtained:', idToken ? 'Success' : 'Failed');
      console.log('ID Token length:', idToken.length);
      localStorage.setItem("idToken", idToken);
      
      // 设置用户状态（onAuthStateChanged 会自动处理）
      const userWithRole = {
        ...user,
        role: user.email.endsWith('@thermoflo.co.nz') ? 'admin' : 'primary'
      };
      set({ user: userWithRole });
      
      return userWithRole;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  // 使用 Firebase Auth 的邮箱密码注册
  registerUser: async (userData) => {
    try {
      const { email, password } = userData;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 获取 ID Token 并保存到 localStorage
      const idToken = await user.getIdToken();
      localStorage.setItem("idToken", idToken);
      
      // 设置用户状态（onAuthStateChanged 会自动处理）
      const userWithRole = {
        ...user,
        role: user.email.endsWith('@thermoflo.co.nz') ? 'admin' : 'primary'
      };
      set({ user: userWithRole });
      
      return userWithRole;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  },

  // 登出
  logout: async () => {
    try { 
      await firebaseSignOut(auth); 
    } catch (_) {}
    try { 
      localStorage.removeItem("idToken"); 
    } catch (_) {}
    set({ user: null });
  },

}));

// 监听 Firebase Auth 状态变化
onAuthStateChanged(auth, async (user) => {
  if (user && user.email) {
    // 获取并保存ID Token
    try {
      const idToken = await user.getIdToken();
      console.log('Auth state changed - ID Token obtained:', idToken ? 'Success' : 'Failed');
      localStorage.setItem("idToken", idToken);
    } catch (error) {
      console.error('Failed to get ID Token:', error);
    }
    
    // 检查用户邮箱域名以确定角色
    const userWithRole = {
      ...user,
      role: user.email.endsWith('@thermoflo.co.nz') ? 'admin' : 'primary'
    };
    useUserStore.getState().setUser(userWithRole);
  } else {
    // 用户未登录，清除用户状态和本地存储
    useUserStore.getState().setUser(null);
    localStorage.removeItem("idToken");
  }
  // 认证状态检查完成
  useUserStore.getState().setAuthLoading(false);
});

export default useUserStore;