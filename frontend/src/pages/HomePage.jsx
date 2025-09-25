import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col, Typography, Avatar } from 'antd';
import { 
  PlusOutlined, 
  SettingOutlined, 
  ToolOutlined, 
  ThunderboltOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import useUserStore from '@/domain/user/store/user.store';
import styles from './HomePage.module.less';

const { Title, Paragraph, Text } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const userName = user?.email?.split('@')[0] || 'User';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  const handleStartInspection = () => {
    // 根据屏幕宽度决定跳转到移动端还是PC端
    const isMobile = window.innerWidth <= 768;
    navigate(isMobile ? '/mobile/create' : '/pc/create');
  };

  const handleUserGuide = () => {
    // 可以添加用户指南的跳转逻辑
    console.log('打开用户指南');
  };

  const handleVideoTutorial = () => {
    // 可以添加视频教程的跳转逻辑
    console.log('打开视频教程');
  };

  return (
    <div className={styles.homePage}>
      {/* 主要内容区域（通用组件，不包含导航） */}
      <main className={styles.mainContent}>
        {/* 欢迎区域 */}
        <section className={styles.welcomeSection}>
          <div className={styles.welcomeContent}>
            <Title level={1} className={styles.mainTitle}>
              Welcome to ThermoFlo Inspection System
            </Title>
            <Paragraph className={styles.subtitle}>
              Streamline your inspection processes with our comprehensive digital platform. 
              Start creating professional inspection reports today.
            </Paragraph>

            {/* Start New Inspection 按钮 */}
            <Button 
              type="primary" 
              size="large"
              icon={<PlusOutlined />}
              className={styles.startButton}
              onClick={handleStartInspection}
            >
              Start New Inspection
            </Button>

            {/* 系统操作指南卡片（与下方卡片同宽） */}
            <Card className={styles.guideCard}>
              <div className={styles.guideButtons}>
                <Button 
                  type="default" 
                  icon={<FileTextOutlined />}
                  className={styles.guideButton}
                  onClick={handleUserGuide}
                >
                  User Guide
                </Button>
                <Button 
                  type="default" 
                  icon={<PlayCircleOutlined />}
                  className={styles.guideButton}
                  onClick={handleVideoTutorial}
                >
                  Video Tutorial
                </Button>
              </div>
              <div className={styles.guideContent}>
                <div className={styles.guideText}>
                  <Title level={3} className={styles.guideTitle}>
                    System & Operation Guide
                  </Title>
                  <Paragraph className={styles.guideDescription}>
                    Access comprehensive guides and training materials for the inspection system
                  </Paragraph>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* 功能卡片区域 */}
        <section className={styles.featuresSection}>
          <Row gutter={[24, 24]} className={styles.featureCards}>
            <Col xs={24} sm={12} lg={8}>
              <Card className={`${styles.featureCard} ${styles.featureBlue}`}>
                <div className={styles.featureIcon}>
                  <SettingOutlined style={{ color: '#fff' }} />
                </div>
                <Title level={4} className={styles.featureTitle}>
                  Equipment Maintenance
                </Title>
                <Paragraph className={styles.featureDescription}>
                  Comprehensive maintenance inspections for all your equipment and systems
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={8}>
              <Card className={`${styles.featureCard} ${styles.featureRed}`}>
                <div className={styles.featureIcon}>
                  <ToolOutlined style={{ color: '#fff' }} />
                </div>
                <Title level={4} className={styles.featureTitle}>
                  System Diagnostics
                </Title>
                <Paragraph className={styles.featureDescription}>
                  Advanced diagnostic tools and reporting for optimal system performance
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={8}>
              <Card className={`${styles.featureCard} ${styles.featureOrange}`}>
                <div className={styles.featureIcon}>
                  <ThunderboltOutlined style={{ color: '#fff' }} />
                </div>
                <Title level={4} className={styles.featureTitle}>
                  Compliance Monitoring
                </Title>
                <Paragraph className={styles.featureDescription}>
                  Ensure regulatory compliance with automated monitoring and reporting
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </section>

        {/* 关于我们和服务区域 - 合并为一个卡片 */}
        <section className={styles.aboutSection}>
          <Card className={styles.combinedCard}>
            <Row gutter={[48, 32]}>
              <Col xs={24} lg={12}>
                <div className={styles.aboutContent}>
                  <Title level={3} className={styles.sectionTitle}>
                    About ThermoFlo
                  </Title>
                  <Paragraph className={styles.aboutText}>
                    ThermoFlo is New Zealand's leading provider of thermal and fluid engineering solutions. 
                    Our inspection platform ensures the highest standards of equipment reliability and performance.
                  </Paragraph>
                  <ul className={styles.aboutList}>
                    <li>ISO 9001:2015 Certified</li>
                    <li>25+ Years of Experience</li>
                    <li>New Zealand Wide Service</li>
                  </ul>
                </div>
              </Col>
              
              <Col xs={24} lg={12}>
                <div className={styles.servicesContent}>
                  <Title level={3} className={styles.sectionTitle}>
                    Our Services
                  </Title>
                  <div className={styles.serviceItem}>
                    <Title level={5} className={styles.serviceTitle} style={{ color: '#1890ff' }}>
                      HVAC Systems
                    </Title>
                    <Paragraph className={styles.serviceDescription}>
                      Complete heating, ventilation and cooling solutions
                    </Paragraph>
                  </div>
                  <div className={styles.serviceItem}>
                    <Title level={5} className={styles.serviceTitle} style={{ color: '#1890ff' }}>
                      Industrial Refrigeration
                    </Title>
                    <Paragraph className={styles.serviceDescription}>
                      Custom refrigeration systems and maintenance
                    </Paragraph>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
