import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Menu, Avatar, Dropdown, Space, theme, Button, Typography } from 'antd';
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

  // 判断当前角色是不是employee/inspector
  const roleStr = (userRole || '').toString().toLowerCase();
  const isInspector = roleStr === 'primary';


  const getDisplayNameFromEmail = (email) => {
    if (!email) return 'User';
    const local = email.split('@')[0];
    return local
      .split(/[._-]+/)
      .filter(Boolean)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');
  };

  const displayName = user?.displayName || getDisplayNameFromEmail(user?.email);
  const userEmail = user?.email || '';
  const userInitials = (displayName || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

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

        {/* 中间：导航菜单（绝对居中） */}
        <div className={styles['center-section']}>
          <Button 
            type="text" 
            icon={<HomeOutlined />} 
            onClick={() => navigate('/')}
            className={`${styles['nav-button']} ${location.pathname === '/' ? styles['activeNav'] : ''}`}
          >
            Home
          </Button>
          
          <Dropdown
            menu={{ 
              items: getInspectorMenuItems(),
              className: styles['dropdown-menu']
            }}
            placement="bottom"
            arrow
            trigger={['hover', 'click']}
          >
            <Button className={`${styles['nav-button']} ${location.pathname.startsWith('/pc/') && (location.pathname.includes('create') || location.pathname.includes('inprogress') || location.pathname.includes('approved')) ? styles['activeNav'] : ''}`}>
              <FileTextOutlined />
              Inspector
              <DownOutlined style={{ fontSize: '10px', marginLeft: '4px' }} />
            </Button>
          </Dropdown>
          
          {/* 当登录的角色是inspector，不显示review那一栏 */}
          {!isInspector && (
            <Dropdown
              menu={{ 
                items: getReviewMenuItems(),
                className: styles['dropdown-menu']
              }}
              placement="bottom"
              arrow
              trigger={['hover', 'click']}
            >
              <Button className={`${styles['nav-button']} ${location.pathname.startsWith('/pc/') && (location.pathname.includes('to-review') || location.pathname.includes('reviewed') || location.pathname.includes('review-form')) ? styles['activeNav'] : ''}`}>
                <EyeOutlined />
                Review
                <DownOutlined style={{ fontSize: '10px', marginLeft: '4px' }} />
              </Button>
            </Dropdown>
          )}
        </div>

        {/* 右侧：用户信息（固定最大宽度，右向左扩展） */}
        <div className={styles['right-section']}>
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
          >
            <Space className={styles['user-dropdown']}>
              <div className={styles['user-info']}>
                <div className={styles['user-text']}>
                  <div className={styles['user-name']}>{displayName}</div>
                  <div className={styles['user-email']}>{userEmail}</div>
                </div>
                <Avatar
                  size={36}
                  src={user?.photoURL || undefined}
                  style={{ backgroundColor: '#e6f4ff', color: '#1677ff', flex: '0 0 auto', fontWeight: 600, fontSize: 14 }}
                >
                  {userInitials}
                </Avatar>
              </div>
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
