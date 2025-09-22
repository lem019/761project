import React, { useState, useEffect } from 'react';
import { Card, Button, Spin } from 'antd';
import { useParams, useSearchParams } from 'react-router-dom';
import { getFormData, getFormTemplateById } from '@/services/form-service';
import InspectionForm from './InspectionForm';
import styles from './index.module.less';

/**
 * Main Template Page Component
 * Fetches template data based on templateId from URL params
 * If id is provided, also loads existing form data for editing
 */
const TemplatePage = () => {
  const { templateId } = useParams();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [template, setTemplate] = useState(null);
  const [existingFormData, setExistingFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!templateId) {
        setError('Template ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // 获取模板数据
        const templateResponse = await getFormTemplateById(templateId);
        console.log('Template response:', templateResponse);
        
        if (templateResponse) {
          setTemplate(templateResponse);
        } else {
          setError(templateResponse?.message || 'Template not found');
          return;
        }

        // 如果有id参数，获取现有的表单数据
        if (id) {
          try {
            const formResponse = await getFormData(id);
            console.log('Existing form data:', formResponse);
            setExistingFormData(formResponse);
          } catch (formErr) {
            console.error('Failed to fetch existing form data:', formErr);
            // 不设置error，允许用户继续创建新表单
          }
        }
      } catch (err) {
        console.error('Failed to fetch template:', err);
        setError('Failed to load template');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [templateId, id]);

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

  return <InspectionForm template={template} existingFormData={existingFormData} formId={id} />;
};

export default TemplatePage;