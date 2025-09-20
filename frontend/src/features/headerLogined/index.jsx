
import React, { useState } from 'react';
import useUserStore from '@/domain/user/store/user.store';
import styles from './index.module.less';

const HeaderLogined = () => {
  const { user, logout } = useUserStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.userProfile} onClick={toggleDropdown}>
          <div className={styles.avatar}>
            {getUserInitials(user?.displayName || 'User')}
          </div>
          <span className={styles.userName}>
            {user?.displayName || 'User Name'}
          </span>
          <div className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.rotated : ''}`}>
            ▼
          </div>
        </div>
      </div>

      {isDropdownOpen && (
        <div className={styles.dropdown}>
          <div className={styles.profileSummary}>
            <div className={styles.largeAvatar}>
              {getUserInitials(user?.displayName || 'User')}
              <div className={styles.editIcon}>✏️</div>
            </div>
            <h3 className={styles.profileName}>
              {user?.displayName || 'User Name'}
            </h3>
            <p className={styles.profileEmail}>
              {user?.email || 'user@example.com'}
            </p>
          </div>

          <div className={styles.separator}></div>

          <button className={styles.logoutButton} onClick={handleLogout}>
            <span className={styles.logoutIcon}>⎋</span>
            <span>Log out</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default HeaderLogined;