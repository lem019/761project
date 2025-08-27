import React from "react";
import logo from "@/assets/img/logo.png";
import styles from '../index.module.less';


export default function Logo() {
  return (
    <div className={styles.logo}>
      <img src={logo} alt="thermo Logo" className={styles.logo_img} />
    </div>
  );
}
