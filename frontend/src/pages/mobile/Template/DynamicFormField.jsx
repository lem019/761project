import React from 'react';
import { Form, Input, DatePicker } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import styles from './DynamicFormField.module.less';

const { TextArea } = Input;

/**
 * Dynamic form field renderer
 * Renders form fields based on template configuration
 */
const DynamicFormField = ({ field, form }) => {
  const { name, label, type, required, placeholder, validation, format, rows } = field;

  const commonProps = {
    placeholder,
    className: type === 'textarea' ? styles.textArea : styles.input
  };

  switch (type) {
    case 'input':
      return (
        <Form.Item
          label={`${label}${required ? ' *' : ''}`}
          name={name}
          rules={validation ? [validation] : []}
          className={styles.formItem}
        >
          <Input {...commonProps} />
        </Form.Item>
      );

    case 'textarea':
      return (
        <Form.Item
          label={`${label}${required ? ' *' : ''}`}
          name={name}
          rules={validation ? [validation] : []}
          className={styles.formItem}
        >
          <TextArea 
            {...commonProps}
            rows={rows || 3}
          />
        </Form.Item>
      );

    case 'datePicker':
      return (
        <Form.Item
          label={`${label}${required ? ' *' : ''}`}
          name={name}
          rules={validation ? [validation] : []}
          className={styles.formItem}
        >
          <DatePicker
            placeholder={placeholder}
            format={format || 'DD/MM/YYYY'}
            suffixIcon={<CalendarOutlined />}
            className={styles.datePicker}
          />
        </Form.Item>
      );

    default:
      return null;
  }
};

export default DynamicFormField;
