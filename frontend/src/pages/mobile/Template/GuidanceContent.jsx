import React from 'react';
import { Form, Checkbox } from 'antd';
import { PlayCircleOutlined, EyeOutlined } from '@ant-design/icons';
import styles from './GuidanceContent.module.less';

/**
 * Guidance content component
 * Displays detailed guidance for a selected inspection item
 */
const GuidanceContent = ({ itemType, guidanceContent }) => {

  /**
   * 获取指导内容（仅支持数组结构 [{ type: 'text'|'image'|'video', content: string }]）
   * @param {string} type - Inspection item type
   * @returns {Array} Guidance content configuration
   */
  const getGuidanceContent = (type) => {
    if (guidanceContent && guidanceContent[type]) {
      return guidanceContent[type];
    }
    
    // 无配置时返回空数组
    return [];
  };

  const content = getGuidanceContent(itemType);
  

  return (
    <div className={styles.guidanceContent}>
      <div className={styles.guidanceTitle}>Guidance</div>
      
      {/* 数组结构：[{type, content}] */}
      {Array.isArray(content) && (
        <>
          {(() => {
            const textOptions = content
              .filter((entry) => entry && entry.type === 'text')
              .map((entry) => ({ label: entry.content, value: entry.key }));

            return (
              <Form.Item
                name={['inspectionItems', itemType, 'guidance']}
                className={styles.checklist}
              >
                <Checkbox.Group options={textOptions} />
              </Form.Item>
            );
          })()}

          {content.map((entry, index) => {
            const { type, content: c } = entry || {};
            if (type === 'image') {
              return (
                <div key={`img-${index}`} className={styles.guidanceMedia}>
                  <div className={styles.inspectionDiagram}>
                    <div className={styles.diagramImage}>
                      <img
                        src={c}
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
                </div>
              );
            }

            if (type === 'video') {
              return (
                <div key={`vid-${index}`} className={styles.guidanceMedia}>
                  <div className={styles.guidanceVideo}>
                    <div className={styles.videoPlayer}>
                      <video controls style={{ width: '100%' }}>
                        <source src={c} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </>
      )}
    </div>
  );
};

export default GuidanceContent;
