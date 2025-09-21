import React, { useState } from 'react';
import { Form, Button, Card, Typography, message, Spin } from 'antd';
import DynamicFormField from './DynamicFormField';
import GuidanceContent from './GuidanceContent';
import styles from './InspectionForm.module.less';

const { Title } = Typography;

/**
 * Inspection information registration form component
 * Collects inspector info, inspection date, location details, etc.
 */
const InspectionForm = ({ template }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

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
      // Format date
      const formattedValues = {
        ...values,
        date: values.date ? values.date.format('DD/MM/YYYY') : null,
        templateId: template.id,
        templateName: template.name
      };
      
      console.log('Form submit data:', formattedValues);
      
      // TODO: Add real API call here
      // await submitInspectionData(formattedValues);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      message.success('Submit successful');

      // Reset form after successful submit
      form.resetFields();
      
    } catch (error) {
      console.error('Submit failed:', error);
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
          className={styles.form}
          size="large"
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
                        <input type="checkbox" className={styles.checkbox} />
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

          {/* Submit button */}
          <Form.Item className={styles.submitButton}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className={styles.submitBtn}
              size="large"
            >
              Submit Inspection
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default InspectionForm;
