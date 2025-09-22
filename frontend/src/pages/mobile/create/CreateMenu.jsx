import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin, message } from 'antd';
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

  // renders a menu with several items. Each item is represented as a button
  return (
    <div className={styles.menu}>
      {templates.map((template) => (
        <button
          key={template.id}
          className={styles.menuItem}
          onClick={() => handleTemplateClick(template)}
        >
          {template.name}
        </button>
      ))}
    </div>
  );
};

export default CreateMenu;
