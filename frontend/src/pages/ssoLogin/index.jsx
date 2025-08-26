import React from "react";
import styles from "./index.module.less";
import useAuthStore from "@/domain/auth/store/auth.store";
import { signInWithGoogle, auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { Button } from "antd";
import logo from "@/assets/img/logo.png";
import googleIcon from "@/assets/img/google.svg";

const LoginButton = () => {
  const { user, logout } = useAuthStore();
  console.log("user:", user);
  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    logout();
  };

  return (
    <div>
      <Button
        type="default"
        size="large"
        onClick={handleLogin}
        icon={<img className={styles.googleIcon} src={googleIcon} alt="Google" />}
      >
        Continue with Google
      </Button>
    </div>
  );
};

const SSOLoginPage = () => {
  return (
    <div>
      <div className={styles.logoContainer}>
        <img className={styles.logo} src={logo} alt="logo" />
      </div>

      <div className={styles.container}>
        <div className={styles.title}>Login In</div>
        <LoginButton />
      </div>
    </div>
  );
};

export default SSOLoginPage;
