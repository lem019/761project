import React, { useState, useEffect } from 'react';
import { Card, Button, Spin, message } from 'antd';
import { useParams, useSearchParams } from 'react-router-dom';
import { DownloadOutlined } from '@ant-design/icons';
import { getFormData, getFormTemplateById } from '@/services/form-service';
import InspectionForm from './InspectionForm';
import styles from './index.module.less';

/**
 * Main Template Page Component
 * Fetches template data based on templateId from URL params
 * If id is provided, also loads existing form data for editing
 */
const TemplateReport = () => {
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
          <div style={{ textAlign: 'center', padding: '10px' }}>
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

  const handleLoad = async () => {
    try {
      message.loading('正在准备下载...', 1);
      
      // 等待一小段时间确保页面完全渲染
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 强制展开所有可能有滚动条的容器
      const scrollableElements = document.querySelectorAll('[style*="overflow"], [style*="height"], [style*="max-height"]');
      scrollableElements.forEach(element => {
        element.style.overflow = 'visible';
        element.style.height = 'auto';
        element.style.maxHeight = 'none';
        element.style.minHeight = 'auto';
      });
      
      // 特别处理 Ant Design 的容器
      const antElements = document.querySelectorAll('.ant-card-body, .ant-form, .ant-table-container, .ant-table-content');
      antElements.forEach(element => {
        element.style.overflow = 'visible';
        element.style.height = 'auto';
        element.style.maxHeight = 'none';
        element.style.minHeight = 'auto';
      });
      
      // 准备打印样式 - 确保完整内容无滚动条
      const printStyles = `
        <style>
          @media print {
            * {
              visibility: hidden;
              overflow: visible !important;
              height: auto !important;
              max-height: none !important;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              height: auto !important;
              overflow: visible !important;
              background: white !important;
            }
            .${styles.templateContainer}, 
            .${styles.templateContainer} * {
              visibility: visible;
              overflow: visible !important;
              height: auto !important;
              max-height: none !important;
              min-height: auto !important;
            }
            .${styles.loadButtonContainer} {
              display: none !important;
            }
            .${styles.templateContainer} {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: auto;
              min-height: auto;
              max-height: none;
              overflow: visible;
            }
            .ant-card, .ant-card-body, .ant-form, .ant-table {
              height: auto !important;
              max-height: none !important;
              overflow: visible !important;
            }
            @page {
              margin: 0.5in;
              size: A4;
            }
          }
        </style>
      `;
      
      // 添加打印样式到页面
      const styleElement = document.createElement('style');
      styleElement.innerHTML = printStyles;
      document.head.appendChild(styleElement);
      
      // 触发打印对话框
      window.print();
      
      // 清理样式和恢复原始状态
      setTimeout(() => {
        document.head.removeChild(styleElement);
        
        // 恢复原始的样式（重新加载页面可能是最简单的方法，但会丢失用户数据）
        // 这里我们只清理临时添加的样式，保持DOM状态
        
        message.info('如需继续编辑表单，建议刷新页面恢复正常显示', 3);
      }, 1000);
      
      message.success('下载准备完成！请在打印对话框中选择"保存为PDF"');
      
    } catch (error) {
      console.error('Download failed:', error);
      message.error('下载失败，请重试');
    }
  };

  return (
    <div className={styles.templateContainer}>
      <InspectionForm template={template} existingFormData={existingFormData} formId={id} />
      <div className={styles.loadButtonContainer}>
        <Button
          type="primary"
          size="large"
          className={styles.loadBtn}
          onClick={handleLoad}
          icon={<DownloadOutlined />}
        >
          Download PDF
        </Button>
      </div>
    </div>
  );
};

export default TemplateReport;