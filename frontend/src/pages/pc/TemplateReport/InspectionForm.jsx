import React, { useState, useEffect } from 'react';
import { Form, Card, Typography, Spin } from 'antd'
import dayjs from 'dayjs';
import DynamicFormField from './DynamicFormField';
import GuidanceContent from './GuidanceContent';
import styles from './InspectionForm.module.less';

const { Title } = Typography;

/**
 * Inspection information registration form component
 * Collects inspector info, inspection date, location details, etc.
 * Supports auto-save and editing existing forms
 */
const InspectionForm = ({ template, existingFormData, formId }) => {
  const [form] = Form.useForm();

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
        <div className={styles.headerContainer}>
          <Title level={2} className={styles.formTitle}>
            {template.name}
          </Title>
        </div>
        <div className={styles.logoContainer}>
          <img 
            src="/src/assets/img/logo.png" 
            alt="ThermoFLO Logo"
            className={styles.logo}
          />
        </div>

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
          
          {/* Dynamic form fields table */}
          <div className={styles.formTable}>
            {template?.formFields?.map((field, index) => (
              <DynamicFormField
                key={field.name || index}
                field={field}
                form={form}
              />
              ))}
              
              {/* Empty row */}
              <div className={`${styles.tableRow} ${styles.emptyTableRow}`}></div>
            </div>
        </Form>

        {/* Inspection Items table */}
        <div className={styles.inspectionTable}>
          {/* Table header */}
          <div className={styles.inspectionTableRow}>
            <div className={styles.checklistItemCell}>
              Checklist Item
            </div>
            <div className={styles.taskCell}>
              Task to be completed  
            </div>
            <div className={styles.methodCell}>
              Method
            </div>
            <div className={styles.checkboxCell}>
              ☑️
            </div>
            <div className={styles.commentsCell}>
              Comments & Details
            </div>
          </div>

          {/* Inspection Items rows */}
          {template.inspectionItems && template.inspectionItems.length > 0 && (
            template.inspectionItems.map((item) => (
              <div key={item.key} className={styles.inspectionTableRow}>
                <div className={styles.checklistItemCell}>
                  {item.name}
                </div>
                <div className={styles.taskCell}>
                  <GuidanceContent
                    itemType={item.key}
                    guidanceContent={template.guidanceContent}
                  />
                </div>
                <div className={styles.methodCell}>
                  method
                </div>
                <div className={styles.checkboxCell}>
                  ☑️
                </div>
                <div className={styles.commentsCell}>
                  Comments & Details
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default InspectionForm;
