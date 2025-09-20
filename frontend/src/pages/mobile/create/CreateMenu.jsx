import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreateMenu.module.less';

const CreateMenu = () => {
  const navigate = useNavigate();
  const menuItems = [
    { formId: 1, formname: 'PMR Maintenance Service Check', onClick: () => navigate('/mobile/template') },
    { formId: 2, formname: 'Booth Maintenance Service Check', onClick: () => navigate('/mobile/template') },
    { formId: 3, formname: 'Dynapumps Booth Maintenance Service Check', onClick: () => navigate('/mobile/template') }
  ];

  
  // renders a menu with several items. Each item is represented as a button
  return (
    <div className={styles.menu}>
      {menuItems.map((item) => (
        <button
          key={item.formId}
          className={styles.menuItem}
          onClick={item.onClick}
        >
          {item.formname}
        </button>
      ))}
    </div>
  );
};

export default CreateMenu;
