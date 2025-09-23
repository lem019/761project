import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Card, Typography, message, Spin } from 'antd';
import { SaveOutlined, DownloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import DynamicFormField from './DynamicFormField';
import GuidanceContent from './GuidanceContent';
import styles from './InspectionForm.module.less';
import { FORM_STATUS } from '@/constants/formStatus';

const { Title } = Typography;

/**
 * Inspection information registration form component
 * Collects inspector info, inspection date, location details, etc.
 * Supports auto-save and editing existing forms
 */
const InspectionForm = ({ template, existingFormData, formId, onDownload }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState({});
  const [currentFormId, setCurrentFormId] = useState(formId);

  // 当formId prop变化时，更新本地状态
  useEffect(() => {
    setCurrentFormId(formId);
  }, [formId]);

  // 初始化表单数据
  useEffect(() => {
    if (existingFormData) {
      // 设置表单初始值 - 使用metaData中的表单字段数据
      const formValues = {
        ...existingFormData.metaData,
        inspectionItems: existingFormData.inspectionData
      };

      // 处理日期字段 - 将字符串转换为dayjs对象
      if (formValues.date && typeof formValues.date === 'string') {
        console.log('Original date string:', formValues.date);
        // 尝试多种日期格式
        let parsedDate = dayjs(formValues.date, 'DD/MM/YYYY');
        if (!parsedDate.isValid()) {
          parsedDate = dayjs(formValues.date, 'YYYY-MM-DD');
        }
        if (!parsedDate.isValid()) {
          parsedDate = dayjs(formValues.date);
        }
        console.log('Parsed date:', parsedDate, 'isValid:', parsedDate.isValid());
        formValues.date = parsedDate.isValid() ? parsedDate : formValues.date;
      }

      console.log('Setting form values:', formValues);
      form.setFieldsValue(formValues);
    }
  }, [existingFormData, form]);


  if (!template) {
    return (
      <div className={styles.container}>
        <Card className={styles.formCard}>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '20px' }}>Loading Form...</div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Card className={styles.formCard}>
        <Title level={2} className={styles.formTitle}>
          {template.name}
        </Title>

        {template.description && (
          <div className={styles.templateDescription}>
            {template.description}
          </div>
        )}

        <Form
          form={form}
          layout="vertical"
          className={styles.form}
          size="large"
        >
          {/* Render dynamic form fields */}
          {template?.formFields?.map((field, index) => (
            <DynamicFormField
              key={field.name || index}
              field={field}
              form={form}
            />
          ))}

          {/* Inspection items */}
          <Form.Item
              label="Inspection Items"
              name="inspectionItems"
              className={`${styles.formItem} ${styles.inspectionItemsLabel}`}
          >
          {template.inspectionItems && template.inspectionItems.length > 0 && (
            <div className={styles.inspectionTable}>
              {template.inspectionItems.map((item) => (
                <div key={item.key} className={styles.inspectionRow}>
                  <div className={styles.inspectionLabel}>
                    {item.name}
                  </div>
                  <div className={styles.inspectionGuidance}>
                    <GuidanceContent
                      itemType={item.key}
                      guidanceContent={template.guidanceContent}
                    />
                  </div>
                  <div className={styles.inspectionMethod}>
                    method
                  </div>
                  <div className={styles.inspectionFileAddress}>
                    file address
                  </div>
                </div>
              ))}
            </div>
          )}
          </Form.Item>
        </Form>
        {/* 下载按钮 */}
        {onDownload && (
          <div className={styles.downloadButtonSection}>
            <Button
              type="primary"
              size="large"
              className={styles.downloadBtn}
              onClick={onDownload}
              icon={<DownloadOutlined />}
            >
              Download PDF
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default InspectionForm;
