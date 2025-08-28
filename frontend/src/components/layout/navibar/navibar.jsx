import React from 'react';
import { Layout, Dropdown, Avatar, Space } from 'antd';
import { UserOutlined, DownOutlined } from '@ant-design/icons';
import { userStore } from '@/domain/user/store/user.store';
import logo from '@/assets/thermoFLO_Final_colour.png';
import styles from './navibar.module.less';

const { Header } = Layout;

const Navibar = () => {
  const user = userStore((state) => state.user);
  const userName = user?.name || user?.username || 'Serati Ma';

  const menuItems = [
    {
      key: 'profile',
      label: 'Profile',
    },
    {
      key: 'settings',
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
    },
  ];

  return (
    <Header className={styles.header}>
      <div className={styles['logo-container']}>
        <img src={logo} alt="SportsBuddy Logo" className={styles['logo-img']} />
      </div>
      <Dropdown
        menu={{ items: menuItems }}
        placement="bottomRight"
        arrow
      >
        <Space className={styles['user-dropdown']}>
          <Avatar 
            size="small" 
            icon={<UserOutlined />}
            style={{ backgroundColor: '#1890ff' }}
          />
          <span style={{ color: '#333' }}>{userName}</span>
          <DownOutlined style={{ fontSize: '12px', color: '#666' }} />
        </Space>
      </Dropdown>
    </Header>
  );
};

export default Navibar;