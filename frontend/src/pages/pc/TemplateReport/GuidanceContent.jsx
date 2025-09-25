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
   * 处理勾选项（本组件内本地状态，不依赖外部 Form 上下文）
   */
  const handleCheckboxChange = (item, checked) => {
    setCheckedItems((prev) => ({ ...prev, [item]: checked }));
  };

  /**
   * 统一获取并标准化指导内容：
   * - 若为数组结构：直接返回数组
   * - 若为对象结构：从 checklist/image/video 组装为数组
   * - 否则返回空数组
   */
  const getNormalizedContent = (type) => {
    const raw = guidanceContent && guidanceContent[type];
    if (!raw) return [];

    if (Array.isArray(raw)) {
      return raw;
    }

    if (typeof raw === 'object') {
      const list = [];
      if (Array.isArray(raw.checklist)) {
        raw.checklist.forEach((text, index) => {
          list.push({ type: 'text', content: text, key: `text-${index}` });
        });
      }
      if (raw.image) {
        list.push({ type: 'image', content: raw.image, key: 'image' });
      }
      if (raw.video) {
        list.push({ type: 'video', content: raw.video, key: 'video' });
      }
      return list;
    }

    return [];
  };

  const content = getNormalizedContent(itemType);

  // 文本类选项用于复选框
  const textOptions = content
    .filter((entry) => entry && entry.type === 'text' && typeof entry.content === 'string')
    .map((entry, idx) => ({ label: entry.content, key: entry.key || `text-${idx}` }));

  return (
    <div className={styles.guidanceContent}>
      {/* <div className={styles.guidanceTitle}>Guidance</div> */}

      {/* 文本 checklist */}
      {textOptions.length > 0 && (
        <div className={styles.checklist}>
          {textOptions.map((opt) => (
            <div key={opt.key} className={styles.checklistItem}>
              <Checkbox
                checked={!!checkedItems[opt.label]}
                onChange={(e) => handleCheckboxChange(opt.label, e.target.checked)}
                className={styles.guidanceCheckbox}
              />
              <span className={styles.checklistText}>{opt.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* 媒体内容（图片 / 视频）*/}
      <div className={styles.guidanceMedia}>
        {content.map((entry, index) => {
          if (!entry || !entry.type) return null;
          if (entry.type === 'image' && entry.content) {
            return (
              <div key={`img-${index}`} className={styles.inspectionDiagram}>
                <div className={styles.diagramImage}>
                  <img
                    src={entry.content}
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
            );
          }
          if (entry.type === 'video' && entry.content) {
            return (
              <div key={`vid-${index}`} className={styles.guidanceVideo}>
                <div className={styles.videoPlayer}>
                  <video controls style={{ width: '100%' }}>
                    <source src={entry.content} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default GuidanceContent;
