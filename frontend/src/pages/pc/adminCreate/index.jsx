import React, { useState, useEffect } from 'react';
import { Layout, Typography, Card, Row, Col, Spin, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  ToolOutlined, 
  SettingOutlined, 
  SafetyOutlined,
  ArrowRightOutlined 
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
  'SafetyOutlined': <SafetyOutlined />
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
        <Row gutter={[24, 24]} className={styles.cardsContainer}>
          {templates.map((template) => (
            <Col xs={24} sm={12} lg={8} key={template.id}>
              <Card
                className={styles.checkCard}
                hoverable
                onClick={() => handleCardClick(template)}
                style={{
                  background: template.gradient,
                  border: 'none',
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}
              >
                <div className={styles.cardContent}>
                  <div className={styles.iconContainer}>
                    <div 
                      className={styles.iconWrapper}
                      style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white'
                      }}
                    >
                      {iconMap[template.icon]}
                    </div>
                  </div>
                  
                  <div className={styles.textContent}>
                    <Title level={4} className={styles.cardTitle}>
                      {template.name}
                    </Title>
                    <Text className={styles.cardDescription} style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {template.description}
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default AdminCreate;
