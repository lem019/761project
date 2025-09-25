import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin, message } from 'antd';
import { ToolOutlined, SettingOutlined, SafetyOutlined, ThunderboltOutlined } from '@ant-design/icons';
import styles from './CreateMenu.module.less';
import { getFormTemplates } from '@/services/form-service';

const CreateMenu = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const data = await getFormTemplates();
        setTemplates(data);
      } catch (error) {
        message.error('获取模板列表失败');
        console.error('获取模板列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleTemplateClick = (template) => {
    // 跳转到模板页面，传递模板ID
    navigate(`/mobile/template/${template.id}`);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  // 图标映射（与 PC 一致）
  const iconMap = {
    'ToolOutlined': <ToolOutlined />,
    'SettingOutlined': <SettingOutlined />,
    'SafetyOutlined': <SafetyOutlined />,
    'ThunderboltOutlined': <ThunderboltOutlined />
  };

  // 重构为移动端卡片列表：顶部说明 + 卡片 + 底部 more coming soon
  return (
    <div className={styles.createWrapper}>
      <div className={styles.header}> 
        <div className={styles.pageTitle}>Select Template</div>
        <div className={styles.subtitle}>Choose an inspection template to create a new service check form.</div>
      </div>

      <div className={styles.cardsList}>
        {templates.map((template) => (
          <div
            key={template.id}
            className={styles.card}
            onClick={() => handleTemplateClick(template)}
          >
            <div className={styles.cardIconArea}>
              <span className={styles.cardIcon}>
                {iconMap[template.icon] || <ToolOutlined />}
              </span>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardTitle}>{template.name}</div>
              {template.description && (
                <div className={styles.cardDesc}>{template.description}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.comingSoonContainer}>
        <div className={styles.comingSoonCard}>
          <div className={styles.comingSoonTitle}>More Templates Coming Soon</div>
          <div className={styles.comingSoonText}>We're constantly adding new inspection templates.</div>
        </div>
      </div>
    </div>
  );
};

export default CreateMenu;
