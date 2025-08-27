import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.less";
import useUserStore from "@/domain/user/store/user.store";
import { signInWithGoogle } from "@/firebase";
import { Button } from "antd";
import logo from "@/assets/img/logo.png";
import googleIcon from "@/assets/img/google.svg";

const LoginButton = () => {
  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    }
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
  const { user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/form-list');
    }
  }, [user, navigate]);

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
