import React from 'react';
import { Layout, Typography, Card, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  ToolOutlined, 
  SettingOutlined, 
  SafetyOutlined,
  ArrowRightOutlined 
} from '@ant-design/icons';
import styles from './index.module.less';

const { Title, Text } = Typography;
const { Content } = Layout;

const AdminCreate = () => {
  const navigate = useNavigate();

  const checkTypes = [
    {
      id: 'booth',
      title: 'Booth Maintenance Service Check',
      icon: <SettingOutlined />,
      color: '#52c41a',
      gradient: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)'
    },
    {
      id: 'pmr',
      title: 'PMR Maintenance Service Check',
      icon: <ToolOutlined />,
      color: '#1890ff',
      gradient: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)'
    },

    {
      id: 'dynapumps',
      title: 'Dynapumps Booth Maintenance Service Check',
      icon: <SafetyOutlined />,
      color: '#722ed1',
      gradient: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)'
    }
  ];

  const handleCardClick = (checkType) => {
    // 跳转到 review-form 页面，并传递检查类型参数
    navigate(`/review-form?type=${checkType.id}`);
  };

  return (
    <Layout className={styles.createLayout}>
      <Content className={styles.content}>

        <Row gutter={[24, 24]} className={styles.cardsContainer}>
          {checkTypes.map((check) => (
            <Col xs={24} sm={12} lg={8} key={check.id}>
              <Card
                className={styles.checkCard}
                hoverable
                onClick={() => handleCardClick(check)}
                style={{
                  background: check.gradient,
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
                      {check.icon}
                    </div>
                  </div>
                  
                  <div className={styles.textContent}>
                    <Title level={4} className={styles.cardTitle}>
                      {check.title}
                    </Title>
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
