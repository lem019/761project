import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/img/logo.png";
import useUserStore from "@/domain/user/store/user.store";
import styles from "./index.module.less";

const userName = "Serati Ma"; // 假设用户名
// tabs 由父组件传递

const MobileHeader = ({ tabs, activeTab, onTabChange }) => {
  const { user } = useUserStore();
  //const userName = user?.email;
  const [showMenu, setShowMenu] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <>
      <div className={styles.header}>
        <img src={logo} alt="logo" className={styles.logo} />
        <div className={styles.userBox}>
          <span className={styles.user} onClick={() => setShowMenu(!showMenu)}>
            {userName} ▼
          </span>
          {showMenu && (
            <div className={styles.dropdown}>
              <div className={styles.menuItem} onClick={handleLogout}>
                Log out
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.tabs}>
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            className={
              idx === activeTab
                ? `${styles.tab} ${styles.active}`
                : styles.tab
            }
            onClick={() => onTabChange(idx)}
          >
            {tab}
          </button>
        ))}
      </div>
    </>
  );
};

export default MobileHeader;
