import React from "react";
import Logo from "./components/Logo";
import RegisterForm from "./components/RegisterForm";
import styles from "./index.module.less";

const RegisterPage = () => {
  return (
    <div className={styles.register_container}>
      <div className={styles.left_section}>
        <Logo />
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;


