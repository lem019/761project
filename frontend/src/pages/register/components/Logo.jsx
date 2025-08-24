import React from "react";
import logo from "@/assets/img/logo.png";
import styles from '../index.module.less';


export default function Logo() {
  return (
    <div className={styles.logo}>
      <img src={logo} alt="SportsBuddy Logo" className="logo-img" />
    </div>
  );
}
