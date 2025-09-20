import React, { useState } from 'react';
import { Form, Input, DatePicker, Button, Card, Typography, Checkbox, message } from 'antd';
import { CalendarOutlined, PlayCircleOutlined, EyeOutlined } from '@ant-design/icons';
import styles from './index.module.less';

const { Title } = Typography;
const { TextArea } = Input;

/**
 * Guidance content component
 * Displays detailed guidance for a selected inspection item
 */
const GuidanceContent = ({ itemType }) => {
  const [checkedItems, setCheckedItems] = useState({});

  /**
   * Handle checklist selection for a guidance item
   * @param {string} item - Checklist item text
   * @param {boolean} checked - Whether the item is selected
   */
  const handleCheckboxChange = (item, checked) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: checked
    }));
  };

  /**
   * Get guidance content for different inspection items
   * @param {string} type - Inspection item type
   * @returns {Object} Guidance content configuration
   */
  const getGuidanceContent = (type) => {
    const contentMap = {
      sprayBoothMake: {
        checklist: [
          "Check the overall structure of the spray booth for integrity, confirm all panels are securely connected",
          "View inspection diagram",
          "Verify the ventilation system is working properly, check fan operation sounds",
          "Watch guidance video"
        ],
        image: "/api/placeholder/400/300"
      },
      purgeCycles: {
        checklist: [
          "Check purge cycle timing and frequency settings",
          "View purge system diagram",
          "Verify purge valve operation and pressure readings",
          "Watch purge cycle demonstration video"
        ],
        image: "/api/placeholder/400/300"
      },
      exhaustAirflow: {
        checklist: [
          "Check exhaust fan operation and airflow direction",
          "View airflow measurement diagram",
          "Verify downdraught system functionality",
          "Watch airflow testing video"
        ],
        image: "/api/placeholder/400/300"
      }
    };
    return contentMap[type] || contentMap.sprayBoothMake;
  };

  const content = getGuidanceContent(itemType);

  return (
    <div className={styles.guidanceContent}>
      <div className={styles.guidanceTitle}>Guidance</div>
      
      <div className={styles.checklist}>
        {content.checklist.map((item, index) => (
          <div key={index} className={styles.checklistItem}>
            <Checkbox
              checked={checkedItems[item] || false}
              onChange={(e) => handleCheckboxChange(item, e.target.checked)}
              className={styles.guidanceCheckbox}
            />
            <span className={styles.checklistText}>{item}</span>
          </div>
        ))}
      </div>

      {/* Inspection diagram */}
      <div className={styles.guidanceMedia}>
        <div className={styles.inspectionDiagram}>
          <div className={styles.diagramImage}>
            <img 
              src={content.image} 
              alt="Inspection Diagram"
              className={styles.diagramImg}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className={styles.imagePlaceholder}>
              <EyeOutlined className={styles.placeholderIcon} />
              <span>Inspection Diagram</span>
            </div>
          </div>
        </div>

        {/* Guidance video */}
        <div className={styles.guidanceVideo}>
          <div className={styles.videoPlayer}>
            <div className={styles.videoPlaceholder}>
              <PlayCircleOutlined className={styles.playIcon} />
              <span>Click to play video</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Inspection information registration form component
 * Collects inspector info, inspection date, location details, etc.
 */
const InspectionForm = () => {
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

  return (
    <div className={styles.container}>
      <Card className={styles.formCard}>
        <Title level={2} className={styles.formTitle}>
          Inspection Information Registration
        </Title>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.form}
          size="large"
        >
          {/* Inspector name - required */}
          <Form.Item
            label="Inspector *"
            name="inspector"
            rules={[
              { required: true, message: 'Please enter inspector name' }
            ]}
            className={styles.formItem}
          >
            <Input 
              placeholder="Please enter inspector name"
              className={styles.input}
            />
          </Form.Item>

          {/* Inspector mobile */}
          <Form.Item
            label="Inspector Mobile"
            name="inspectorMobile"
            rules={[
              { pattern: /^[0-9+\-\s()]+$/, message: 'Please enter a valid mobile number' }
            ]}
            className={styles.formItem}
          >
            <Input 
              placeholder="Please enter inspector mobile number"
              className={styles.input}
            />
          </Form.Item>

          {/* Inspection date - required */}
          <Form.Item
            label="Date *"
            name="date"
            rules={[
              { required: true, message: 'Please select inspection date' }
            ]}
            className={styles.formItem}
          >
            <DatePicker
              placeholder="dd/mm/yyyy"
              format="DD/MM/YYYY"
              suffixIcon={<CalendarOutlined />}
              className={styles.datePicker}
            />
          </Form.Item>

          {/* Location details */}
          <Form.Item
            label="Locations Details"
            name="locationDetails"
            className={styles.formItem}
          >
            <TextArea 
              placeholder="Please enter location details"
              rows={3}
              className={styles.textArea}
            />
          </Form.Item>

          {/* Contact person */}
          <Form.Item
            label="Contact Person"
            name="contactPerson"
            className={styles.formItem}
          >
            <Input 
              placeholder="Please enter contact person name"
              className={styles.input}
            />
          </Form.Item>

          {/* Business name */}
          <Form.Item
            label="Business Name"
            name="businessName"
            className={styles.formItem}
          >
            <Input 
              placeholder="Please enter business name"
              className={styles.input}
            />
          </Form.Item>

          {/* Address */}
          <Form.Item
            label="Address"
            name="address"
            className={styles.formItem}
          >
            <TextArea 
              placeholder="Please enter business address"
              rows={3}
              className={styles.textArea}
            />
          </Form.Item>

          {/* Suburb / Area */}
          <Form.Item
            label="Suburb"
            name="suburb"
            className={styles.formItem}
          >
            <Input 
              placeholder="Please enter suburb/area"
              className={styles.input}
            />
          </Form.Item>

          {/* Phone */}
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { pattern: /^[0-9+\-\s()]+$/, message: 'Please enter a valid phone number' }
            ]}
            className={styles.formItem}
          >
            <Input 
              placeholder="Please enter phone number"
              className={styles.input}
            />
          </Form.Item>

          {/* Email - required */}
          <Form.Item
            label="Email *"
            name="email"
            rules={[
              { required: true, message: 'Please enter email address' },
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
            className={styles.formItem}
          >
            <Input 
              placeholder="Please enter email address"
              className={styles.input}
            />
          </Form.Item>

          {/* Inspection items - required */}
          <Form.Item
            label="Inspection Items *"
            name="inspectionItems"
            rules={[
              { required: true, message: 'Please select at least one inspection item' }
            ]}
            className={styles.formItem}
          >
            <div className={styles.inspectionItems}>
              {/* Spray Booth Make */}
              <div className={styles.inspectionItemWrapper}>
                <div 
                  className={styles.inspectionItem}
                  onClick={() => handleInspectionItemClick('sprayBoothMake')}
                >
                  <Form.Item
                    name="sprayBoothMake"
                    valuePropName="checked"
                    className={styles.checkboxItem}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input type="checkbox" className={styles.checkbox} />
                  </Form.Item>
                  <div className={styles.itemContent}>
                    <span className={styles.itemText}>Spray Booth Make</span>
                    <span className={styles.itemTag}>visual</span>
                  </div>
                </div>
                <div className={`${styles.guidanceWrapper} ${expandedItems.sprayBoothMake ? styles.expanded : styles.collapsed}`}>
                  <GuidanceContent itemType="sprayBoothMake" />
                </div>
              </div>

              {/* Purge Cycles */}
              <div className={styles.inspectionItemWrapper}>
                <div 
                  className={styles.inspectionItem}
                  onClick={() => handleInspectionItemClick('purgeCycles')}
                >
                  <Form.Item
                    name="purgeCycles"
                    valuePropName="checked"
                    className={styles.checkboxItem}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input type="checkbox" className={styles.checkbox} />
                  </Form.Item>
                  <div className={styles.itemContent}>
                    <span className={styles.itemText}>Purge Cycles</span>
                    <span className={styles.itemTag}>Operation</span>
                  </div>
                </div>
                <div className={`${styles.guidanceWrapper} ${expandedItems.purgeCycles ? styles.expanded : styles.collapsed}`}>
                  <GuidanceContent itemType="purgeCycles" />
                </div>
              </div>

              {/* Exhaust Airflow */}
              <div className={styles.inspectionItemWrapper}>
                <div 
                  className={styles.inspectionItem}
                  onClick={() => handleInspectionItemClick('exhaustAirflow')}
                >
                  <Form.Item
                    name="exhaustAirflow"
                    valuePropName="checked"
                    className={styles.checkboxItem}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input type="checkbox" className={styles.checkbox} />
                  </Form.Item>
                  <div className={styles.itemContent}>
                    <span className={styles.itemText}>Exhaust Airflow Spraybooth Downdraught spray booth</span>
                    <span className={styles.itemTag}>hot wire probe</span>
                  </div>
                </div>
                <div className={`${styles.guidanceWrapper} ${expandedItems.exhaustAirflow ? styles.expanded : styles.collapsed}`}>
                  <GuidanceContent itemType="exhaustAirflow" />
                </div>
              </div>
            </div>
          </Form.Item>

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