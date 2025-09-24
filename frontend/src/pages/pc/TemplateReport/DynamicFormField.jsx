import React from 'react';
import { Form, Input, DatePicker } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import styles from './DynamicFormField.module.less';

const { TextArea } = Input;

/**
 * Dynamic form field renderer
 * Renders form fields based on template configuration in table format
 */
const DynamicFormField = ({ field, form }) => {
  const { name, label, type, required, placeholder, validation, format, rows } = field;

  const renderInput = () => {
    switch (type) {
      case 'input':
        return (
          <Input 
            placeholder={placeholder}
            className={styles.tableInput}
          />
        );

      case 'textarea':
        return (
          <TextArea 
            placeholder={placeholder}
            rows={rows || 3}
            className={styles.tableTextArea}
          />
        );

      case 'datePicker':
        return (
          <DatePicker
            placeholder={placeholder}
            format={format || 'DD/MM/YYYY'}
            suffixIcon={<CalendarOutlined />}
            className={styles.tableDatePicker}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.tableRow}>
      <div className={styles.tableLabel}>
        {label}{required ? ' *' : ''}
      </div>
      <Form.Item
          name={name}
          rules={validation ? [validation] : []}
          className={styles.tableFormItem}
        >
          {renderInput()}
        </Form.Item>
    </div>
  );
};

export default DynamicFormField;
