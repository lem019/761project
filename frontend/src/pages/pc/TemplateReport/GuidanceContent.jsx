import React, { useState } from 'react';
import { Checkbox } from 'antd';
import { PlayCircleOutlined, EyeOutlined } from '@ant-design/icons';
import styles from './GuidanceContent.module.less';

/**
 * Guidance content component
 * Displays detailed guidance for a selected inspection item
 */
const GuidanceContent = ({ itemType, guidanceContent }) => {
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
    if (guidanceContent && guidanceContent[type]) {
      return guidanceContent[type];
    }
    
    // Fallback content if no guidance content is provided
    // todo 是否需要这个
    return {
      checklist: [
        "Check item functionality",
        "View inspection diagram",
        "Verify system operation",
        "Watch guidance video"
      ],
      image: "/api/placeholder/400/300"
    };
  };

  const content = getGuidanceContent(itemType);

  return (
    <div className={styles.guidanceContent}>
      {/* <div className={styles.guidanceTitle}>Guidance</div> */}
      
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

export default GuidanceContent;
