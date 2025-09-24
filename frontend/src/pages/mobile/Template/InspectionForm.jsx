import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Card, Typography, message, Spin } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import DynamicFormField from './DynamicFormField';
import GuidanceContent from './GuidanceContent';
import { saveFormData, submitForm } from '@/services/form-service';
import styles from './InspectionForm.module.less';
import { FORM_STATUS } from '@/constants/formStatus';

const { Title } = Typography;

/**
 * Inspection information registration form component
 * Collects inspector info, inspection date, location details, etc.
 * Supports auto-save and editing existing forms
 */
const InspectionForm = ({ template, existingFormData, formId, readOnly }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState({});
  const [lastSaved, setLastSaved] = useState(null);
  const autoSaveTimeoutRef = useRef(null);
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
        formValues.date = parsedDate.isValid() ? parsedDate : null;
      }

      console.log('Setting form values:', formValues);
      form.setFieldsValue(formValues);
    }
  }, [existingFormData, form]);

  // 自动保存功能
  const autoSave = async (values) => {
    if (saving) return; // 防止重复保存

    try {
      setSaving(true);

      // 分离表单字段和检查数据
      const { inspectionItems, ...formFields } = values;

      const formattedValues = {
        id: currentFormId, // 使用本地的formId状态
        type: "a",
        templateId: template.id,
        templateName: template.name,
        metaData: formFields, // 表单字段数据
        inspectionData: inspectionItems || {}, // 检查项数据
        status: FORM_STATUS.DRAFT
      };

      console.log('Saving form data:', formattedValues); // 添加调试日志

      const response = await saveFormData(formattedValues);
      setLastSaved(new Date());

      console.log('currentFormId:', currentFormId, response, !currentFormId && response?.id, response?.id);

      // 如果这是新表单，更新URL中的id并保存formId供下次使用
      if (!currentFormId && response?.id) {
        const newFormId = response.id;
        // 更新本地formId状态
        setCurrentFormId(newFormId);
        // 更新URL
        window.history.replaceState(null, '', `/mobile/template/${template.id}?id=${newFormId}`);
        console.log('New form created with ID:', newFormId);
      }

      console.log('Auto-save successful:', response);
    } catch (error) {
      console.error('Auto-save failed:', error);
      // 自动保存失败不显示错误提示，避免打扰用户
    } finally {
      setSaving(false);
    }
  };

  // 手动保存功能
  const handleManualSave = async () => {
    try {
      const values = await form.validateFields();
      await autoSave(values);
      message.success('表单已保存');
    } catch (error) {
      console.error('Manual save failed:', error);
      message.error('保存失败，请检查表单数据');
    }
  };

  // 监听表单变化，实现自动保存
  const handleFormChange = (changedValues, allValues) => {
    // console.log('Form changed:', changedValues, allValues); // 添加调试日志

    // 清除之前的定时器
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // 设置新的定时器，2秒后自动保存
    autoSaveTimeoutRef.current = setTimeout(async () => {
      try {
        const values = form.getFieldsValue();
        await autoSave(values);
      } catch (error) {
        console.error('Auto-save on change failed:', error);
      }
    }, 2000);
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Toggle expand/collapse for an inspection item when clicked
   * @param {string} itemKey - Key of the inspection item
   */
  const handleInspectionItemClick = (itemKey) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };

  /**
   * Handle form submission
   * @param {Object} values - Form data
   */
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await autoSave(values);
      // 分离表单字段和检查项
    const { inspectionItems, ...formFields } = values;

    // 组装和 autoSave 一样的结构
    const formattedValues = {
      id: currentFormId,
      type: "a",
      templateId: template.id,
      templateName: template.name,
      metaData: formFields, // input 字段
      inspectionData: inspectionItems || {}, // checkbox
      date: values.date ? values.date.format('DD/MM/YYYY') : null
    };

      console.log('Form submit data:', formattedValues);

      // 调用真实的API提交表单
      const result = await submitForm(formattedValues);

      if (result.success) {
        // 显示成功消息
        message.success('表单提交成功！');

        // 跳转到提交成功页面
        navigate(`/mobile/submit-success/${result.id}`, {
          state: {
            formId: result.id,
            templateName: template.name,
            submittedAt: new Date().toLocaleString()
          }
        });
      } else {
        message.error(result.message || '提交失败，请重试');
      }

    } catch (error) {
      console.error('Submit failed:', error);
      message.error(error.message || '提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (!template) {
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
          onFinish={handleSubmit}
          onValuesChange={handleFormChange}
          className={styles.form}
          size="large"
          disabled={readOnly} // limit entire form if readOnly is true
        >
          {/* Render dynamic form fields */}
          {template.formFields && template.formFields.map((field, index) => (
            <DynamicFormField
              key={field.name || index}
              field={field}
              form={form}
            />
          ))}

          {/* Inspection items - required */}
          {template.inspectionItems && template.inspectionItems.length > 0 && (
            <Form.Item
              label="Inspection Items *"
              name="inspectionItems"
              rules={[
                { required: true, message: 'Please select at least one inspection item' }
              ]}
              className={styles.formItem}
            >
              <div className={styles.inspectionItems}>
                {template.inspectionItems.map((item) => (
                  <div key={item.key} className={styles.inspectionItemWrapper}>
                    <div
                      className={styles.inspectionItem}
                      onClick={() => handleInspectionItemClick(item.key)}
                    >
                      <Form.Item
                        name={item.key}
                        valuePropName="checked"
                        className={styles.checkboxItem}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input type="checkbox" className={styles.checkbox} disabled={readOnly}/>
                      </Form.Item>
                      <div className={styles.itemContent}>
                        <span className={styles.itemText}>{item.name}</span>
                        <span className={styles.itemTag}>{item.tag}</span>
                      </div>
                    </div>
                    <div className={`${styles.guidanceWrapper} ${expandedItems[item.key] ? styles.expanded : styles.collapsed}`}>
                      <GuidanceContent
                        itemType={item.key}
                        guidanceContent={template.guidanceContent}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Form.Item>
          )}

          {/* Save status and buttons */}
          <div className={styles.saveStatus}>
            {saving && (
              <div className={styles.savingIndicator}>
                <Spin size="small" /> 正在保存...
              </div>
            )}
            {lastSaved && !saving && (
              <div className={styles.lastSaved}>
                最后保存: {lastSaved.toLocaleTimeString()}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <Form.Item className={styles.submitButton}>
            <div className={styles.buttonGroup}>
              {!readOnly && (
                <>
                <Button
                  icon={<SaveOutlined />}
                  onClick={handleManualSave}
                  loading={saving}
                  className={styles.saveBtn}
                  size="large"
                >
                  Save for Later
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className={styles.submitBtn}
                  size="large"
                >
                  Submit Inspection
                </Button>
                </>
              )}
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default InspectionForm;
