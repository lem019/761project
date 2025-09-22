import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Result, Button, Card, Typography, Space, Spin } from 'antd';
import { CheckCircleOutlined, HomeOutlined, FileTextOutlined } from '@ant-design/icons';
import styles from './index.module.less';

const { Title, Text } = Typography;

/**
 * Form submission success page
 * Displays submission success information and provides options to return home or view forms
 */
const SubmitSuccessPage = () => {
  const { formId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formInfo, setFormInfo] = useState(null);

  // Get form information from route state
  const state = location.state || {};

  useEffect(() => {
    // Simulate loading form information
    const loadFormInfo = async () => {
      try {
        // Here you can call API to get form details
        // const formData = await getFormData(formId);
        // setFormInfo(formData);
        
        // Temporarily use information passed from route
        setFormInfo({
          templateName: state.templateName || 'Inspection Form',
          submittedAt: state.submittedAt || new Date().toLocaleString(),
          status: 'pending'
        });
      } catch (error) {
        console.error('Failed to get form information:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFormInfo();
  }, [formId, state]);

  const handleGoHome = () => {
    navigate('/mobile');
  };

  const handleViewForm = () => {
    navigate(`/mobile/inprogress`);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Spin size="large" />
          <Text>Loading...</Text>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Card className={styles.successCard}>
        <Result
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
          title="Form Submitted Successfully!"
          subTitle={
            <div className={styles.subTitle}>
              <Text>Your inspection form has been successfully submitted and is awaiting review.</Text>
              {formInfo && (
                <div className={styles.formInfo}>
                  <div className={styles.infoItem}>
                    <Text strong>Template Name:</Text>
                    <Text>{formInfo.templateName}</Text>
                  </div>
                  <div className={styles.infoItem}>
                    <Text strong>Submitted At:</Text>
                    <Text>{formInfo.submittedAt}</Text>
                  </div>
                  <div className={styles.infoItem}>
                    <Text strong>Current Status:</Text>
                    <Text type="warning">Pending Review</Text>
                  </div>
                </div>
              )}
            </div>
          }
          extra={
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div className={styles.actionButtons}>
                <Button 
                  type="primary" 
                  icon={<HomeOutlined />}
                  size="large"
                  onClick={handleGoHome}
                  className={styles.actionButton}
                >
                  Return to Home
                </Button>
                <Button 
                  icon={<FileTextOutlined />}
                  size="large"
                  onClick={handleViewForm}
                  className={styles.actionButton}
                >
                  View My Forms
                </Button>
              </div>
              
              <div className={styles.tips}>
                <Title level={5}>Tips:</Title>
                <ul className={styles.tipsList}>
                  <li>You can view all submitted forms in the "In Progress" page</li>
                  <li>You will receive a notification when the administrator completes the review</li>
                  <li>If you have any questions, please contact the administrator</li>
                </ul>
              </div>
            </Space>
          }
        />
      </Card>
    </div>
  );
};

export default SubmitSuccessPage;
