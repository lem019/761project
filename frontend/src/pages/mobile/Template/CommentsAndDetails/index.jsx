import React from 'react';
import { Form, Input, InputNumber, Radio, Checkbox, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './index.module.less';

/**
 * 渲染单个检查项的“评论与细项”动态字段
 */
const CommentsAndDetails = ({ item }) => {
  const details = Array.isArray(item?.commentsAndDetails) ? item.commentsAndDetails : [];
  if (!details.length) return null;

  return (
    <div style={{ marginTop: 12 }}>
      {details.map((detail, idx) => {
        const dType = detail?.type;
        const dLabel = detail?.label;
        const namePath = ['inspectionItems', item.key, 'commentsAndDetails', detail.key];

        // 统一 options 解析（radio/checkbox 的 label 字段在模板中即为 options 数组）
        const options = Array.isArray(dLabel) ? dLabel : [];

        switch (dType) {
          case 'number':
            return (
              <Form.Item
                key={detail.key}
                name={namePath}
                label={typeof dLabel === 'string' ? dLabel : undefined}
                className={styles.formItem}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            );
          case 'input':
            if (Array.isArray(dLabel)) {
              return (
                <div key={idx}>
                  {dLabel.map((lbl, subIdx) => (
                    <Form.Item
                      key={`${idx}-${subIdx}`}
                      name={[...namePath, subIdx]}
                      label={lbl}
                      className={styles.formItem}
                    >
                      <Input />
                    </Form.Item>
                  ))}
                </div>
              );
            }
            return (
              <Form.Item
                key={idx}
                name={namePath}
                label={typeof dLabel === 'string' ? dLabel : undefined}
                className={styles.formItem}
              >
                <Input />
              </Form.Item>
            );
          case 'radio':
            if (Array.isArray(dLabel)) {
              return (
                <Form.Item
                  key={idx}
                  name={namePath}
                  label={undefined}
                  className={styles.formItem}
                >
                  <Radio.Group options={options.map(o => ({ label: o, value: o }))} />
                </Form.Item>
              );
            }
            // dLabel 为字符串时，显示单个 Input 框
            return (
              <Form.Item
                key={idx}
                name={namePath}
                label={typeof dLabel === 'string' ? dLabel : undefined}
                className={styles.formItem}
              >
                <Input />
              </Form.Item>
            );
          case 'checkbox':
            return (
              <Form.Item
                key={idx}
                name={namePath}
                label={typeof dLabel === 'string' ? dLabel : undefined}
                className={styles.formItem}
              >
                <Checkbox.Group options={options.map(o => ({ label: o, value: o }))} />
              </Form.Item>
            );
          default:
            return null;
        }
      })}
      {/* upload image area */}
      <Form.Item
        name={['inspectionItems', item.key, 'uploadedImages']}
        label="Upload Images"
        valuePropName="fileList"
        getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
        className={styles.formItem}
      >
        <Upload
          listType="picture-card"
          multiple
          accept="image/*"
          beforeUpload={() => false}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      </Form.Item>
      
    </div>
  );
};

export default CommentsAndDetails;