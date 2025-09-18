import React from 'react';
import { Layout, Dropdown, Avatar, Space, theme } from 'antd';
import { UserOutlined, DownOutlined } from '@ant-design/icons';
import useUserStore from "@/domain/user/store/user.store";
import logo from '@/assets/thermoFLO_Final_colour.png';
import styles from './navibar.module.less';
import MenuTop from '@/components/layout/Menu/menu';


const { Header } = Layout;


const Navibar = () => {
  const user = useUserStore((state) => state.user);
  const userName = user?.email;

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    // {
    //   key: 'profile',
    //   label: 'Profile',
    // },
    // {
    //   key: 'settings',
    //   label: 'Settings',
    // },
    // {
    //   type: 'divider',
    // },
    {
      key: 'logout',
      label: 'Logout',
    },
  ];

  return (
    <Header className={styles.header} style={{ backgroundColor: colorBgContainer }}>
      <div className={styles['logo-container']}>
        <img src={logo} alt="SportsBuddy Logo" className={styles['logo-img']} />
      </div>
      <div className={styles['menu-container']}>
        <MenuTop />
      </div>
      <div className={styles['switch-container']}>
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
      </div>

    </Header>
  );
};

export default Navibar;