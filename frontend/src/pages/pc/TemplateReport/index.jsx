import React, { useState, useEffect } from 'react';
import { Card, Spin, message } from 'antd';
import { useParams, useSearchParams } from 'react-router-dom';
import { getFormData, getFormTemplateById } from '@/services/form-service';
import InspectionForm from './InspectionForm';
import styles from './index.module.less';
import html2pdf from 'html2pdf.js';

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

  useEffect(() => {
    const fetchData = async () => {
      if (!templateId) {
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [templateId, id]);

  if (loading) {
    return (
      <div className={styles.templateContainer}>
        <Card className={styles.formCard}>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '20px' }}>Loading template...</div>
          </div>
        </Card>
      </div>
    );
  }

  const handleLoad = async () => {
    try {
      message.loading('正在生成PDF...', 2);
      
      // 等待页面完全渲染
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 获取要转换的元素
      const element = document.querySelector(`.${styles.templateContainer}`);
      if (!element) {
        message.error('未找到要下载的内容');
        return;
      }

      // 临时移除所有高度和滚动限制，确保显示完整内容
      const originalStyles = new Map();
      
      // 保存并修改容器样式
      const allElements = element.querySelectorAll('*');
      allElements.forEach((el, index) => {
        const computedStyle = window.getComputedStyle(el);
        const originalStyle = {
          height: el.style.height,
          maxHeight: el.style.maxHeight,
          minHeight: el.style.minHeight,
          overflow: el.style.overflow,
          overflowY: el.style.overflowY,
        };
        originalStyles.set(index, originalStyle);
        
        // 移除高度和滚动限制
        if (computedStyle.overflow === 'hidden' || computedStyle.overflow === 'auto' || computedStyle.overflow === 'scroll') {
          el.style.overflow = 'visible';
        }
        if (computedStyle.overflowY === 'hidden' || computedStyle.overflowY === 'auto' || computedStyle.overflowY === 'scroll') {
          el.style.overflowY = 'visible';
        }
        if (computedStyle.height && computedStyle.height !== 'auto') {
          el.style.height = 'auto';
        }
        if (computedStyle.maxHeight && computedStyle.maxHeight !== 'none') {
          el.style.maxHeight = 'none';
        }
      });

      // 特别处理主容器
      element.style.height = 'auto';
      element.style.overflow = 'visible';
      element.style.position = 'static';

      // 生成文件名
      const templateName = template?.name || 'Inspection';
      const currentDate = new Date().toISOString().split('T')[0];
      const formIdSuffix = id ? `_${id}` : '';
      const filename = `${templateName}_${currentDate}${formIdSuffix}.pdf`;

      // PDF生成选项
      const options = {
        margin: [15, 15, 15, 15], // 页边距 [top, left, bottom, right] mm
        filename: filename,
        image: { 
          type: 'jpeg', 
          quality: 0.95 
        },
        html2canvas: { 
          scale: 2, // 提高清晰度
          useCORS: true,
          allowTaint: true,
          letterRendering: true,
          logging: false,
          height: element.scrollHeight, // 使用完整高度
          width: element.scrollWidth,   // 使用完整宽度
          scrollX: 0,
          scrollY: 0
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { 
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break-before',
          after: '.page-break-after'
        }
      };

      // 生成PDF
      await html2pdf()
        .set(options)
        .from(element)
        .save();

      // 恢复原始样式
      setTimeout(() => {
        allElements.forEach((el, index) => {
          const originalStyle = originalStyles.get(index);
          if (originalStyle) {
            el.style.height = originalStyle.height;
            el.style.maxHeight = originalStyle.maxHeight;
            el.style.minHeight = originalStyle.minHeight;
            el.style.overflow = originalStyle.overflow;
            el.style.overflowY = originalStyle.overflowY;
          }
        });
        
        // 恢复主容器样式
        element.style.height = '';
        element.style.overflow = '';
        element.style.position = '';
        
        message.success('PDF下载成功！');
      }, 1000);
      
    } catch (error) {
      console.error('PDF生成失败:', error);
      message.error('PDF生成失败，请重试');
    }
  };

  return (
    <div className={styles.templateContainer}>
      <InspectionForm 
        template={template} 
        existingFormData={existingFormData} 
        formId={id} 
        onDownload={handleLoad}
      />
    </div>
  );
};

export default TemplateReport;