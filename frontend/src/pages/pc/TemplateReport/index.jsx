import React, { useState, useEffect } from 'react';
import { Card, Spin, message, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useParams, useSearchParams } from 'react-router-dom';
import { getFormData, getFormTemplateById } from '@/services/form-service';
import InspectionForm from './InspectionForm';
import styles from './index.module.less';
import html2pdf from 'html2pdf.js';
import inspectionStyles from './InspectionForm.module.less';

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
      message.loading('Generating PDF...', 2);
      
      // 等待页面完全渲染
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 获取要转换的元素
      const element = document.querySelector(`.${inspectionStyles.container}`);
      if (!element) {
        message.error('Content to download not found');
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
        element.style.marginLeft = '60px'; // 增加左边距
        element.style.paddingLeft = '40px'; // 额外的内边距
        element.style.paddingBottom = '150px'; // 极大幅增加底部内边距确保内容不被截断
        element.style.marginBottom = '80px'; // 极大的底部边距
        element.style.minHeight = '200vh'; // 确保容器有充足的高度

        // 修复标题字体重叠问题
        const titleElement = element.querySelector('.formTitle, h1, h2, h3');
        if (titleElement) {
          titleElement.style.fontFamily = 'Arial, sans-serif';
          titleElement.style.letterSpacing = '1px';
          titleElement.style.wordSpacing = '2px';
          titleElement.style.fontWeight = '600';
          titleElement.style.textRendering = 'optimizeLegibility';
          titleElement.style.webkitFontSmoothing = 'antialiased';
          titleElement.style.whiteSpace = 'nowrap';
          titleElement.style.overflow = 'visible';
          titleElement.style.lineHeight = '1.2';
          titleElement.style.textShadow = 'none';
        }
        
        // 特别处理inspection items表格，确保完整显示
        const inspectionTable = element.querySelector('.inspectionTable');
        if (inspectionTable) {
          inspectionTable.style.height = 'auto';
          inspectionTable.style.maxHeight = 'none';
          inspectionTable.style.overflow = 'visible';
          inspectionTable.style.display = 'table';
          inspectionTable.style.width = '100%';
          inspectionTable.style.borderCollapse = 'collapse';
          inspectionTable.style.pageBreakInside = 'auto';
          inspectionTable.style.marginBottom = '800px'; // 极大幅增加底部边距确保完整显示
          inspectionTable.style.paddingBottom = '400px'; // 大幅增加内边距
        }
        
        // 处理所有表格行，确保它们都能显示
        const inspectionRows = element.querySelectorAll('.inspectionRow');
        inspectionRows.forEach((row, index) => {
          row.style.height = 'auto';
          row.style.maxHeight = 'none';
          row.style.overflow = 'visible';
          row.style.display = 'table-row';
          row.style.pageBreakInside = 'avoid';
          row.style.pageBreakAfter = 'auto';
          row.style.border = '1px solid #000';
          row.style.minHeight = '40px'; // 确保行有足够的最小高度
        });
        
        // 特别处理最后一行，确保不被截断
        if (inspectionRows.length > 0) {
          const lastRow = inspectionRows[inspectionRows.length - 1];
          lastRow.style.marginBottom = '300px'; // 大幅增加最后一行底部边距
          lastRow.style.paddingBottom = '200px'; // 大幅增加最后一行内边距
          lastRow.style.pageBreakInside = 'avoid'; // 避免最后一行被分页截断
        }
        
        // 特别处理最后一行中的所有内容，确保完整显示
        const lastRowCells = element.querySelectorAll('.inspectionTable .inspectionRow:last-child *');
        lastRowCells.forEach((cell) => {
          cell.style.marginBottom = '100px';
          cell.style.paddingBottom = '80px';
          cell.style.overflow = 'visible';
          cell.style.pageBreakInside = 'avoid';
        });
        
        // 确保表格内的所有内容都可见，包括视频按钮等
        const allContentInTable = element.querySelectorAll('.inspectionTable *');
        allContentInTable.forEach(el => {
          el.style.overflow = 'visible';
          el.style.maxHeight = 'none';
          el.style.height = 'auto';
        });

      // 生成文件名
      const templateName = template?.name || 'Inspection';
      const currentDate = new Date().toISOString().split('T')[0];
      const formIdSuffix = id ? `_${id}` : '';
      const filename = `${templateName}_${currentDate}${formIdSuffix}.pdf`;

      // PDF生成选项
      const options = {
        margin: [15, 15, 15, 15], // 页边距 [top, left, bottom, right] mm - 大幅增加底部边距
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
          logging: true, // 重新启用日志查看问题
          height: element.scrollHeight + 2000, // 极大幅增加额外高度缓冲确保内容完整
          width: element.scrollWidth + 200,    // 增加宽度缓冲
          scrollX: 0,
          scrollY: 0,
          backgroundColor: '#ffffff',
          foreignObjectRendering: false,
          ignoreElements: function(element) {
            return false;
          },
          onclone: function(clonedDoc) {
            // 在克隆文档中进一步优化标题渲染
            const clonedTitle = clonedDoc.querySelector('.formTitle, h1, h2, h3');
            if (clonedTitle) {
              clonedTitle.style.fontFamily = 'Arial, sans-serif';
              clonedTitle.style.letterSpacing = '1.5px';
              clonedTitle.style.wordSpacing = '2px';
              clonedTitle.style.fontWeight = '600';
              clonedTitle.style.textRendering = 'optimizeLegibility';
              clonedTitle.style.webkitFontSmoothing = 'antialiased';
              clonedTitle.style.whiteSpace = 'nowrap';
              clonedTitle.style.lineHeight = '1.3';
              clonedTitle.style.display = 'block';
              clonedTitle.style.textShadow = 'none';
              clonedTitle.style.fontSize = '24px';
            }
            
            // 特别处理克隆文档中的inspection table
            const clonedInspectionTable = clonedDoc.querySelector('.inspectionTable');
            if (clonedInspectionTable) {
              clonedInspectionTable.style.height = 'auto';
              clonedInspectionTable.style.maxHeight = 'none';
              clonedInspectionTable.style.overflow = 'visible';
              clonedInspectionTable.style.display = 'table';
              clonedInspectionTable.style.width = '100%';
              clonedInspectionTable.style.borderCollapse = 'collapse';
              clonedInspectionTable.style.pageBreakInside = 'auto';
            }
            
            // 处理克隆文档中的所有表格行
            const clonedInspectionRows = clonedDoc.querySelectorAll('.inspectionRow');
            clonedInspectionRows.forEach((row, index) => {
              row.style.height = 'auto';
              row.style.maxHeight = 'none';
              row.style.overflow = 'visible';
              row.style.display = 'table-row';
              row.style.pageBreakInside = 'avoid';
              row.style.pageBreakAfter = 'auto';
              row.style.border = '1px solid #000';
              row.style.minHeight = '40px';
            });
            
            // 特别处理克隆文档中的最后一行
            if (clonedInspectionRows.length > 0) {
              const clonedLastRow = clonedInspectionRows[clonedInspectionRows.length - 1];
              clonedLastRow.style.marginBottom = '300px'; // 大幅增加最后一行底部边距
              clonedLastRow.style.paddingBottom = '200px'; // 大幅增加最后一行内边距
              clonedLastRow.style.pageBreakInside = 'avoid'; // 避免最后一行被分页截断
            }
            
            // 特别处理克隆文档中最后一行的所有内容
            const clonedLastRowCells = clonedDoc.querySelectorAll('.inspectionTable .inspectionRow:last-child *');
            clonedLastRowCells.forEach((cell) => {
              cell.style.marginBottom = '100px';
              cell.style.paddingBottom = '80px';
              cell.style.overflow = 'visible';
              cell.style.pageBreakInside = 'avoid';
            });
            
            // 确保克隆文档的表格有足够的底部空间
            if (clonedInspectionTable) {
              clonedInspectionTable.style.marginBottom = '800px'; // 极大幅增加底部边距
              clonedInspectionTable.style.paddingBottom = '400px'; // 大幅增加内边距
            }
            
            // 确保克隆文档的主容器有足够的底部空间
            if (clonedDoc.body) {
              clonedDoc.body.style.paddingBottom = '1000px';
              clonedDoc.body.style.marginBottom = '500px';
              clonedDoc.body.style.minHeight = '200vh';
            }
            
            // 确保克隆文档中所有内容都有足够的空间
            const clonedMainContainer = clonedDoc.querySelector('[class*="container"]');
            if (clonedMainContainer) {
              clonedMainContainer.style.paddingBottom = '1000px';
              clonedMainContainer.style.marginBottom = '500px';
              clonedMainContainer.style.minHeight = '200vh';
            }
            
            // 确保克隆文档中表格内的所有内容都可见
            const allClonedContentInTable = clonedDoc.querySelectorAll('.inspectionTable *');
            allClonedContentInTable.forEach(el => {
              el.style.overflow = 'visible';
              el.style.maxHeight = 'none';
              el.style.height = 'auto';
              el.style.display = el.style.display || 'block';
            });
            
            // 优化所有文本元素
            const allTextElements = clonedDoc.querySelectorAll('*');
            allTextElements.forEach(el => {
              if (el.nodeType === Node.ELEMENT_NODE) {
                el.style.textRendering = 'optimizeLegibility';
                el.style.webkitFontSmoothing = 'antialiased';
              }
            });
          }
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
        element.style.marginLeft = '';
        element.style.paddingLeft = '';
        element.style.paddingBottom = '';
        element.style.marginBottom = '';
        element.style.minHeight = '';
        
        // 恢复标题样式
        const titleElement = element.querySelector('.formTitle, h1, h2, h3');
        if (titleElement) {
          titleElement.style.fontFamily = '';
          titleElement.style.letterSpacing = '';
          titleElement.style.wordSpacing = '';
          titleElement.style.fontWeight = '';
          titleElement.style.textRendering = '';
          titleElement.style.webkitFontSmoothing = '';
          titleElement.style.whiteSpace = '';
          titleElement.style.overflow = '';
          titleElement.style.lineHeight = '';
          titleElement.style.textShadow = '';
        }
        
        // 恢复表格样式
        const inspectionTable = element.querySelector('.inspectionTable');
        if (inspectionTable) {
          inspectionTable.style.height = '';
          inspectionTable.style.maxHeight = '';
          inspectionTable.style.overflow = '';
          inspectionTable.style.display = '';
          inspectionTable.style.width = '';
          inspectionTable.style.borderCollapse = '';
          inspectionTable.style.pageBreakInside = '';
          inspectionTable.style.marginBottom = '';
          inspectionTable.style.paddingBottom = '';
        }
        
        // 恢复最后一行及其内容的样式
        const lastRowCells = element.querySelectorAll('.inspectionTable .inspectionRow:last-child *');
        lastRowCells.forEach((cell) => {
          cell.style.marginBottom = '';
          cell.style.paddingBottom = '';
          cell.style.overflow = '';
          cell.style.pageBreakInside = '';
        });
        
        // 恢复表格内所有元素的样式
        const allContentInTable = element.querySelectorAll('.inspectionTable *');
        allContentInTable.forEach(el => {
          el.style.overflow = '';
          el.style.maxHeight = '';
          el.style.height = '';
        });
        
        // 恢复表格行样式
        const inspectionRows = element.querySelectorAll('.inspectionRow');
        inspectionRows.forEach((row) => {
          row.style.height = '';
          row.style.maxHeight = '';
          row.style.overflow = '';
          row.style.display = '';
          row.style.pageBreakInside = '';
          row.style.pageBreakAfter = '';
          row.style.border = '';
          row.style.minHeight = '';
          row.style.marginBottom = '';
          row.style.paddingBottom = '';
          row.style.pageBreakInside = '';
        });
        
        message.success('PDF downloaded successfully!');
      }, 1000);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      message.error('PDF generation failed, please try again');
    }
  };

  return (
    <div className={styles.templateContainer}>
      <InspectionForm 
        template={template} 
        existingFormData={existingFormData} 
        formId={id} 
      />
      
      {/* Download Button Section - Moved to index main page */}
      <div className={styles.downloadButtonSection}>
        <Button
          type="primary"
          size="large"
          className={styles.downloadBtn}
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