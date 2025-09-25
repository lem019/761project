import React, { useState, useEffect } from 'react';
import { Layout, Typography, Card, Row, Col, Spin, message, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  ToolOutlined, 
  SettingOutlined, 
  SafetyOutlined,
  ArrowRightOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import styles from './index.module.less';
import { getFormTemplates } from '@/services/form-service';
import useUserStore from '@/domain/user/store/user.store';

const { Title, Text } = Typography;
const { Content } = Layout;

// 图标映射
const iconMap = {
  'ToolOutlined': <ToolOutlined />,
  'SettingOutlined': <SettingOutlined />,
  'SafetyOutlined': <SafetyOutlined />,
  'ThunderboltOutlined': <ThunderboltOutlined />
};

// 预设的主题渐变背景
const gradientThemes = [
  {
    name: 'blue',
    gradient: 'linear-gradient(to bottom right, #3A73CF, #2d3748)',
    buttonGradient: 'linear-gradient(to right, #3A73CF, #4299e1)',
    buttonHover: 'linear-gradient(to right, #2d3748, #3A73CF)'
  },
  {
    name: 'blue-light',
    gradient: 'linear-gradient(to bottom right, #2563eb, #1e40af)',
    buttonGradient: 'linear-gradient(to right, #2563eb, #3b82f6)',
    buttonHover: 'linear-gradient(to right, #1e40af, #2563eb)'
  },
  {
    name: 'blue-dark',
    gradient: 'linear-gradient(to bottom right, #1e3a8a, #1e293b)',
    buttonGradient: 'linear-gradient(to right, #1e3a8a, #2563eb)',
    buttonHover: 'linear-gradient(to right, #1e293b, #1e3a8a)'
  },
  {
    name: 'teal',
    gradient: 'linear-gradient(to bottom right, #0d9488, #0f766e)',
    buttonGradient: 'linear-gradient(to right, #0d9488, #14b8a6)',
    buttonHover: 'linear-gradient(to right, #0f766e, #0d9488)'
  },
  {
    name: 'indigo',
    gradient: 'linear-gradient(to bottom right, #4f46e5, #3730a3)',
    buttonGradient: 'linear-gradient(to right, #4f46e5, #6366f1)',
    buttonHover: 'linear-gradient(to right, #3730a3, #4f46e5)'
  },
  {
    name: 'cyan',
    gradient: 'linear-gradient(to bottom right, #0891b2, #0e7490)',
    buttonGradient: 'linear-gradient(to right, #0891b2, #06b6d4)',
    buttonHover: 'linear-gradient(to right, #0e7490, #0891b2)'
  },
  {
    name: 'slate',
    gradient: 'linear-gradient(to bottom right, #475569, #334155)',
    buttonGradient: 'linear-gradient(to right, #475569, #64748b)',
    buttonHover: 'linear-gradient(to right, #334155, #475569)'
  }
];

// 根据模板名称生成hash值并选择主题
const getThemeByTemplateName = (templateName) => {
  let hash = 0;
  for (let i = 0; i < templateName.length; i++) {
    const char = templateName.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const themeIndex = Math.abs(hash) % gradientThemes.length;
  return gradientThemes[themeIndex];
};


const AdminCreate = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      // 如果用户未登录，不执行API请求
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getFormTemplates();
        setTemplates(data);
      } catch (error) {
        message.error('获取模板列表失败');
        console.error('获取模板列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [user]);

  const handleCardClick = (template) => {
    // 跳转到模板页面，传递模板ID
    navigate(`/pc/template/${template.id}`);
  };

  if (loading) {
    return (
      <Layout className={styles.createLayout}>
        <Content className={styles.content}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Spin size="large" />
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className={styles.createLayout}>
      <Content className={styles.content}>
        {/* 页面标题部分 */}
        <div className={styles.header}>
          <Title level={1} className={styles.pageTitle}>
            Create New Inspection
          </Title>
          <Text className={styles.subtitle}>
            Choose a template to start your inspection process
          </Text>
        </div>

        {/* 模板卡片部分 */}
        <Row gutter={[24, 24]} className={styles.cardsContainer}>
          {templates.map((template) => {
            const theme = getThemeByTemplateName(template.name);
            return (
              <Col xs={24} sm={12} lg={8} key={template.id}>
                <div 
                  className={styles.templateCard}
                  onClick={() => handleCardClick(template)}
                >
                  {/* 上半部分 - 渐变背景 */}
                  <div 
                    className={styles.cardTopSection}
                    style={{ background: theme.gradient }}
                  >
                    <div className={styles.decorativeCircle}></div>
                    <div className={styles.iconContainer}>
                      <div className={styles.iconWrapper}>
                        {iconMap[template.icon] || <ToolOutlined />}
                      </div>
                    </div>
                    <h3 className={styles.cardTitle}>{template.name}</h3>
                    <p className={styles.cardDescription}>{template.description}</p>
                  </div>
                  
                  {/* 下半部分 - 白色背景 */}
                  <div className={styles.cardBottomSection}>
                    <button 
                      className={styles.startButton}
                      style={{ 
                        background: theme.buttonGradient,
                        '--hover-bg': theme.buttonHover
                      }}
                    >
                      <span className={styles.plusIcon}>+</span>
                      Start Inspection
                      <ArrowRightOutlined className={styles.arrowIcon} />
                    </button>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>

        {/* 更多模板即将推出部分 */}
        <div className={styles.footer}>
          <Card className={styles.comingSoonCard}>
            <div className={styles.comingSoonContent}>
              <Title level={3} className={styles.comingSoonTitle}>
                More Templates Coming Soon
              </Title>
              <Text className={styles.comingSoonText}>
                We're constantly adding new inspection templates. Contact your administrator for custom template requests.
              </Text>
            </div>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default AdminCreate;
