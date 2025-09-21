import React, { useState, useEffect } from 'react';
import { Card, Button, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { getFormTemplateById } from '@/services/templateService';
import InspectionForm from './InspectionForm';
import styles from './index.module.less';

/**
 * Main Template Page Component
 * Fetches template data based on templateId from URL params
 */
const TemplatePage = () => {
  const { templateId } = useParams();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!templateId) {
        setError('Template ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getFormTemplateById(templateId);
        
        console.log('Template response:', response); // 添加调试日志
        
        if (response) {
          setTemplate(response);
        } else {
          // 处理304 Not Modified的情况，数据可能为空
          setError(response?.message || 'Template not found');
        }
      } catch (err) {
        console.error('Failed to fetch template:', err);
        setError('Failed to load template');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <Card className={styles.formCard}>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '20px' }}>Loading template...</div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Card className={styles.formCard}>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div style={{ color: '#ff4d4f', fontSize: '16px', marginBottom: '20px' }}>
              {error}
            </div>
            <Button type="primary" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return <InspectionForm template={template} />;
};

export default TemplatePage;