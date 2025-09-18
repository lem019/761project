import React from 'react';
import styles from './CreateMenu.module.less';

const CreateMenu = () => {
  const menuItems = [
    { formId: 1, formname: 'PMR Maintenance Service Check', onClick: () => console.log('PMR Maintenance Service Check clicked') },
    { formId: 2, formname: 'Booth Maintenance Service Check', onClick: () => console.log('Booth Maintenance Service Check clicked') },
    { formId: 3, formname: 'Dynapumps Booth Maintenance Service Check', onClick: () => console.log('Dynapumps Booth Maintenance Service Check clicked') }
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
