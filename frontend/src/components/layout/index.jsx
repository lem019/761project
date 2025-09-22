import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Menu, Avatar, Dropdown, Space, theme, Button } from 'antd';
import { HomeOutlined, UserOutlined, DownOutlined, PlusOutlined, ClockCircleOutlined, CheckSquareOutlined, FileTextOutlined, EyeOutlined, FileDoneOutlined, MenuOutlined } from '@ant-design/icons';
import useUserStore from '@/domain/user/store/user.store';
import logo from '@/assets/thermoFLO_Final_colour.png';
import styles from './index.module.less';

const { Header, Content } = AntLayout;

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUserStore((state) => state.user);
  const userRole = user?.role || user?.userRole;
  const userName = user?.email;

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Inspector 下拉菜单项
  const getInspectorMenuItems = () => {
    return [
      { 
        key: '/pc/create', 
        label: 'Create', 
        icon: <PlusOutlined />,
        onClick: () => navigate('/pc/create')
      },
      { 
        key: '/pc/inprogress', 
        label: 'In Progress', 
        icon: <ClockCircleOutlined />,
        onClick: () => navigate('/pc/inprogress')
      },
      { 
        key: '/pc/approved', 
        label: 'Approved', 
        icon: <CheckSquareOutlined />,
        onClick: () => navigate('/pc/approved')
      },
    ];
  };

  // Review 下拉菜单项
  const getReviewMenuItems = () => {
    return [
      { 
        key: '/pc/to-review', 
        label: 'To Review', 
        icon: <FileTextOutlined />,
        onClick: () => navigate('/pc/to-review')
      },
      { 
        key: '/pc/reviewed', 
        label: 'Reviewed', 
        icon: <FileDoneOutlined />,
        onClick: () => navigate('/pc/reviewed')
      },
    ];
  };

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: 'logout',
      label: 'Logout',
      onClick: () => useUserStore.getState().logout(),
    },
  ];

  return (
    <AntLayout className={styles['layout-container']}>
      <Header 
        className={styles.header} 
        style={{ backgroundColor: colorBgContainer }}
      >
        {/* 左侧：Logo */}
        <div className={styles['left-section']}>
          <img src={logo} alt="ThermoFLO Logo" className={styles['logo-img']} />
        </div>

        {/* 中间：导航菜单 */}
        <div className={styles['center-section']}>
          <Button 
            type="text" 
            icon={<HomeOutlined />} 
            onClick={() => navigate('/')}
            className={styles['nav-button']}
          >
            Home
          </Button>
          
          <Dropdown
            menu={{ items: getInspectorMenuItems() }}
            placement="bottom"
            arrow
            trigger={['hover', 'click']}
          >
            <Button className={styles['nav-button']}>
              <FileTextOutlined />
              Inspector
              <DownOutlined style={{ fontSize: '10px', marginLeft: '4px' }} />
            </Button>
          </Dropdown>
          
          <Dropdown
            menu={{ items: getReviewMenuItems() }}
            placement="bottom"
            arrow
            trigger={['hover', 'click']}
          >
            <Button className={styles['nav-button']}>
              <EyeOutlined />
              Review
              <DownOutlined style={{ fontSize: '10px', marginLeft: '4px' }} />
            </Button>
          </Dropdown>
        </div>

        {/* 右侧：用户信息 */}
        <div className={styles['right-section']}>
          <Dropdown
            menu={{ items: userMenuItems }}
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
      <Content className={styles['content-area']}>
        <div className={styles['outlet-container']}>
          {children || <Outlet />}
        </div>
      </Content>
    </AntLayout>
  );
};

export default Layout;
